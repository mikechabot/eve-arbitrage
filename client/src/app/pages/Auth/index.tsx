import { useEffect, useState } from 'react';
import { Redirect } from 'react-router';

import { AppRoutes } from 'app/pages/appRoutes';

import { useQuery } from 'app/hooks/useQuery';
import { useAuthContext } from 'hooks/useAuthContext';

const EveCodeQueryParam = 'code';

export const Auth = () => {
  const query = useQuery();
  const { code, setCode } = useAuthContext();
  const [doRedirect, setDoRedirect] = useState(false);

  useEffect(() => {
    const queryCode = query.get(EveCodeQueryParam);
    if (queryCode) {
      setCode(queryCode);
    } else {
      setDoRedirect(true);
    }
  }, [query, setCode, setDoRedirect]);

  if (doRedirect) {
    return <Redirect to={AppRoutes.Home} />;
  }

  return <div>Code: {code}</div>;
};
