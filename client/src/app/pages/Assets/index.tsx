import { Redirect } from 'react-router';

import { AppRoutes } from 'app/pages/appRoutes';

import { useAuthContext } from 'hooks/useAuthContext';
import { useAssetsPage } from 'app/pages/Assets/hooks/useAssetsPage';

export const Assets = () => {
  const { code } = useAuthContext();
  const { data, isFetching, isError, error, fetchUserAssets } = useAssetsPage();

  if (!code) {
    return <Redirect to={AppRoutes.Home} />;
  }

  console.log(error);

  if (isError) {
    return <span>Error!</span>;
  }

  return (
    <div>
      <button type="button" onClick={() => fetchUserAssets()}>
        Fetch User assets
      </button>
      <button type="button" onClick={() => ({})}>
        Fetch Corporation assets
      </button>
    </div>
  );
};
