import { Box, VStack, useMediaQuery, Divider, Flex, Heading } from '@chakra-ui/react';
import { Redirect, useHistory } from 'react-router';

import { useAssetsPage } from 'app/pages/Assets/hooks/useAssetsPage';
import { useAuthContext } from 'hooks/useAuthContext';
import { useSelectedAssets } from 'hooks/useSelectedAssetsContext';

import { AppRoutes } from 'app/pages/appRoutes';

import { Fullscreen } from 'app/layout/Fullscreen';
import { Message } from 'app/components/Message';
import { Spinner } from 'app/components/Spinner';
import { Stepper } from 'app/components/Steppers/Assets';

import { OrderManagement } from 'app/pages/Orders/OrderManagement';

export const Orders = () => {
  const history = useHistory();
  const { isVerified } = useAuthContext();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const { selectedItemIds } = useSelectedAssets();

  const {
    data: dataAssets,
    isFetching: isFetchingAssets,
    isError: isErrorAssets,
  } = useAssetsPage();

  if (!isVerified) {
    return <Redirect to={AppRoutes.Home} />;
  }

  if (isErrorAssets) {
    return (
      <Fullscreen>
        <Message message="Error fetching assets" />
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

  if (selectedItemIds.size === 0) {
    return <Redirect to={AppRoutes.Assets} />;
  }

  return (
    <VStack width="100%" spacing={0}>
      <Box py={2} px={4} width="100%">
        <Stepper
          activeStep={1}
          nextStep={() => ({})}
          prevStep={() => history.push(AppRoutes.Assets)}
          selectedAssetCount={selectedItemIds.size}
          isLargerThan768={isLargerThan768}
        />
      </Box>
      <Divider />
      <VStack spacing={2} py={2} px={4} width="100%" alignItems="flex-start">
        <Flex width="100%" justifyContent="center">
          <Heading as="h2" fontSize="xl">
            Appraisal @ Jita
          </Heading>
        </Flex>
        <Divider />
        <OrderManagement assets={dataAssets.assets} selectedItemIds={selectedItemIds} />
      </VStack>
    </VStack>
  );
};
