import { Container, Flex } from '@chakra-ui/react';

export const Page = ({ children }) => (
  <Flex width="100%" height="100%">
    <Container maxW="container.xxl" height="100%">
      {children}
    </Container>
  </Flex>
);
