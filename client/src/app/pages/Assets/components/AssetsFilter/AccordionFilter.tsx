import {
  Box,
  Text,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  AccordionItem as ChakraAccordionItem,
} from '@chakra-ui/react';
import { CheckboxGroup } from 'app/components/CheckboxGroup';

interface AccordionItemProps {
  label: string;
  options: Set<string>;
  onChange: (val: string) => void;
}

export const AccordionFilter: React.FC<AccordionItemProps> = ({ label, options, onChange }) => (
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
      <CheckboxGroup options={options} onClickOption={onChange} />
    </AccordionPanel>
  </ChakraAccordionItem>
);
