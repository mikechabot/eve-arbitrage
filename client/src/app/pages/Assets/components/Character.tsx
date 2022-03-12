import { Box, Flex, Icon, Image } from '@chakra-ui/react';
import format from 'date-fns/format';

import { MdCake } from 'react-icons/md';
import { FaBuilding, FaDollarSign } from 'react-icons/fa';

import {
  EveCharacterDetailsApiV5,
  EveCharacterPortraitApiV3,
  EveCharacterWalletApiV1,
} from 'services/types/character-api';

import { EveCorporationApiV5 } from 'services/types/corporation-api';

interface CharacterProps {
  character: {
    details: EveCharacterDetailsApiV5;
    portrait: EveCharacterPortraitApiV3;
    wallet: EveCharacterWalletApiV1;
  };
  corporation: {
    details: EveCorporationApiV5;
  };
}

export const Character: React.FC<CharacterProps> = ({ character, corporation }) => (
  <Box maxW="256px" pt={3}>
    <Box borderWidth="1px" borderRadius="10px" borderColor="gray.400">
      <Image src={character.portrait.px256x256} alt="character portrait" borderRadius="10px" />
    </Box>

    <Box color="gray.200" pt={3}>
      <Box as="h4" fontWeight="semibold">
        {character.details.name}
      </Box>
      <Flex fontWeight="bold" alignItems="center" fontSize="xs" color="green.100">
        <Icon as={FaDollarSign} />
        <Box as="div" pl={1} fontFamily="monospace">
          {Number(character.wallet).toLocaleString()} ISK
        </Box>
      </Flex>
      {character.details.description && (
        <Box as="h4" fontSize="xs" fontStyle="italic" color="gray.250">
          {character.details.description}
        </Box>
      )}
      <Flex mt={1} fontWeight="bold" alignItems="center">
        <Icon as={MdCake} />
        <Box pl={1} fontSize="sm">
          {format(new Date(character.details.birthday), 'MMMM d yyyy h:mm a')}
        </Box>
      </Flex>
      <Flex mt={1} fontWeight="bold" alignItems="center">
        <Icon as={FaBuilding} />
        <Box pl={1} fontSize="sm">
          {corporation.details.name}
        </Box>
      </Flex>
    </Box>
  </Box>
);
