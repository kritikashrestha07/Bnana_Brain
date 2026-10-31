// AI assistance: Google Gemini (Antigravity) helped scaffold this utility module.

/**
 * Standard JSON success response.
 */
export function success(res, data, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

/**
 * Standard JSON error response. Does NOT expose stack traces.
 */
export function error(res, message, statusCode = 400, details = null) {
  const body = { success: false, error: message };
  if (details) body.details = details;
  return res.status(statusCode).json(body);
}

