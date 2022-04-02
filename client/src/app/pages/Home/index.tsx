import React from 'react';
import { Redirect } from 'react-router';

import { Heading, Avatar, VStack } from '@chakra-ui/react';

import { useAuthContext } from 'hooks/useAuthContext';
import { buildEveAuthBaseUrl } from 'app/utils/constants';

import { Spinner } from 'app/components/Spinner';
import { ErrorMessage } from 'app/components/ErrorMessage';
import { Fullscreen } from 'app/layout/Fullscreen';

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

  if (isErrorVerify) {
    return (
      <Fullscreen>
        <ErrorMessage message="Error during verification" />
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
    <Fullscreen>
      <VStack justifyContent="center" alignItems="center" spacing={5}>
        <Avatar bg="secondary" showBorder border="red" />
        <Heading as="h3" size="lg">
          Welcome to EveX
        </Heading>
        <a className="App-link" href={buildEveAuthBaseUrl(localStateKey)} rel="noopener noreferrer">
          <img src={buttonImage} className="App-logo" alt="logo" />
        </a>
      </VStack>
    </Fullscreen>
  );
};
