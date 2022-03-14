import { Container, Flex } from '@chakra-ui/react';

export const Page = ({ children }) => (
  <Flex flexDirection="column" width="100wh" height="100vh" backgroundColor="black">
    <Container maxW="container.xl" mt={24}>
      {children}
    </Container>
  </Flex>
);
