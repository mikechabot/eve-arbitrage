import { Text } from '@chakra-ui/react';

export const StepperContent = ({ index }) => {
  switch (index) {
    case 0: {
      return <Text fontSize="lg">Review your assets to find arbitrage opportunities.</Text>;
    }
    case 1: {
      return <Text fontSize="lg">Create a sell order that maximizes profit.</Text>;
    }
    case 2: {
      return <Text fontSize="lg">Share the order on Discord or pass around a link.</Text>;
    }
    case 3: {
      return <Text fontSize="lg">Coordinate with the buyer to sell your assets.</Text>;
    }
    default: {
      return <Text fontSize="lg">Space junk sold for profit!</Text>;
    }
  }
};
