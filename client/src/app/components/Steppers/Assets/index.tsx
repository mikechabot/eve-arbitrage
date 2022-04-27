import { FC } from 'react';
import { Button, Icon, Heading, Text, Flex, VStack, HStack, Divider } from '@chakra-ui/react';
import { Step, Steps } from 'chakra-ui-steps';
import { MdNavigateNext } from 'react-icons/md';

import { StepperControls } from './StepperControls';

import { steps } from './constants';

interface StepperProps {
  activeStep: number;
  isLargerThan768: boolean;
  selectedAssetCount: number;
  prevStep: () => void;
  nextStep: () => void;
}

export const Stepper: FC<StepperProps> = ({
  activeStep,
  isLargerThan768,
  prevStep,
  nextStep,
  selectedAssetCount = 0,
}) => {
  if (!isLargerThan768) {
    const { label, rawIcon } = steps[activeStep];

    return (
      <VStack spacing={1} justifyContent="center" width="100%">
        <HStack alignItems="center">
          <Flex
            borderRadius="50%"
            h="32px"
            w="32px"
            justifyContent="center"
            alignItems="center"
            backgroundColor="gray.200"
            borderColor="twitter.500"
            borderStyle="solid"
            borderWidth="2px"
          >
            <Icon as={rawIcon} w="1.5rem" h="1.5rem" />
          </Flex>
          <Text fontSize="lg" fontWeight="bold">
            {label}
          </Text>
        </HStack>
        <StepperControls
          activeStep={activeStep}
          prevStep={prevStep}
          nextStep={nextStep}
          selectedAssetCount={selectedAssetCount}
        />
      </VStack>
    );
  }

  return (
    <VStack spacing={2} width="100%">
      <Steps activeStep={activeStep} size="sm" colorScheme="twitter">
        {steps.map(({ label, icon }) => (
          <Step label={label} key={label} icon={icon} />
        ))}
      </Steps>
      <StepperControls
        activeStep={activeStep}
        prevStep={prevStep}
        nextStep={nextStep}
        selectedAssetCount={selectedAssetCount}
      />
    </VStack>
  );
};
