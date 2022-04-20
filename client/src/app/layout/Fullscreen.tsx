import { Flex } from '@chakra-ui/react';

export const Fullscreen = ({ children }) => (
  <Flex
    flexDirection="column"
    width="100%"
    height="100%"
    backgroundColor="base"
    justifyContent={['flex-start', 'center']}
    alignItems="center"
    mt={[8, 0]}
  >
    {children}
  </Flex>
);
