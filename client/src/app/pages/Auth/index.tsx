import { useEffect } from 'react';
import { Redirect } from 'react-router';

import { AppRoutes } from 'app/pages/appRoutes';

import { useQuery } from 'app/hooks/useQuery';
import { useAuthContext } from 'hooks/useAuthContext';

const EveCodeQueryParam = 'code';
const EveStateQueryParam = 'state';

export const Auth = () => {
  const query = useQuery();
  const {
    isVerified,
    isErrorVerify,
    isLoadingVerify,
    isErrorMutateOauthToken,
    isLoadingMutateOAuthToken,
    setAuthResponse,
  } = useAuthContext();

  const code = query.get(EveCodeQueryParam);
  const state = query.get(EveStateQueryParam);

  useEffect(() => {
    if (code && state) {
      setAuthResponse(code, state);
    }
  }, [code, state, setAuthResponse]);

  /**
   * If we're verified, then head to the Assets route
   */
  if (isVerified) {
    return <Redirect to={AppRoutes.Assets} />;
  }

  /**
   * Redirect if someone accesses this route directly, or if
   * we weren't given the correct parameters during EVE redirect
   */
  if (!code || !state) {
    return <Redirect to={AppRoutes.Home} />;
  }

  /**
   * If either the OAuth mutation or verification fails,
   * display an error.
   */
  if (isErrorMutateOauthToken || isErrorVerify) {
    return <span>Error</span>;
  }

  /**
   * If we're mutating the OAuth obtainOauthToken, or verifying,
   * show a loading indicator.
   */
  if (isLoadingMutateOAuthToken || isLoadingVerify) {
    return <span>Loading OAuth token...</span>;
  }

  return null;
};
