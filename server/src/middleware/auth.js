// AI assistance: Google Gemini (Antigravity) helped draft this middleware file.

import { error } from '../utils/response.js';

/**
 * requireAuth — rejects unauthenticated requests.
 * Used on all protected routes.
 */
export function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return error(res, 'Authentication required', 401);
  }
  next();
}

/**
 * requireAdmin — rejects non-admin requests.
 * The role is stored server-side in the session; it is never trusted from the client.
 */
export function requireAdmin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return error(res, 'Authentication required', 401);
  }
  if (req.session.role !== 'admin') {
    return error(res, 'Forbidden: administrator access required', 403);
  }
  next();
}

