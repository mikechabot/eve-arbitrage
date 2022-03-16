import React, { ReactNode } from 'react';
import { Heading, Flex } from '@chakra-ui/react';

import { useAuthContext } from 'hooks/useAuthContext';
import { useCharacterQuery } from 'services/hooks/useQueries';

import { Divider } from 'app/components/Divider';
import { Spinner } from 'app/components/Spinner';

import { LogoutButton } from 'app/components/AppHeader/LogoutButton';
import { CharacterAvatar } from 'app/components/AppHeader/CharacterAvatar';
import { CharacterDetails } from 'app/components/AppHeader/CharacterDetails';

export const AppHeader = () => {
  const { isVerified } = useAuthContext();
  const { data, isFetching, isError } = useCharacterQuery();

  const content: ReactNode[] = [
    <Heading key="heading" as="h2" size="xl" color="secondary">
      EveX
    </Heading>,
  ];

  if (isFetching) {
    content.push(<Spinner key="loading" />);
  } else if (isError) {
    content.push(null);
  } else if (data && isVerified) {
    content.push(
      <Flex key="character-details" alignItems="center">
        <CharacterDetails character={data.character} corporation={data.corporation} />
        <Divider />
        <CharacterAvatar portrait={data.character.portrait} />
        <Divider />
        <LogoutButton />
      </Flex>,
    );
  }

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
      {content}
    </Flex>
  );
};
