// AI assistance: Google Gemini (Antigravity) helped scaffold this API client.
// All API communication goes through the backend — never directly to PostgreSQL or the Banana API.

const BASE_URL = '/api';

async function request(method, path, body = null) {
  const options = {
    method,
    credentials: 'include', // send session cookie
    headers: {},
  };
  if (body !== null) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Server returned an unexpected response');
  }

  if (!response.ok) {
    const err = new Error(data?.error || `HTTP ${response.status}`);
    err.status = response.status;
    err.details = data?.details || null;
    throw err;
  }

  return data.data;
}

const get    = (path)        => request('GET',   path);
const post   = (path, body)  => request('POST',  path, body);
const patch  = (path, body)  => request('PATCH', path, body);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data)    => post('/auth/register', data),
  login:    (data)    => post('/auth/login',    data),
  logout:   ()        => post('/auth/logout'),
  me:       ()        => get('/auth/me'),
  changePassword: (d) => post('/auth/change-password', d),
};

// ── Profile ───────────────────────────────────────────────────────────────────
export const profileApi = {
  getMe:    ()     => get('/users/me'),
  updateMe: (data) => patch('/users/me', data),
};

// ── Game ──────────────────────────────────────────────────────────────────────
export const gameApi = {
  start:         (data)       => post('/games', data),
  getGame:       (id)         => get(`/games/${id}`),
  getCurrentQ:   (id)         => get(`/games/${id}/current-question`),
  nextQuestion:  (id)         => post(`/games/${id}/next`),
  submitAnswer:  (id, data)   => post(`/games/${id}/answers`, data),
  useHint:       (id)         => post(`/games/${id}/hints`),
  finishGame:    (id)         => post(`/games/${id}/finish`),
  getHistory:    (page, limit) => get(`/games/history?page=${page}&limit=${limit}`),
};

// ── Stats ─────────────────────────────────────────────────────────────────────
export const statsApi = {
  getMe: () => get('/stats/me'),
};

// ── Leaderboard ───────────────────────────────────────────────────────────────
export const leaderboardApi = {
  get: (page = 1, limit = 20) => get(`/leaderboard?page=${page}&limit=${limit}`),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard: ()           => get('/admin/dashboard'),
  getUsers:     (page, q)    => get(`/admin/users?page=${page}&search=${q || ''}`),
  updateStatus: (id, status) => patch(`/admin/users/${id}/status`, { status }),
  getGames:     (page)       => get(`/admin/games?page=${page}`),
  getAuditLogs: (page)       => get(`/admin/audit-logs?page=${page}`),
};

