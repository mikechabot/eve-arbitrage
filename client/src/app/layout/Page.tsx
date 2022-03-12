import { Flex } from '@chakra-ui/react';

export const Page = ({ children }) => (
  <Flex flexDirection="column" width="100wh" height="100vh" backgroundColor="black">
    {children}
  </Flex>
);
