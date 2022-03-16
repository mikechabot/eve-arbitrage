import { Box } from '@chakra-ui/react';

import { EveCorporationApiV5 } from 'services/types/corporation-api';
import { EveCharacterDetailsApiV5, EveCharacterWalletApiV1 } from 'services/types/character-api';

interface CharacterDetailsProps {
  character: {
    details: EveCharacterDetailsApiV5;
    wallet: EveCharacterWalletApiV1;
  };
  corporation: EveCorporationApiV5;
}

export const CharacterDetails: React.FC<CharacterDetailsProps> = ({ character, corporation }) => (
  <Box textAlign="right">
    <Box fontWeight="semibold">{character.details.name}</Box>
    <Box>{corporation.name}</Box>
    <Box fontWeight="semibold" color="secondary">
      ${Number(character.wallet).toLocaleString()} ISK
    </Box>
  </Box>
);
