import { Avatar } from '@chakra-ui/react';

import { useCharacterQuery } from 'services/hooks/useQueries';

export const CharacterAvatar = () => {
  const { data } = useCharacterQuery();
  if (!data) {
    return null;
  }

  const { character } = data;

  return <Avatar src={character.portrait.px64x64} />;
};
