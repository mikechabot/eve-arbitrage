import React from 'react';
import { Redirect } from 'react-router';
import { Box, VStack, Heading, Divider } from '@chakra-ui/react';

import { useAuthContext } from 'hooks/useAuthContext';
import { buildEveAuthBaseUrl } from 'app/utils/constants';

import { Spinner } from 'app/components/Spinner';
import { Fullscreen } from 'app/layout/Fullscreen';
import { Stepper } from 'app/components/Steppers/Home';
import { Banner } from 'app/components/Banner';

import { AppRoutes } from 'app/pages/appRoutes';

import buttonImage from 'app/assets/login-black.png';

export const Home = () => {
  const { localStateKey, isVerified, isErrorVerify, isLoadingVerify } = useAuthContext();

  /**
   * We should always have a "localStateKey", but check it as
   * a safety measure. If we don't have "verifyData" then
   * we're most likely about to fetch.
   */
  if (!localStateKey) {
    return (
      <Fullscreen>
        <Spinner label="Loading..." />
      </Fullscreen>
    );
  }

  if (isLoadingVerify) {
    return (
      <Fullscreen>
        <Spinner label="Authorizing..." />
      </Fullscreen>
    );
  }

  if (isVerified) {
    return <Redirect to={AppRoutes.Assets} />;
  }

  return (
    <>
      {isErrorVerify && <Banner type="info" message="Unable to authenticate against EVE Online" />}

      <VStack spacing={[6, 12]} mt={[6, 12]}>
        <Box>
          <Heading as="h1">Eve Exchange</Heading>
          <Heading as="h2" size="md" color="secondary">
            Sell your space junk!
          </Heading>
        </Box>
        <Divider />
        <Box width="50vw">
          <Stepper />
        </Box>
        <Divider />
        <a href={buildEveAuthBaseUrl(localStateKey)} rel="noopener noreferrer">
          <img src={buttonImage} className="App-logo" alt="logo" />
        </a>
      </VStack>
    </>
  );
};
