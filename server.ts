import path from 'node:path';
import express, { type Request, type Response, type NextFunction } from 'express';
import {
  createRoleStoreForCaller,
  isAdminSdkConfigured,
  verifyCallerFirebaseIdToken
} from './server/firebaseAdmin.ts';
import {
  RoleServiceHttpError,
  executeChangeRole,
  executeChangeStatus,
  executeDeleteUserAccount,
  executeGetAuthMetadata,
  executeReviewTeacherRequest
} from './server/roleService.ts';
import { executeGenerateQuestions } from './server/geminiQuestionService.ts';
import { executeParseQuestionFile } from './server/documentImportService.ts';

const PORT = Number(process.env.PORT) || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  return token || null;
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'Server Gateway';
}

async function authenticateRequest(req: Request) {
  const token = extractBearerToken(req);
  if (!token) {
    throw new RoleServiceHttpError(401, 'Unauthorized: Missing Bearer Firebase ID token.');
  }
  try {
    const callerToken = await verifyCallerFirebaseIdToken(token);
    const store = createRoleStoreForCaller(token);
    return { callerToken, store };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Invalid or expired Firebase ID token.';
    throw new RoleServiceHttpError(401, `Unauthorized: ${msg}`);
  }
}

async function startServer() {
  const app = express();
  // Higher limit specifically for in-memory base64 file parsing route (<= 8 MB binary)
  app.use('/api/questions/parse-file', express.json({ limit: '12mb' }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      ok: true,
      service: 'Sanskar-X-NarutoQuiz Auth & Role API',
      adminSdkConfigured: isAdminSdkConfigured()
    });
  });

  app.post('/api/ai/generate-questions', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { callerToken, store } = await authenticateRequest(req);
      const result = await executeGenerateQuestions({
        callerToken,
        store,
        body: req.body || {}
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/questions/parse-file', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { callerToken, store } = await authenticateRequest(req);
      const result = await executeParseQuestionFile({
        callerToken,
        store,
        body: req.body || {}
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get('/api/admin/users/auth-metadata', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { callerToken, store } = await authenticateRequest(req);
      const result = await executeGetAuthMetadata({ callerToken, store });
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/admin/users/change-role', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { callerToken, store } = await authenticateRequest(req);
      const result = await executeChangeRole({
        callerToken,
        store,
        body: req.body || {},
        ipAddress: getClientIp(req)
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/admin/users/change-status', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { callerToken, store } = await authenticateRequest(req);
      const result = await executeChangeStatus({
        callerToken,
        store,
        body: req.body || {},
        ipAddress: getClientIp(req)
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.post(
    '/api/admin/users/review-teacher-request',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { callerToken, store } = await authenticateRequest(req);
        const result = await executeReviewTeacherRequest({
          callerToken,
          store,
          body: req.body || {},
          ipAddress: getClientIp(req)
        });
        res.json(result);
      } catch (err) {
        next(err);
      }
    }
  );

  app.post('/api/admin/users/delete-account', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { callerToken, store } = await authenticateRequest(req);
      const result = await executeDeleteUserAccount({
        callerToken,
        store,
        body: req.body || {},
        ipAddress: getClientIp(req)
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith('/api/')) {
      next(err);
      return;
    }
    if (err instanceof RoleServiceHttpError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error('Role management API error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ error: message });
  });

  if (!IS_PRODUCTION) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get(/^(?!\/api(?:\/|$)).*/, (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `Sanskar-X-NarutoQuiz server listening on http://0.0.0.0:${PORT} (AdminSDK: ${
        isAdminSdkConfigured() ? 'Configured' : 'Verified-Token REST mode'
      })`
    );
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
