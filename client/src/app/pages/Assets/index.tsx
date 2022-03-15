import { useEffect } from 'react';
import { Redirect } from 'react-router';

import { AppRoutes } from 'app/pages/appRoutes';

import { useAuthContext } from 'hooks/useAuthContext';
import { useAssetsPage } from 'app/pages/Assets/hooks/useAssetsPage';

import { Fullscreen } from 'app/layout/Fullscreen';
import { Spinner } from 'app/components/Spinner';

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

  if (!data || isFetching) {
    return (
      <Fullscreen>
        <Spinner label="Loading Assets..." />
      </Fullscreen>
    );
  }

  const { character, corporation } = data;

  return <CharacterAssets assets={character!.assets} />;
};
