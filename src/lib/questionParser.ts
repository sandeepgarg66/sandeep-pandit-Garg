import type { QuestionOptionKey } from '../types/quiz';

export interface QuestionValidationFlags {
  missingAnswer?: boolean;
  missingOption?: boolean;
  duplicate?: boolean;
  uncertainAnswer?: boolean;
}

export interface StagedQuestionItem {
  id: string;
  statement: string;
  statementHindi?: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: QuestionOptionKey | '';
  explanation: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  selected: boolean;
  source: 'ai' | 'file' | 'bulk_paste';
  validationFlags: QuestionValidationFlags;
}

export function normalizeStatementKey(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[?!.,:;'"`()[\]]+/g, '');
}

export function applyQuestionBankFlags(
  items: StagedQuestionItem[],
  existingBankStatements: Iterable<string> = []
): StagedQuestionItem[] {
  const bankSet = new Set<string>();
  for (const s of existingBankStatements) {
    const norm = normalizeStatementKey(s);
    if (norm) bankSet.add(norm);
  }

  const seenInBatch = new Set<string>();

  return items.map(item => {
    const norm = normalizeStatementKey(item.statement || '');
    const isDupInBank = Boolean(norm && bankSet.has(norm));
    const isDupInBatch = Boolean(norm && seenInBatch.has(norm));
    if (norm) seenInBatch.add(norm);

    const missingOption =
      !item.options?.A?.trim() ||
      !item.options?.B?.trim() ||
      !item.options?.C?.trim() ||
      !item.options?.D?.trim();
    const missingAnswer = !['A', 'B', 'C', 'D'].includes(item.correctAnswer);
    const uncertainAnswer = Boolean(item.validationFlags?.uncertainAnswer);
    const duplicate = isDupInBank || isDupInBatch;

    return {
      ...item,
      validationFlags: {
        ...item.validationFlags,
        missingAnswer,
        missingOption,
        uncertainAnswer,
        duplicate
      }
    };
  });
}

function normalizeDifficulty(val: unknown, fallback: 'Easy' | 'Medium' | 'Hard'): 'Easy' | 'Medium' | 'Hard' {
  const s = String(val || '').trim().toLowerCase();
  if (s === 'easy' || s === 'सरल') return 'Easy';
  if (s === 'hard' || s === 'tough' || s === 'कठिन') return 'Hard';
  if (s === 'medium' || s === 'moderate' || s === 'मध्यम') return 'Medium';
  return fallback;
}

function resolveCorrectAnswerKey(
  rawAns: unknown,
  options: { A: string; B: string; C: string; D: string }
): { key: QuestionOptionKey | ''; uncertain: boolean } {
  const cleaned = String(rawAns || '').trim();
  if (!cleaned) return { key: '', uncertain: false };

  // Direct letter patterns: "A", "(B)", "Option C", "Ans: D"
  const letterMatch = cleaned.match(/^(?:option\s*)?[\(\[]?([A-Da-d])[\)\]\.]?$/i);
  if (letterMatch) {
    return { key: letterMatch[1].toUpperCase() as QuestionOptionKey, uncertain: false };
  }

  // Numeric mapping 1-4
  if (/^[1-4]$/.test(cleaned)) {
    const map: Record<string, QuestionOptionKey> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
    return { key: map[cleaned], uncertain: false };
  }

  // Match against option text cleanly
  const lower = cleaned.toLowerCase();
  for (const key of ['A', 'B', 'C', 'D'] as const) {
    if (options[key] && options[key].trim().toLowerCase() === lower) {
      return { key, uncertain: false };
    }
  }

  // Fallback embedded letter like "B - Article 280"
  const embedded = cleaned.match(/^\s*[\(\[]?([A-Da-d])[\)\.\:\-\s]/);
  if (embedded) {
    return { key: embedded[1].toUpperCase() as QuestionOptionKey, uncertain: true };
  }

  return { key: '', uncertain: true };
}

/**
 * Parses unstructured or numbered MCQ text blocks (used by Copy-Paste & PDF/DOCX/TXT import).
 */
export function parseBulkTextToQuestionsPure(
  rawText: string,
  defaultSubject: string = 'General Studies',
  defaultTopic: string = 'General Topic',
  defaultDifficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium',
  source: 'file' | 'bulk_paste' = 'bulk_paste'
): StagedQuestionItem[] {
  if (!rawText || !rawText.trim()) return [];

  const normalizedText = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedText.split('\n').map(l => l.trimEnd());
  const chunks: string[][] = [];
  let currentChunk: string[] = [];

  const questionStartRegex = /^(?:(?:Q(?:uestion)?\s*\.?\s*[\d]+|प्र(?:श्न)?\s*\.?\s*[\d]+|[\d]{1,3})[\.\:\-\)]|\(?[\d]{1,3}\))/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (questionStartRegex.test(line) && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = [line];
    } else {
      if (line.length > 0 || currentChunk.length > 0) {
        currentChunk.push(line);
      }
    }
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  const finalChunks =
    chunks.length > 1
      ? chunks
      : normalizedText
          .split(/\n\s*\n/)
          .map(c => c.split('\n'))
          .filter(c => c.some(l => l.trim().length > 0));

  const parsedQuestions: StagedQuestionItem[] = [];
  const baseStamp = Date.now();

  finalChunks.forEach((chunkLines, chunkIndex) => {
    let statement = '';
    let statementHindi = '';
    const options: { A: string; B: string; C: string; D: string } = { A: '', B: '', C: '', D: '' };
    let correctAnswer: QuestionOptionKey | '' = '';
    let uncertainAnswer = false;
    let explanation = '';

    let parsingState: 'statement' | 'options' | 'explanation' = 'statement';
    let currentOptKey: 'A' | 'B' | 'C' | 'D' | null = null;

    const optRegex = /^\s*[\(\[]?([A-Da-d])[\.\:\)\-\]]\s*(.*)$/;
    const answerRegex = /^\s*(?:Ans(?:wer)?|Correct(?:\s*(?:Answer|Option))?|Key|उत्तर)\s*[\:\-\=]?\s*(.+)$/i;
    const expRegex = /^\s*(?:Exp(?:lanation)?|Solution|Description|Hint|व्याख्या)\s*[\:\-\=]?\s*(.*)$/i;

    chunkLines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const ansMatch = trimmed.match(answerRegex);
      if (ansMatch) {
        const resolved = resolveCorrectAnswerKey(ansMatch[1], options);
        correctAnswer = resolved.key;
        if (resolved.uncertain) uncertainAnswer = true;
        parsingState = 'options';
        currentOptKey = null;
        return;
      }

      const expMatch = trimmed.match(expRegex);
      if (expMatch) {
        explanation = expMatch[1].trim();
        parsingState = 'explanation';
        currentOptKey = null;
        return;
      }

      const optMatch = trimmed.match(optRegex);
      if (optMatch) {
        parsingState = 'options';
        const key = optMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D';
        if (['A', 'B', 'C', 'D'].includes(key)) {
          currentOptKey = key;
          options[key] = optMatch[2].trim();
        }
        return;
      }

      if (parsingState === 'statement') {
        const cleaned = trimmed.replace(questionStartRegex, '').trim();
        if (/[\u0900-\u097F]/.test(cleaned)) {
          statementHindi = statementHindi ? `${statementHindi} ${cleaned}` : cleaned;
        } else {
          statement = statement ? `${statement} ${cleaned}` : cleaned;
        }
      } else if (parsingState === 'options' && currentOptKey) {
        options[currentOptKey] = `${options[currentOptKey]} ${trimmed}`.trim();
      } else if (parsingState === 'explanation') {
        explanation = `${explanation} ${trimmed}`.trim();
      }
    });

    const missingOption = !options.A.trim() || !options.B.trim() || !options.C.trim() || !options.D.trim();
    const missingAnswer = !correctAnswer;

    if (statement.length > 5 || statementHindi.length > 5) {
      parsedQuestions.push({
        id: `staged-${source}-${baseStamp}-${chunkIndex}-${Math.floor(Math.random() * 1000)}`,
        statement: statement || statementHindi,
        statementHindi: statementHindi && statement ? statementHindi : undefined,
        options,
        correctAnswer,
        explanation: explanation || 'Refer to standard curriculum material for review.',
        subject: defaultSubject,
        topic: defaultTopic,
        difficulty: defaultDifficulty,
        marks: 2,
        selected: !missingAnswer && !missingOption && !uncertainAnswer,
        source,
        validationFlags: {
          missingAnswer,
          missingOption,
          uncertainAnswer,
          duplicate: false
        }
      });
    }
  });

  return applyQuestionBankFlags(parsedQuestions);
}

/**
 * Parses tabular spreadsheet rows (XLSX / CSV) using flexible header matching.
 */
export function parseSpreadsheetRowsToQuestions(
  rows: Record<string, unknown>[],
  defaultSubject: string = 'General Studies',
  defaultTopic: string = 'Uploaded Sheet',
  defaultDifficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium'
): StagedQuestionItem[] {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  const findField = (row: Record<string, unknown>, candidates: string[]): unknown => {
    const entries = Object.entries(row);
    for (const alias of candidates) {
      const found = entries.find(([k]) => k.trim().toLowerCase().replace(/[\s_-]+/g, '') === alias);
      if (found && String(found[1] ?? '').trim() !== '') {
        return found[1];
      }
    }
    return '';
  };

  const staged: StagedQuestionItem[] = [];
  const baseStamp = Date.now();

  rows.forEach((row, idx) => {
    const statement = String(
      findField(row, ['statement', 'question', 'questionen', 'questiontext', 'q', 'mcq', 'prompt'])
    ).trim();
    const statementHindi = String(
      findField(row, ['statementhindi', 'questionhindi', 'questionhi', 'hindi', 'hindiquestion'])
    ).trim();

    if (!statement && !statementHindi) return;

    const options = {
      A: String(findField(row, ['optiona', 'opta', 'a', 'choicea'])).trim(),
      B: String(findField(row, ['optionb', 'optb', 'b', 'choiceb'])).trim(),
      C: String(findField(row, ['optionc', 'optc', 'c', 'choicec'])).trim(),
      D: String(findField(row, ['optiond', 'optd', 'd', 'choiced'])).trim()
    };

    const rawAns = findField(row, ['correctanswer', 'correct', 'answer', 'ans', 'key', 'correctoption']);
    const resolved = resolveCorrectAnswerKey(rawAns, options);

    const explanation = String(
      findField(row, ['explanation', 'solution', 'rationale', 'hint', 'description'])
    ).trim();

    const subject = String(findField(row, ['subject', 'category']) || defaultSubject).trim();
    const topic = String(findField(row, ['topic', 'chapter', 'unit']) || defaultTopic).trim();
    const difficulty = normalizeDifficulty(findField(row, ['difficulty', 'level']), defaultDifficulty);
    const rawMarks = Number(findField(row, ['marks', 'score', 'points']));
    const marks = Number.isFinite(rawMarks) && rawMarks > 0 ? rawMarks : 2;

    const missingOption = !options.A || !options.B || !options.C || !options.D;
    const missingAnswer = !resolved.key;

    staged.push({
      id: `staged-file-row-${baseStamp}-${idx}-${Math.floor(Math.random() * 1000)}`,
      statement: statement || statementHindi,
      statementHindi: statement && statementHindi ? statementHindi : undefined,
      options,
      correctAnswer: resolved.key,
      explanation: explanation || 'Refer to standard curriculum material for review.',
      subject,
      topic,
      difficulty,
      marks,
      selected: !missingAnswer && !missingOption && !resolved.uncertain,
      source: 'file',
      validationFlags: {
        missingAnswer,
        missingOption,
        uncertainAnswer: resolved.uncertain,
        duplicate: false
      }
    });
  });

  return applyQuestionBankFlags(staged);
}
