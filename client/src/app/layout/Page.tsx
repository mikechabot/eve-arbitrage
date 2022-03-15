import { Container, Flex } from '@chakra-ui/react';

export const Page = ({ children }) => (
  <Flex flexDirection="column" width="100%" height="100%">
    <Container maxW="container.xl" height="100%">
      {children}
    </Container>
  </Flex>
);
