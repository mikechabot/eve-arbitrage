import { v4 as guid } from 'uuid';
import { useLocalStorage } from 'react-use';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { useOauthVerifyQuery } from 'services/hooks/useQueries';
import { usePostCodeForOauthToken } from 'services/hooks/useMutations';
import { AuthChallengeResponse, ChallengeType } from 'services/types/response-type-api';

const LocalStorageKey = 'stateKey';
const LocalStateKeyValue = encodeURIComponent(guid());

interface AuthContextValue {
  remoteCode: string | undefined;
  localStateKey: string | undefined;
  verifyData: AuthChallengeResponse | undefined;
  isVerified: boolean;
  isErrorVerify: boolean;
  isLoadingVerify: boolean;
  isErrorMutateOauthToken: boolean;
  isLoadingMutateOAuthToken: boolean;
  // isInvalidAuthResponse: boolean;
  // isErrorMutateOauthToken: boolean;

  setAuthResponse: (remoteCode: string, remoteStateKey: string) => void;
}

const AuthContext = createContext<AuthContextValue>({
  verifyData: undefined,
  remoteCode: undefined,
  localStateKey: undefined,
  isVerified: false,
  isErrorVerify: false,
  isErrorMutateOauthToken: false,
  isLoadingVerify: false,
  isLoadingMutateOAuthToken: false,
  // isInvalidAuthResponse: false,
  // isErrorMutateOauthToken: false,

  setAuthResponse: () => ({}),
});

const isVerified = (verifyData: AuthChallengeResponse | undefined): boolean => {
  if (!verifyData) {
    return false;
  }
  return verifyData.verified;
};

const requireSsoChallenge = (
  verifyData: AuthChallengeResponse | undefined,
  isFetchingVerify: boolean,
  isLoadingMutateAuthToken: boolean,
): boolean => {
  if (!verifyData || isLoadingMutateAuthToken || isFetchingVerify) {
    return false;
  }
  return verifyData.challenge === ChallengeType.SSO;
};

export const AuthContextProvider = ({ children }) => {
  /**
   * Obtain the JWT from the auth response
   */
  const {
    mutateAsync: mutateOauthToken,
    isLoading: isLoadingMutateOAuthToken,
    isError: isErrorMutateOauthToken,
  } = usePostCodeForOauthToken();

  const {
    data: verifyData,
    isLoading: isLoadingVerify,
    isError: isErrorVerify,
    refetch: refetchVerify,
  } = useOauthVerifyQuery();

  /**
   * This local state key is passed to the EVE's OAuth authorize URL,
   * and is compared to the AuthResponse, which sends back the state key.
   */
  const [localStorageStateKey, setLocalStorageStateKey] = useLocalStorage<string>(LocalStorageKey);

  /**
   * This tracks whether the EVE's OAuth authorize URL returned an empty
   * resposne, or whether the return state key does not match the "localStateKey"
   */
  // const [isInvalidAuthResponse, setIsInvalidAuthResponse] = useState(false);

  /**
   * Holds the auth response from EVE's OAuth authorize URL
   */
  const [authResponse, setAuthResponse] =
    useState<{ remoteCode: string; remoteStateKey: string }>();

  const hasValidAuthCodeResponse =
    authResponse?.remoteCode && authResponse.remoteStateKey === localStorageStateKey;

  const performChallenge =
    hasValidAuthCodeResponse &&
    requireSsoChallenge(verifyData, isLoadingMutateOAuthToken, isLoadingVerify);

  /**
   * Store the state key in LocalStorage if we haven't already
   */
  useEffect(() => {
    if (!localStorageStateKey) {
      setLocalStorageStateKey(LocalStateKeyValue);
    }
  });

  useEffect(() => {
    const postCodeForOauthToken = async () => {
      if (performChallenge) {
        setAuthResponse(undefined);
        await mutateOauthToken(authResponse.remoteCode);
        await refetchVerify();
      }
    };
    postCodeForOauthToken();
  }, [authResponse, mutateOauthToken, performChallenge, refetchVerify]);

  const onSetAuthResponse = useCallback(
    (remoteCode, remoteStateKey) => {
      setAuthResponse({ remoteCode, remoteStateKey });
    },
    [setAuthResponse],
  );

  return (
    <AuthContext.Provider
      value={{
        verifyData,
        isErrorVerify,
        isErrorMutateOauthToken,
        isLoadingVerify,
        isLoadingMutateOAuthToken,
        localStateKey: localStorageStateKey,
        isVerified: isVerified(verifyData),
        remoteCode: authResponse?.remoteCode,
        setAuthResponse: onSetAuthResponse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Use the pure context value
 */
export const useAuthContext = (): AuthContextValue => useContext(AuthContext);
