export const CONFIGS = {
  env: import.meta.env.VITE_APP_STAGE || "development",
  baseUrl: import.meta.env.VITE_BASE_API_URL,
  localStorageKey: import.meta.env.VITE_LOCAL_STORAGE_KEY,
};
