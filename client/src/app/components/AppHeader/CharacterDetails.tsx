import { Box, Flex } from '@chakra-ui/react';

import { useCharacterQuery } from 'services/hooks/useQueries';

export const CharacterDetails = () => {
  const { data } = useCharacterQuery();
  if (!data) {
    return null;
  }

  const { character, corporation } = data;

  return (
    <Box textAlign="right">
      <Box fontWeight="semibold">{character.details.name}</Box>
      <Box>{corporation.details.name}</Box>
      <Box fontWeight="semibold" color="secondary">
        ${Number(character.wallet).toLocaleString()} ISK
      </Box>
    </Box>
  );
};
