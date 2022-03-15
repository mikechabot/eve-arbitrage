import React from 'react';
import { Heading, Flex } from '@chakra-ui/react';

import { useAuthContext } from 'hooks/useAuthContext';

import { Divider } from 'app/components/Divider';

import { LogoutButton } from './LogoutButton';
import { CharacterAvatar } from './CharacterAvatar';
import { CharacterDetails } from './CharacterDetails';

export const AppHeader = () => {
  const { isVerified } = useAuthContext();

  return (
    <Flex
      as="nav"
      align="center"
      width="100%"
      justify="space-between"
      backgroundColor="primary"
      alignContent="center"
      color="base"
      height="98px"
      paddingY={2}
      paddingX={4}
      borderBottom="1px solid"
      borderColor="secondary"
    >
      <Heading as="h2" size="xl" color="secondary">
        [EveX]
      </Heading>

      {isVerified && (
        <Flex alignItems="center">
          <CharacterDetails />
          <Divider />
          <CharacterAvatar />
          <Divider />
          <LogoutButton />
        </Flex>
      )}
    </Flex>
  );
};
