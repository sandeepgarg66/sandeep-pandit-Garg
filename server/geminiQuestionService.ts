import { GoogleGenAI, Type } from '@google/genai';
import type { RoleStoreAdapter, VerifiedCallerToken } from './firebaseAdmin.ts';
import { RoleServiceHttpError, resolveVerifiedEducator } from './roleService.ts';

export const GEMINI_QUESTION_MODEL = 'gemini-4-hydrogen';

export interface AiGenerateRequestBody {
  subject?: unknown;
  topic?: unknown;
  count?: unknown;
  difficulty?: unknown;
  language?: unknown;
  instructionsOrSource?: unknown;
}

export interface ValidatedAiGenerateInput {
  subject: string;
  topic: string;
  count: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: 'English' | 'Hindi' | 'Both';
  instructionsOrSource: string;
}

export interface GeneratedMcqItem {
  statement: string;
  statementHindi?: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export function validateAiGenerateInput(body: AiGenerateRequestBody): ValidatedAiGenerateInput {
  const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
  const topic = typeof body.topic === 'string' ? body.topic.trim() : '';

  if (!subject || subject.length > 120) {
    throw new RoleServiceHttpError(
      400,
      'Valid Subject (1–120 characters) is required. / मान्य विषय (Subject) दर्ज करना आवश्यक है।'
    );
  }
  if (!topic || topic.length > 160) {
    throw new RoleServiceHttpError(
      400,
      'Valid Topic (1–160 characters) is required. / मान्य टॉपिक दर्ज करना आवश्यक है।'
    );
  }

  const rawCount = Number(body.count ?? 5);
  if (!Number.isInteger(rawCount) || rawCount < 1 || rawCount > 50) {
    throw new RoleServiceHttpError(
      400,
      'Question count must be an integer between 1 and 50. / प्रश्नों की संख्या 1 से 50 के बीच होनी चाहिए।'
    );
  }

  const difficultyRaw = typeof body.difficulty === 'string' ? body.difficulty.trim() : 'Medium';
  const difficulty: 'Easy' | 'Medium' | 'Hard' =
    difficultyRaw === 'Easy' || difficultyRaw === 'Medium' || difficultyRaw === 'Hard'
      ? difficultyRaw
      : 'Medium';

  const languageRaw = typeof body.language === 'string' ? body.language.trim() : 'Both';
  const language: 'English' | 'Hindi' | 'Both' =
    languageRaw === 'English' || languageRaw === 'Hindi' || languageRaw === 'Both'
      ? languageRaw
      : 'Both';

  const instructionsOrSource =
    typeof body.instructionsOrSource === 'string'
      ? body.instructionsOrSource.trim().slice(0, 8000)
      : '';

  return {
    subject,
    topic,
    count: rawCount,
    difficulty,
    language,
    instructionsOrSource
  };
}

export function parseAndValidateGeminiQuestions(
  rawText: string,
  defaults: Pick<ValidatedAiGenerateInput, 'subject' | 'topic' | 'difficulty' | 'language'>
): GeneratedMcqItem[] {
  if (!rawText || !rawText.trim()) {
    throw new RoleServiceHttpError(
      502,
      'AI returned an empty response. Please try again. / AI से कोई प्रश्न प्राप्त नहीं हुआ, कृपया पुनः प्रयास करें।'
    );
  }

  let parsed: unknown;
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new RoleServiceHttpError(
      502,
      'AI response was not valid JSON. Please retry generation. / AI का उत्तर मान्य JSON में नहीं था, कृपया पुनः प्रयास करें।'
    );
  }

  const rawArray = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object' && Array.isArray((parsed as Record<string, unknown>).questions)
    ? ((parsed as Record<string, unknown>).questions as unknown[])
    : null;

  if (!rawArray) {
    throw new RoleServiceHttpError(
      502,
      'AI response did not contain a valid questions list. / AI उत्तर में प्रश्नों की सही सूची नहीं मिली।'
    );
  }

  const validQuestions: GeneratedMcqItem[] = [];
  const seenStatements = new Set<string>();

  for (const entry of rawArray) {
    if (!entry || typeof entry !== 'object') continue;
    const item = entry as Record<string, unknown>;

    const statement = typeof item.statement === 'string' ? item.statement.trim() : '';
    const statementHindi =
      typeof item.statementHindi === 'string' && item.statementHindi.trim()
        ? item.statementHindi.trim()
        : undefined;

    const optsRaw = item.options && typeof item.options === 'object' ? (item.options as Record<string, unknown>) : null;
    if (!optsRaw) continue;

    const optA = typeof optsRaw.A === 'string' ? optsRaw.A.trim() : '';
    const optB = typeof optsRaw.B === 'string' ? optsRaw.B.trim() : '';
    const optC = typeof optsRaw.C === 'string' ? optsRaw.C.trim() : '';
    const optD = typeof optsRaw.D === 'string' ? optsRaw.D.trim() : '';
    const correctAnswer = typeof item.correctAnswer === 'string' ? item.correctAnswer.trim().toUpperCase() : '';
    const explanation = typeof item.explanation === 'string' ? item.explanation.trim() : '';

    if (!statement || !optA || !optB || !optC || !optD || !explanation) continue;
    if (correctAnswer !== 'A' && correctAnswer !== 'B' && correctAnswer !== 'C' && correctAnswer !== 'D') continue;

    // Ensure distinct options and reject any accidental Option E injection inside A-D
    const optSet = new Set([optA.toLowerCase(), optB.toLowerCase(), optC.toLowerCase(), optD.toLowerCase()]);
    if (optSet.size < 4) continue;

    const stmtNorm = statement.toLowerCase().replace(/\s+/g, ' ');
    if (seenStatements.has(stmtNorm)) continue;
    seenStatements.add(stmtNorm);

    const diffVal =
      item.difficulty === 'Easy' || item.difficulty === 'Medium' || item.difficulty === 'Hard'
        ? item.difficulty
        : defaults.difficulty;

    validQuestions.push({
      statement,
      ...(statementHindi ? { statementHindi } : {}),
      options: { A: optA, B: optB, C: optC, D: optD },
      correctAnswer,
      explanation,
      subject: typeof item.subject === 'string' && item.subject.trim() ? item.subject.trim() : defaults.subject,
      topic: typeof item.topic === 'string' && item.topic.trim() ? item.topic.trim() : defaults.topic,
      difficulty: diffVal
    });
  }

  if (validQuestions.length === 0) {
    throw new RoleServiceHttpError(
      502,
      'AI returned questions that failed 4-option MCQ validation. Please retry. / AI से प्राप्त प्रश्न 4-विकल्प मानकों पर खरे नहीं उतरे, कृपया पुनः प्रयास करें।'
    );
  }

  return validQuestions;
}

export function mapGeminiErrorToHttp(err: unknown): RoleServiceHttpError {
  if (err instanceof RoleServiceHttpError) return err;

  const msg = err instanceof Error ? err.message : String(err || '');
  const lower = msg.toLowerCase();

  if (lower.includes('429') || lower.includes('quota') || lower.includes('resource_exhausted') || lower.includes('rate')) {
    return new RoleServiceHttpError(
      429,
      'Gemini API quota or rate limit exceeded. Please wait a minute and retry. / Gemini API की सीमा समाप्त हो गई है, कृपया थोड़ी देर बाद पुनः प्रयास करें।'
    );
  }
  if (lower.includes('abort') || lower.includes('timeout') || lower.includes('timed out')) {
    return new RoleServiceHttpError(
      504,
      'AI question generation timed out. Try requesting fewer questions (5–10) at once. / प्रश्न जनरेट करने में समय समाप्त हो गया। एक बार में कम प्रश्न (5–10) चुनें।'
    );
  }
  if (lower.includes('api key') || lower.includes('api_key') || lower.includes('permission') || lower.includes('401') || lower.includes('403')) {
    return new RoleServiceHttpError(
      502,
      'Server Gemini API configuration could not be authenticated. Please verify GEMINI_API_KEY on the server. / सर्वर पर GEMINI_API_KEY सत्यापित नहीं हो सका।'
    );
  }

  return new RoleServiceHttpError(
    502,
    'Failed to generate questions from Gemini AI. Please retry shortly. / Gemini AI से प्रश्न बनाने में समस्या आई, कृपया पुनः प्रयास करें।'
  );
}

function buildQuestionPrompt(input: ValidatedAiGenerateInput): string {
  const languageDirective =
    input.language === 'Hindi'
      ? 'Write the main statement, options, and explanation in clear academic Hindi (Devanagari script). Set statementHindi to the same Hindi question or omit it.'
      : input.language === 'Both'
      ? 'Write statement, options (A-D), and explanation in clear English AND always provide an accurate Hindi (Devanagari) translation of the question in statementHindi.'
      : 'Write statement, options (A-D), and explanation in clear academic English. Omit statementHindi.';

  return [
    `Generate exactly ${input.count} high-quality competitive examination Multiple Choice Questions (MCQs).`,
    `Subject: ${input.subject}`,
    `Topic: ${input.topic}`,
    `Difficulty: ${input.difficulty}`,
    `Language Mode: ${input.language}. ${languageDirective}`,
    input.instructionsOrSource
      ? `Teacher Instructions / Source Material:\n"""\n${input.instructionsOrSource}\n"""`
      : 'Align strictly with authentic Indian competitive exam standards (UPSC, SSC, State PSC, or NCERT rigor).',
    'STRICT REQUIREMENTS:',
    '1. Every question MUST have exactly 4 factual, plausible, distinct options labeled A, B, C, and D.',
    '2. NEVER include "Option E", "None of the above / Unattempted", or meta-options.',
    '3. Verify factual accuracy before choosing correctAnswer ("A", "B", "C", or "D").',
    '4. Provide a concise, authoritative explanation citing the key concept, article, formula, or historical fact.',
    '5. Do not repeat identical questions.'
  ].join('\n');
}

export async function executeGenerateQuestions(params: {
  callerToken: VerifiedCallerToken;
  store: RoleStoreAdapter;
  body: AiGenerateRequestBody;
  generateFn?: (input: ValidatedAiGenerateInput) => Promise<string>;
}): Promise<{
  success: true;
  model: string;
  requestedCount: number;
  generatedCount: number;
  questions: GeneratedMcqItem[];
}> {
  await resolveVerifiedEducator(params.callerToken, params.store);
  const input = validateAiGenerateInput(params.body);

  let rawResponseText: string;

  if (params.generateFn) {
    try {
      rawResponseText = await params.generateFn(input);
    } catch (err) {
      throw mapGeminiErrorToHttp(err);
    }
  } else {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      throw new RoleServiceHttpError(
        503,
        'GEMINI_API_KEY is not configured on the server. Add GEMINI_API_KEY to server environment variables to enable AI Question Generation. / सर्वर पर GEMINI_API_KEY सेट नहीं है।'
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_QUESTION_MODEL,
        contents: buildQuestionPrompt(input),
        config: {
          abortSignal: AbortSignal.timeout(45000),
          systemInstruction:
            'You are an authoritative Indian competitive exam question setter. Return strict JSON matching the requested schema with factually verified 4-option MCQs only.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    statement: { type: Type.STRING },
                    statementHindi: { type: Type.STRING },
                    options: {
                      type: Type.OBJECT,
                      properties: {
                        A: { type: Type.STRING },
                        B: { type: Type.STRING },
                        C: { type: Type.STRING },
                        D: { type: Type.STRING }
                      },
                      required: ['A', 'B', 'C', 'D']
                    },
                    correctAnswer: {
                      type: Type.STRING,
                      enum: ['A', 'B', 'C', 'D']
                    },
                    explanation: { type: Type.STRING },
                    subject: { type: Type.STRING },
                    topic: { type: Type.STRING },
                    difficulty: {
                      type: Type.STRING,
                      enum: ['Easy', 'Medium', 'Hard']
                    }
                  },
                  required: ['statement', 'options', 'correctAnswer', 'explanation', 'subject', 'topic', 'difficulty']
                }
              }
            },
            required: ['questions']
          }
        }
      });

      rawResponseText = response.text || '';
    } catch (err) {
      throw mapGeminiErrorToHttp(err);
    }
  }

  const questions = parseAndValidateGeminiQuestions(rawResponseText, input).slice(0, input.count);

  return {
    success: true,
    model: GEMINI_QUESTION_MODEL,
    requestedCount: input.count,
    generatedCount: questions.length,
    questions
  };
}
