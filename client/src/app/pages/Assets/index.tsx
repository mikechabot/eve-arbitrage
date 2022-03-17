import { useEffect } from 'react';
import { Redirect } from 'react-router';

import { AppRoutes } from 'app/pages/appRoutes';

import { useAuthContext } from 'hooks/useAuthContext';
import { useAssetsPage } from 'app/pages/Assets/hooks/useAssetsPage';

import { Fullscreen } from 'app/layout/Fullscreen';
import { Spinner } from 'app/components/Spinner';
import { ErrorMessage } from 'app/components/ErrorMessage';

import { AssetsTable } from 'app/pages/Assets/components/AssetsTable';

export const Assets = () => {
  const { isVerified } = useAuthContext();
  const { data, isFetching, isError, refetch } = useAssetsPage();

  useEffect(() => {
    if (isVerified) {
      refetch();
    }
  }, [isVerified, refetch]);

  if (!isVerified) {
    return <Redirect to={AppRoutes.Home} />;
  }

  if (isError) {
    return (
      <Fullscreen>
        <ErrorMessage message="Error fetching assets" />
      </Fullscreen>
    );
  }

  if (!data || isFetching) {
    return (
      <Fullscreen>
        <Spinner label="Loading Assets..." />
      </Fullscreen>
    );
  }

  return <AssetsTable assets={data.assets} />;
};
