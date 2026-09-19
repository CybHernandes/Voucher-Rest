const STORAGE_KEYS = {
  token: 'voucher_rest_token',
  user: 'voucher_rest_user',
};

const API_BASE = '/api';

const getSessionStorage = () => {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
};

const getStoredToken = () => {
  const storage = getSessionStorage();
  if (!storage) return null;
  return storage.getItem(STORAGE_KEYS.token) || null;
};

const persistSession = (user, token) => {
  const storage = getSessionStorage();
  if (!storage) return;

  storage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  storage.setItem(STORAGE_KEYS.token, token);
};

const clearSession = () => {
  const storage = getSessionStorage();
  if (!storage) return;

  storage.removeItem(STORAGE_KEYS.user);
  storage.removeItem(STORAGE_KEYS.token);
};

const request = async (path, options = {}) => {
  const token = getStoredToken();
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(payload?.message || 'Request failed');
    error.status = response.status;
    error.data = payload;
    throw error;
  }

  return payload;
};

const localAuth = {
  hasToken() {
    return Boolean(getStoredToken());
  },

  async me() {
    const data = await request('/auth/me');
    return data.user;
  },

  async updateMe(data) {
    const currentUser = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.user) || 'null') || { id: 'local-user', email: '', name: 'Local User' };
    const nextUser = { ...currentUser, ...data };
    persistSession(nextUser, getStoredToken());
    return nextUser;
  },

  redirectToLogin(nextUrl = window.location.href) {
    if (typeof window === 'undefined') return;
    const target = new URL(nextUrl, window.location.origin).toString();
    const finalTarget = `${window.location.origin}/login?returnTo=${encodeURIComponent(target)}`;
    window.location.href = finalTarget;
  },

  loginWithProvider(provider, fromUrl = '/') {
    if (typeof window === 'undefined') return;
    const target = new URL(fromUrl, window.location.origin).toString();
    window.location.href = `${window.location.origin}/login?provider=${encodeURIComponent(provider)}&returnTo=${encodeURIComponent(target)}`;
  },

  async logout(redirectUrl) {
    clearSession();
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {
      // ignore session cleanup failures
    }

    if (typeof window === 'undefined') return;
    const next = redirectUrl || `${window.location.origin}/login`;
    window.location.href = next;
  },

  setToken(token, saveToStorage = true) {
    if (!token) return;
    const storage = getSessionStorage();
    if (saveToStorage && storage) {
      storage.setItem(STORAGE_KEYS.token, token);
    }
  },

  async register(name, email, password) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const response = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email: normalizedEmail, password }),
    });

    persistSession(response.user, response.token);
    return { access_token: response.token, user: response.user };
  },

  async loginViaEmailPassword(email, password) {
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.status = 400;
      throw error;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: normalizedEmail, password }),
    });

    persistSession(response.user, response.token);
    return { access_token: response.token, user: response.user };
  },
};

export const base44 = {
  auth: localAuth,
  app: {
    async getPublicSettings() {
      return {
        id: 'local-dev',
        public_settings: {},
      };
    },
  },
};
