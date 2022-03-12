import { Flex } from '@chakra-ui/react';

export const Fullscreen = ({ children }) => (
  <Flex
    flexDirection="column"
    width="100wh"
    height="100vh"
    backgroundColor="black"
    justifyContent="center"
    alignItems="center"
  >
    {children}
  </Flex>
);
