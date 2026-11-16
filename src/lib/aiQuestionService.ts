import { QuestionOptionKey } from '../types/quiz';
import { auth } from './firebase';
import {
  applyQuestionBankFlags,
  parseBulkTextToQuestionsPure,
  QuestionValidationFlags,
  StagedQuestionItem
} from './questionParser';

export type { QuestionValidationFlags };
export type StagedQuestion = StagedQuestionItem;
export { applyQuestionBankFlags };

export interface AIGenerationParams {
  subject: string;
  topic: string;
  count: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: 'English' | 'Hindi' | 'Both';
  instructionsOrSource?: string;
}

export interface ParsedDocumentResult {
  questions: StagedQuestion[];
  warnings: string[];
  fileType: string;
  totalExtracted: number;
}

export const MAX_DOCUMENT_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB

/**
 * Shared parser for bulk copy-pasted MCQ text.
 * Supports EN/HI statements, options A-D, Ans/Key/उत्तर, and Explanation/व्याख्या.
 */
export function parseBulkTextToQuestions(
  rawText: string,
  defaultSubject: string = 'General Studies',
  defaultTopic: string = 'General Topic',
  defaultDifficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium',
  existingBankStatements: Iterable<string> = []
): StagedQuestion[] {
  const parsed = parseBulkTextToQuestionsPure(
    rawText,
    defaultSubject,
    defaultTopic,
    defaultDifficulty,
    'bulk_paste'
  );
  return applyQuestionBankFlags(parsed, existingBankStatements);
}

function mapRawItemToStaged(
  q: Record<string, unknown>,
  idx: number,
  source: 'ai' | 'file',
  fallbackSubject: string,
  fallbackTopic: string,
  fallbackDifficulty: 'Easy' | 'Medium' | 'Hard'
): StagedQuestion {
  const opts = (q.options && typeof q.options === 'object' ? q.options : {}) as Record<string, unknown>;
  const options = {
    A: String(opts.A || '').trim(),
    B: String(opts.B || '').trim(),
    C: String(opts.C || '').trim(),
    D: String(opts.D || '').trim()
  };
  const rawAns = String(q.correctAnswer || '').trim().toUpperCase();
  const correctAnswer = (['A', 'B', 'C', 'D'].includes(rawAns) ? rawAns : '') as QuestionOptionKey | '';
  const flags = (q.validationFlags && typeof q.validationFlags === 'object'
    ? q.validationFlags
    : {}) as QuestionValidationFlags;

  const missingOption =
    Boolean(flags.missingOption) || !options.A || !options.B || !options.C || !options.D;
  const missingAnswer = Boolean(flags.missingAnswer) || !correctAnswer;
  const uncertainAnswer = Boolean(flags.uncertainAnswer);
  const duplicate = Boolean(flags.duplicate);

  const rawDiff = String(q.difficulty || fallbackDifficulty);
  const difficulty: 'Easy' | 'Medium' | 'Hard' =
    rawDiff === 'Easy' || rawDiff === 'Medium' || rawDiff === 'Hard'
      ? rawDiff
      : fallbackDifficulty;

  return {
    id: String(q.id || `staged-${source}-${Date.now()}-${idx}`),
    statement: String(q.statement || '').trim(),
    statementHindi: typeof q.statementHindi === 'string' && q.statementHindi.trim() ? q.statementHindi.trim() : undefined,
    options,
    correctAnswer,
    explanation: String(q.explanation || 'Refer to standard curriculum material for review.').trim(),
    subject: String(q.subject || fallbackSubject).trim(),
    topic: String(q.topic || fallbackTopic).trim(),
    difficulty,
    marks: typeof q.marks === 'number' && q.marks > 0 ? q.marks : 2,
    selected: typeof q.selected === 'boolean' ? q.selected && !missingAnswer && !missingOption : !missingAnswer && !missingOption && !uncertainAnswer,
    source,
    validationFlags: {
      missingAnswer,
      missingOption,
      uncertainAnswer,
      duplicate
    }
  };
}

/**
 * Generates curriculum-grade MCQs strictly via the authenticated server-side Gemini endpoint.
 * Never falls back silently to hardcoded/mock templates.
 */
export async function generateQuestionsWithAI(
  params: AIGenerationParams,
  existingBankStatements: Iterable<string> = []
): Promise<StagedQuestion[]> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error(
      'AI प्रश्न जनरेटर का उपयोग करने के लिए लॉगिन आवश्यक है। (Please sign in with an approved Teacher or Admin account.)'
    );
  }

  const token = await user.getIdToken(true);
  const res = await fetch('/api/ai/generate-questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(params)
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof payload?.error === 'string' && payload.error.trim()
        ? payload.error
        : `AI प्रश्न जनरेशन विफल रही (HTTP ${res.status})। कृपया पुनः प्रयास करें।`
    );
  }

  if (!Array.isArray(payload?.questions) || payload.questions.length === 0) {
    throw new Error(
      'AI से कोई मान्य प्रश्न प्राप्त नहीं हुआ। कृपया विषय या निर्देश स्पष्ट करके पुनः प्रयास करें। (No valid MCQs returned by Gemini AI.)'
    );
  }

  const mapped = payload.questions.map((q: Record<string, unknown>, idx: number) =>
    mapRawItemToStaged(q, idx, 'ai', params.subject, params.topic, params.difficulty)
  );

  return applyQuestionBankFlags(mapped, existingBankStatements);
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => {
      reject(new Error('फ़ाइल पढ़ने में त्रुटि हुई। (Failed to read file bytes in browser.)'));
    };
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('अमान्य फ़ाइल डेटा। (Invalid binary file payload.)'));
        return;
      }
      const commaIdx = result.indexOf(',');
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads PDF, DOCX, XLSX, CSV, TXT, or JSON to server-side in-memory parser.
 */
export async function parseDocumentFileOnServer(
  file: File,
  defaults: {
    defaultSubject?: string;
    defaultTopic?: string;
    defaultDifficulty?: 'Easy' | 'Medium' | 'Hard';
  } = {},
  existingBankStatements: Iterable<string> = []
): Promise<ParsedDocumentResult> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error(
      'फ़ाइल इम्पोर्ट करने के लिए लॉगिन आवश्यक है। (Please sign in with an approved Teacher or Admin account.)'
    );
  }

  if (file.size === 0) {
    throw new Error('चयनित फ़ाइल खाली (0 bytes) है। (Selected file is empty.)');
  }

  if (file.size > MAX_DOCUMENT_UPLOAD_BYTES) {
    throw new Error(
      'फ़ाइल का आकार 8 MB सीमा से अधिक है। कृपया छोटी फ़ाइल अपलोड करें। (File exceeds 8 MB limit.)'
    );
  }

  const fileDataBase64 = await readFileAsBase64(file);
  const token = await user.getIdToken(true);

  const res = await fetch('/api/questions/parse-file', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type,
      fileDataBase64,
      defaultSubject: defaults.defaultSubject || 'General Studies',
      defaultTopic: defaults.defaultTopic || file.name.replace(/\.[^/.]+$/, '') || 'Uploaded Document',
      defaultDifficulty: defaults.defaultDifficulty || 'Medium'
    })
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof payload?.error === 'string' && payload.error.trim()
        ? payload.error
        : `फ़ाइल पार्स करने में त्रुटि (HTTP ${res.status})।`
    );
  }

  const rawQuestions = Array.isArray(payload?.questions) ? payload.questions : [];
  const mapped = rawQuestions.map((q: Record<string, unknown>, idx: number) =>
    mapRawItemToStaged(
      q,
      idx,
      'file',
      defaults.defaultSubject || 'General Studies',
      defaults.defaultTopic || 'Uploaded Document',
      defaults.defaultDifficulty || 'Medium'
    )
  );

  return {
    questions: applyQuestionBankFlags(mapped, existingBankStatements),
    warnings: Array.isArray(payload?.warnings) ? payload.warnings.map(String) : [],
    fileType: String(payload?.fileType || ''),
    totalExtracted: Number(payload?.totalExtracted || mapped.length)
  };
}
