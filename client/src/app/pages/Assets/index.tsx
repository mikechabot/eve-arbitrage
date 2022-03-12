import { useEffect } from 'react';
import { Redirect } from 'react-router';
import { Container, Flex } from '@chakra-ui/react';

import { AppRoutes } from 'app/pages/appRoutes';

import { useAuthContext } from 'hooks/useAuthContext';
import { useAssetsPage } from 'app/pages/Assets/hooks/useAssetsPage';

import { Fullscreen } from 'app/layout/Fullscreen';
import { Page } from 'app/layout/Page';

import { Spinner } from 'app/components/Spinner';

import { Character } from './components/Character';
import { CharacterAssets } from './components/CharacterAssets';

export const Assets = () => {
  const { isVerified } = useAuthContext();
  const { data, isFetching, isError, fetchCharacter } = useAssetsPage();

  useEffect(() => {
    if (isVerified) {
      fetchCharacter();
    }
  }, [isVerified, fetchCharacter]);

  if (!isVerified) {
    return <Redirect to={AppRoutes.Home} />;
  }

  if (isError) {
    return (
      <Fullscreen>
        <span>Error!</span>
      </Fullscreen>
    );
  }

  if (isFetching) {
    return (
      <Fullscreen>
        <Spinner label="Loading Assets..." />
      </Fullscreen>
    );
  }

  if (!data) {
    return null;
  }

  const { character, corporation } = data;

  return (
    <Page>
      <Container maxW="container.lg">
        <Flex>
          <Character character={character!} corporation={corporation!} />
          <CharacterAssets assets={character!.assets} />
        </Flex>
      </Container>
    </Page>
  );
};
