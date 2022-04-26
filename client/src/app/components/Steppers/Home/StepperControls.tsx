import { FC } from 'react';
import { Box, Button, Flex, Icon } from '@chakra-ui/react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

import { StepperContent } from './StepperContent';
import { steps } from './constants';

interface StepperControlsProps {
  activeStep: number;
  prevStep: () => void;
  nextStep: () => void;
  reset: () => void;
}

export const StepperControls: FC<StepperControlsProps> = ({
  activeStep,
  prevStep,
  nextStep,
  reset,
}) => {
  if (activeStep === steps.length) {
    return (
      <Flex width="100%" flexDirection="column" justify="center">
        <Box px={4} py={4} textAlign="left">
          <StepperContent index={-1} />
        </Box>
        <Flex width="100%" justify="center">
          <Button isDisabled={activeStep === 0} mr={4} onClick={prevStep} variant="ghost">
            <Icon as={MdNavigateBefore} w={10} h={10} />
          </Button>
          <Button onClick={reset} variant="ghost">
            <Icon as={MdNavigateNext} w={10} h={10} />
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex width="100%" justify="center">
      <Button isDisabled={activeStep === 0} mr={4} onClick={prevStep} variant="ghost">
        <Icon as={MdNavigateBefore} w={10} h={10} />
      </Button>
      <Button onClick={nextStep} variant="ghost">
        <Icon as={MdNavigateNext} w={10} h={10} />
      </Button>
    </Flex>
  );
};
