import { Box, Spinner as UiSpinner, Flex, Stack } from '@chakra-ui/react';

interface SpinnerProps {
  label?: string | React.ReactNode;
}

export const Spinner: React.FC<SpinnerProps> = ({ label }) => (
  <Flex flexDirection="column" justifyContent="center">
    <Stack spacing={2}>
      <Flex justifyContent="center">
        <UiSpinner color="gray.200" size="lg" />
      </Flex>
      {label && <Box>{label}</Box>}
    </Stack>
  </Flex>
);
