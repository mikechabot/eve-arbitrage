import React from 'react';
import { MdMenu } from 'react-icons/md';
import { Box, Stack, Heading, Flex, Button, useDisclosure, Icon } from '@chakra-ui/react';

import { usePostLogout } from 'services/hooks/useMutations';
import { useOauthVerifyQuery } from 'services/hooks/useQueries';
import { useAuthContext } from 'hooks/useAuthContext';

export const Header = () => {
  const { isVerified } = useAuthContext();
  const { refetch: verify } = useOauthVerifyQuery();
  const { mutateAsync: logout } = usePostLogout();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleToggle = () => (isOpen ? onClose() : onOpen());

  return (
    <Flex
      as="nav"
      align="center"
      position="fixed"
      width="100vw"
      justify="space-between"
      wrap="wrap"
      padding={4}
      bg="gray.400"
      color="gray.100"
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg">
          Eve Arbitrage
        </Heading>
      </Flex>

      {isVerified && (
        <>
          <Box display={{ base: 'block', md: 'none' }} onClick={handleToggle}>
            <Icon as={MdMenu} />
          </Box>

          <Stack
            direction={{ base: 'column', md: 'row' }}
            display={{ base: isOpen ? 'block' : 'none', md: 'flex' }}
            width={{ base: 'full', md: 'auto' }}
            alignItems="center"
            flexGrow={1}
            mt={{ base: 4, md: 0 }}
          >
            &nbsp;
          </Stack>

          <Box display={{ base: isOpen ? 'block' : 'none', md: 'block' }} mt={{ base: 4, md: 0 }}>
            <Button
              variant="outline"
              _hover={{ borderColor: 'red.100', color: 'red.100' }}
              onClick={async () => {
                await logout();
                await verify();
              }}
            >
              Logout
            </Button>
          </Box>
        </>
      )}
    </Flex>
  );
};
