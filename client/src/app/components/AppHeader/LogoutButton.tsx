import React from 'react';
import { Button, Icon } from '@chakra-ui/react';
import { MdLogout } from 'react-icons/md';

import { useOauthVerifyQuery } from 'services/hooks/useQueries';
import { usePostLogout } from 'services/hooks/useMutations';

export const LogoutButton = () => {
  const { refetch } = useOauthVerifyQuery();
  const { mutateAsync } = usePostLogout();

  return (
    <Button
      color="primary"
      backgroundColor="secondary"
      _hover={{ backgroundColor: 'primary', color: 'secondary' }}
      onClick={async () => {
        await mutateAsync();
        await refetch();
      }}
    >
      <Icon as={MdLogout} />
    </Button>
  );
};
