import { useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { Redirect } from 'react-router';

import { AppRoutes } from 'app/pages/appRoutes';

import { useAuthContext } from 'hooks/useAuthContext';
import { usePostOrder } from 'services/hooks/useMutations';
import { useAssetsPage } from 'app/pages/Assets/hooks/useAssetsPage';

import { Fullscreen } from 'app/layout/Fullscreen';
import { Spinner } from 'app/components/Spinner';
import { ErrorMessage } from 'app/components/ErrorMessage';

import { AssetsTable } from 'app/pages/Assets/components/AssetsTable';

export const Assets = () => {
  const { isVerified } = useAuthContext();

  const {
    data: dataAssets,
    isFetching: isFetchingAssets,
    isError: isErrorAssets,
    refetch: fetchAssets,
  } = useAssetsPage();

  const { data: dataOrders, isLoading: isFetchingOrders, isError: isErrorOrders } = usePostOrder();

  useEffect(() => {
    if (isVerified) {
      fetchAssets();
    }
  }, [isVerified, fetchAssets]);

  if (!isVerified) {
    return <Redirect to={AppRoutes.Home} />;
  }

  if (isErrorAssets) {
    return (
      <Fullscreen>
        <ErrorMessage message="Error fetching assets" />
      </Fullscreen>
    );
  }

  if (!dataAssets || isFetchingAssets) {
    return (
      <Fullscreen>
        <Spinner label="Loading Assets..." />
      </Fullscreen>
    );
  }

  return (
    <Flex flexDirection="column">
      <Box mt={2}>{isFetchingOrders ? <Spinner label="Fetching Orders..." /> : null}</Box>
      <AssetsTable assets={dataAssets.assets} />
    </Flex>
  );
};
