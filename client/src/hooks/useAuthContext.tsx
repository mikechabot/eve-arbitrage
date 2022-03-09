import { v4 as guid } from 'uuid';
import { createContext, useContext, useEffect, useState } from 'react';

import { usePostCodeForOauthToken } from 'services/hooks/useMutations';

interface AuthContextValue {
  stateKey: string;
  code: string | undefined;
  setCode: (code: string) => void;
}

const AuthContext = createContext<AuthContextValue>({
  stateKey: '',
  code: undefined,
  setCode: () => ({}),
});

export const AuthContextProvider = ({ children }) => {
  const [stateKey] = useState<string>(encodeURIComponent(guid()));
  const [code, setCode] = useState<string | undefined>(undefined);

  const {
    data: oauthTokenData,
    isError: isOauthTokenError,
    mutateAsync: mutateOauthToken,
  } = usePostCodeForOauthToken();

  useEffect(() => {
    const postCodeForToken = async () => {
      if (code) {
        await mutateOauthToken(code);
      }
    };
    postCodeForToken();
  }, [code, mutateOauthToken]);

  console.log('oauthTokenData', oauthTokenData);

  return (
    <AuthContext.Provider
      value={{
        code,
        stateKey,
        setCode: (authCode) => setCode(authCode),
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
