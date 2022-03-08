import { generatePath as internalGeneratePath, ExtractRouteParams } from 'react-router';

export const AppRoutes = {
  Home: '/',
  AuthSso: '/auth/sso/',
} as const;

export type AppRoute = typeof AppRoutes[keyof typeof AppRoutes];

export const buildRoute = <T extends string = AppRoute>(
  path: T,
  params?: ExtractRouteParams<T>,
) => {
  return internalGeneratePath<T>(path, params);
};
