import { Flex } from '@chakra-ui/react';

export const Fullscreen = ({ children }) => (
  <Flex
    flexDirection="column"
    width="100%"
    height="100%"
    backgroundColor="base"
    justifyContent="center"
    alignItems="center"
  >
    {children}
  </Flex>
);
