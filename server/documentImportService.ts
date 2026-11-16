import path from 'node:path';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { RoleStoreAdapter, VerifiedCallerToken } from './firebaseAdmin.ts';
import { RoleServiceHttpError, resolveVerifiedEducator } from './roleService.ts';
import {
  parseBulkTextToQuestionsPure,
  parseSpreadsheetRowsToQuestions,
  applyQuestionBankFlags,
  type StagedQuestionItem
} from '../src/lib/questionParser.ts';

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB in-memory limit
const SUPPORTED_EXTENSIONS = new Set(['.pdf', '.docx', '.xlsx', '.csv', '.json', '.txt']);

export interface ParseQuestionFileInput {
  fileName: string;
  mimeType?: string;
  buffer: Buffer;
  defaultSubject?: string;
  defaultTopic?: string;
  defaultDifficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface ParseQuestionFileResult {
  fileName: string;
  fileType: string;
  extractedCount: number;
  questions: StagedQuestionItem[];
  warnings: string[];
}

async function extractTextFromPdfBuffer(buffer: Buffer): Promise<{ text: string; numPages: number }> {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
    disableFontFace: true,
    isEvalSupported: false,
    verbosity: 0
  });

  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages || 0;
  const pageTexts: string[] = [];

  try {
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const lines: string[] = [];
      let currentLine = '';

      for (const item of textContent.items as Array<{ str?: string; hasEOL?: boolean }>) {
        if (typeof item.str !== 'string') continue;
        currentLine += item.str;
        if (item.hasEOL) {
          lines.push(currentLine.trim());
          currentLine = '';
        } else if (item.str && !item.str.endsWith(' ')) {
          currentLine += ' ';
        }
      }
      if (currentLine.trim()) {
        lines.push(currentLine.trim());
      }
      pageTexts.push(lines.filter(Boolean).join('\n'));
    }
  } finally {
    await pdfDoc.destroy().catch(() => {});
  }

  return {
    text: pageTexts.join('\n\n'),
    numPages
  };
}

function parseJsonQuestionBuffer(
  text: string,
  defaultSubject: string,
  defaultTopic: string,
  defaultDifficulty: 'Easy' | 'Medium' | 'Hard'
): StagedQuestionItem[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new RoleServiceHttpError(
      400,
      'Invalid JSON file format. / अमान्य JSON फ़ाइल फॉर्मेट।'
    );
  }

  const rawList = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object' && Array.isArray((parsed as Record<string, unknown>).questions)
    ? ((parsed as Record<string, unknown>).questions as unknown[])
    : null;

  if (!rawList) {
    throw new RoleServiceHttpError(
      400,
      'JSON must be an array of question objects or { "questions": [...] }. / JSON में प्रश्नों की array होनी चाहिए।'
    );
  }

  const stamp = Date.now();
  const mapped: StagedQuestionItem[] = [];

  rawList.forEach((raw, idx) => {
    if (!raw || typeof raw !== 'object') return;
    const item = raw as Record<string, unknown>;
    const opts = item.options && typeof item.options === 'object' ? (item.options as Record<string, unknown>) : {};
    const A = String(opts.A ?? '').trim();
    const B = String(opts.B ?? '').trim();
    const C = String(opts.C ?? '').trim();
    const D = String(opts.D ?? '').trim();
    const rawAns = String(item.correctAnswer ?? '').trim().toUpperCase();
    const correctAnswer = rawAns === 'A' || rawAns === 'B' || rawAns === 'C' || rawAns === 'D' ? rawAns : '';
    const statement = String(item.statement || item.question || '').trim();
    if (!statement) return;

    const missingOption = !A || !B || !C || !D;
    const missingAnswer = !correctAnswer;
    const diffRaw = item.difficulty;
    const difficulty = diffRaw === 'Easy' || diffRaw === 'Medium' || diffRaw === 'Hard' ? diffRaw : defaultDifficulty;

    mapped.push({
      id: `staged-file-json-${stamp}-${idx}`,
      statement,
      statementHindi: typeof item.statementHindi === 'string' ? item.statementHindi.trim() || undefined : undefined,
      options: { A, B, C, D },
      correctAnswer,
      explanation: String(item.explanation || 'Refer to standard curriculum material for review.').trim(),
      subject: String(item.subject || defaultSubject).trim(),
      topic: String(item.topic || defaultTopic).trim(),
      difficulty,
      marks: Number(item.marks) > 0 ? Number(item.marks) : 2,
      selected: !missingAnswer && !missingOption,
      source: 'file',
      validationFlags: {
        missingAnswer,
        missingOption,
        uncertainAnswer: false,
        duplicate: false
      }
    });
  });

  return applyQuestionBankFlags(mapped);
}

export async function parseUploadedQuestionFile(
  input: ParseQuestionFileInput
): Promise<ParseQuestionFileResult> {
  const safeFileName = path.basename((input.fileName || '').trim());
  if (!safeFileName) {
    throw new RoleServiceHttpError(400, 'File name is required. / फ़ाइल का नाम आवश्यक है।');
  }

  const ext = path.extname(safeFileName).toLowerCase();
  if (ext === '.doc') {
    throw new RoleServiceHttpError(
      400,
      'Legacy binary .doc format is not supported. Please save as .docx and re-upload. / पुराना .doc फॉर्मेट समर्थित नहीं है, कृपया .docx में सेव करके अपलोड करें।'
    );
  }
  if (!SUPPORTED_EXTENSIONS.has(ext)) {
    throw new RoleServiceHttpError(
      400,
      `Unsupported file format (${ext || 'unknown'}). Allowed: PDF, DOCX, XLSX, CSV, JSON, TXT. / यह फ़ाइल फॉर्मेट समर्थित नहीं है।`
    );
  }

  if (!input.buffer || input.buffer.length === 0) {
    throw new RoleServiceHttpError(400, 'Uploaded file is empty. / अपलोड की गई फ़ाइल खाली है।');
  }
  if (input.buffer.length > MAX_UPLOAD_BYTES) {
    throw new RoleServiceHttpError(
      413,
      'File exceeds the 8 MB maximum upload limit. / फ़ाइल का आकार 8 MB की अधिकतम सीमा से अधिक है।'
    );
  }

  const defaultSubject = (input.defaultSubject || 'Uploaded Document').trim();
  const defaultTopic = (input.defaultTopic || safeFileName.replace(/\.[^/.]+$/, '') || 'General Topic').trim();
  const defaultDifficulty = input.defaultDifficulty || 'Medium';
  const warnings: string[] = [];
  let questions: StagedQuestionItem[] = [];

  if (ext === '.pdf') {
    let pdfData: { text: string; numPages: number };
    try {
      pdfData = await extractTextFromPdfBuffer(input.buffer);
    } catch {
      throw new RoleServiceHttpError(
        422,
        'Could not read this PDF file. It may be corrupted or password-protected. / यह PDF पढ़ी नहीं जा सकी। संभवतः फ़ाइल खराब या पासवर्ड-सुरक्षित है।'
      );
    }

    const nonWhitespaceChars = pdfData.text.replace(/\s+/g, '').length;
    if (pdfData.numPages > 0 && nonWhitespaceChars < 40) {
      throw new RoleServiceHttpError(
        422,
        'Scanned or image-only PDF detected: No selectable text found. Please upload a text-based PDF, DOCX, XLSX, or use Bulk Copy-Paste. / यह स्कैन की गई (Image-only) PDF लगती है जिसमें टेक्स्ट नहीं पढ़ा जा सका। कृपया टेक्स्ट-आधारित PDF, DOCX या XLSX अपलोड करें।'
      );
    }

    questions = parseBulkTextToQuestionsPure(
      pdfData.text,
      defaultSubject,
      defaultTopic,
      defaultDifficulty,
      'file'
    );
  } else if (ext === '.docx') {
    let rawText = '';
    try {
      const result = await mammoth.extractRawText({ buffer: input.buffer });
      rawText = result.value || '';
    } catch {
      throw new RoleServiceHttpError(
        422,
        'Could not parse DOCX document. Please check that the file is a valid Word (.docx) document. / यह DOCX फ़ाइल पढ़ी नहीं जा सकी।'
      );
    }

    if (rawText.replace(/\s+/g, '').length < 15) {
      throw new RoleServiceHttpError(
        422,
        'No readable question text was found inside this DOCX document. / इस DOCX फ़ाइल में कोई पढ़ने योग्य प्रश्न टेक्स्ट नहीं मिला।'
      );
    }

    questions = parseBulkTextToQuestionsPure(
      rawText,
      defaultSubject,
      defaultTopic,
      defaultDifficulty,
      'file'
    );
  } else if (ext === '.xlsx' || ext === '.csv') {
    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(input.buffer, { type: 'buffer' });
    } catch {
      throw new RoleServiceHttpError(
        422,
        'Could not read spreadsheet file. Please verify the XLSX/CSV structure. / स्प्रेडशीट फ़ाइल पढ़ी नहीं जा सकी।'
      );
    }

    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new RoleServiceHttpError(422, 'Spreadsheet contains no worksheets. / शीट खाली है।');
    }

    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
    questions = parseSpreadsheetRowsToQuestions(rows, defaultSubject, defaultTopic, defaultDifficulty);

    // Fallback: if single-column unstructured MCQ text was pasted into spreadsheet rows
    if (questions.length === 0) {
      const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' });
      const flattened = matrix
        .map(r => (Array.isArray(r) ? r.map(c => String(c ?? '').trim()).filter(Boolean).join(' ') : ''))
        .filter(Boolean)
        .join('\n');
      questions = parseBulkTextToQuestionsPure(
        flattened,
        defaultSubject,
        defaultTopic,
        defaultDifficulty,
        'file'
      );
    }
  } else if (ext === '.json') {
    questions = parseJsonQuestionBuffer(
      input.buffer.toString('utf-8'),
      defaultSubject,
      defaultTopic,
      defaultDifficulty
    );
  } else {
    // .txt
    const text = input.buffer.toString('utf-8');
    questions = parseBulkTextToQuestionsPure(
      text,
      defaultSubject,
      defaultTopic,
      defaultDifficulty,
      'file'
    );
  }

  if (questions.length === 0) {
    throw new RoleServiceHttpError(
      422,
      'No MCQs could be recognized in this file. Ensure numbered questions with options A–D or tabular columns (statement, optionA..D, correctAnswer) are present. / इस फ़ाइल से कोई MCQ पहचाना नहीं जा सका। कृपया प्रश्न और विकल्प A–D फॉर्मेट जाँचें।'
    );
  }

  const flaggedCount = questions.filter(
    q => q.validationFlags.missingAnswer || q.validationFlags.missingOption || q.validationFlags.uncertainAnswer
  ).length;
  if (flaggedCount > 0) {
    warnings.push(
      `${flaggedCount} question(s) were flagged for missing options, uncertain answer key, or missing correct answer. Review them before saving.`
    );
  }

  return {
    fileName: safeFileName,
    fileType: ext.replace('.', '').toUpperCase(),
    extractedCount: questions.length,
    questions,
    warnings
  };
}

export async function executeParseQuestionFile(params: {
  callerToken: VerifiedCallerToken;
  store: RoleStoreAdapter;
  body: {
    fileName?: unknown;
    mimeType?: unknown;
    contentBase64?: unknown;
    defaultSubject?: unknown;
    defaultTopic?: unknown;
    defaultDifficulty?: unknown;
  };
}): Promise<{ success: true } & ParseQuestionFileResult> {
  await resolveVerifiedEducator(params.callerToken, params.store);

  const fileName = typeof params.body.fileName === 'string' ? params.body.fileName : '';
  const mimeType = typeof params.body.mimeType === 'string' ? params.body.mimeType : undefined;
  const contentBase64 = typeof params.body.contentBase64 === 'string' ? params.body.contentBase64.trim() : '';

  if (!contentBase64) {
    throw new RoleServiceHttpError(400, 'File payload is missing. / फ़ाइल डेटा प्राप्त नहीं हुआ।');
  }

  const pureBase64 = contentBase64.includes(',') ? contentBase64.split(',').pop() || '' : contentBase64;
  const buffer = Buffer.from(pureBase64, 'base64');

  const diffRaw = params.body.defaultDifficulty;
  const defaultDifficulty: 'Easy' | 'Medium' | 'Hard' =
    diffRaw === 'Easy' || diffRaw === 'Medium' || diffRaw === 'Hard' ? diffRaw : 'Medium';

  const result = await parseUploadedQuestionFile({
    fileName,
    mimeType,
    buffer,
    defaultSubject: typeof params.body.defaultSubject === 'string' ? params.body.defaultSubject : undefined,
    defaultTopic: typeof params.body.defaultTopic === 'string' ? params.body.defaultTopic : undefined,
    defaultDifficulty
  });

  return {
    success: true,
    ...result
  };
}
