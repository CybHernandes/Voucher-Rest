const isNode = typeof window === 'undefined';

const STORAGE_KEY = 'voucher_rest_token';

const getStoredToken = () => {
  if (isNode) return null;
  return window.sessionStorage.getItem(STORAGE_KEY) || null;
};

const isClearAccessTokenRequested = () =>
  !isNode && new URLSearchParams(window.location.search).get('clear_access_token') === 'true';

const clearStoredAccessToken = () => {
  if (isNode) return;
  window.sessionStorage.removeItem(STORAGE_KEY);
};

const clearSensitiveParamsFromUrl = () => {
  if (isNode || !window.location?.search) return;

  const params = new URLSearchParams(window.location.search);
  const sensitiveKeys = [
    'access_token',
    'clear_access_token',
    'app_id',
    'app_base_url',
    'functions_version',
    'from_url',
    'returnTo',
  ];

  let changed = false;
  for (const key of sensitiveKeys) {
    if (params.has(key)) {
      params.delete(key);
      changed = true;
    }
  }

  if (!changed) return;

  const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}${window.location.hash || ''}`;
  window.history.replaceState({}, '', nextUrl);
};

const getAppParams = () => {
  if (isClearAccessTokenRequested()) {
    clearStoredAccessToken();
  }

  const token = getStoredToken();
  clearSensitiveParamsFromUrl();

  return {
    appId: 'local-dev',
    token,
    functionsVersion: 'local',
    appBaseUrl: window.location.origin,
  };
};

export const appParams = {
  ...getAppParams(),
};
