import { STORAGE_KEYS, getBoolean, setBoolean } from './storage';

export const AUTH_NOTICE = 'This gateway controls app entry on this device only. It is not secure account-based authentication.';

export const isAuthenticated = (): boolean => getBoolean(STORAGE_KEYS.authenticated, false);

export const setAuthenticated = (value: boolean): void => {
    setBoolean(STORAGE_KEYS.authenticated, value);
};

export const getGatewayPassword = (): string => import.meta.env.VITE_GATEWAY_PASSWORD || '0228';
