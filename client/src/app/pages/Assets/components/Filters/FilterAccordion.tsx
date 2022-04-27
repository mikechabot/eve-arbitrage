import { FC } from 'react';
import {
  Box,
  Text,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  AccordionItem as ChakraAccordionItem,
} from '@chakra-ui/react';

import { CheckboxGroup } from 'app/components/CheckboxGroup';

interface FilterAccordionProps {
  label: string;
  options: Set<string>;
  selectedOptions: Set<string>;
  onChange: (val: string) => void;
}

export const FilterAccordion: FC<FilterAccordionProps> = ({
  label,
  options,
  selectedOptions,
  onChange,
}) => (
  <ChakraAccordionItem>
    <AccordionButton>
      <Box flex="1" textAlign="left" as="h1">
        <Text fontSize="lg" fontWeight={600}>
          {label}
        </Text>
      </Box>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel pb={4}>
      <CheckboxGroup options={options} onClickOption={onChange} selectedOptions={selectedOptions} />
    </AccordionPanel>
  </ChakraAccordionItem>
);
