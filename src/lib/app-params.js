import { getAccessToken } from '@base44/sdk';

const isNode = typeof window === 'undefined';

const isClearAccessTokenRequested = () =>
	!isNode && new URLSearchParams(window.location.search).get("clear_access_token") === 'true';

const clearStoredAccessToken = () => {
	window.localStorage.removeItem('base44_access_token');
	window.localStorage.removeItem('token');
}

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
		'returnTo'
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

	const token = getAccessToken();
	clearSensitiveParamsFromUrl();

	return {
		appId: import.meta.env.VITE_BASE44_APP_ID,
		token,
		functionsVersion: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION,
		appBaseUrl: import.meta.env.VITE_BASE44_APP_BASE_URL,
	}
}


export const appParams = {
	...getAppParams()
}
