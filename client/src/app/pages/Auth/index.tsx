import { useEffect, useState } from 'react';
import { Redirect } from 'react-router';

import { AppRoutes } from 'app/pages/appRoutes';

import { useQuery } from 'app/hooks/useQuery';
import { useAuthContext } from 'hooks/useAuthContext';

const EveCodeQueryParam = 'code';

export const Auth = () => {
  const query = useQuery();
  const { setCode } = useAuthContext();
  const [doRedirect, setDoRedirect] = useState(false);

  useEffect(() => {
    const code = query.get(EveCodeQueryParam);
    if (code) {
      setCode(code);
    } else {
      setDoRedirect(true);
    }
  }, [query, setCode, setDoRedirect]);

  if (doRedirect) {
    return <Redirect to={AppRoutes.Home} />;
  }

  return <Redirect to={AppRoutes.Assets} />;
};
