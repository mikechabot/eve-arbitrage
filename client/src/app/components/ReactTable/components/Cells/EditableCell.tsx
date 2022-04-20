import React, { useEffect, useState } from 'react';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';

export const Dummy = () => <span />;

export const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue.orderSize || 0);

  const onChange = (val) => {
    setValue(val);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue.orderSize);
  }, [initialValue]);

  return (
    <NumberInput
      size="xs"
      width={32}
      min={0}
      max={initialValue.quantity}
      value={value || ''}
      onChange={(valueString) => {
        const val = valueString ? parseInt(valueString, 10) : undefined;
        onChange(val);
      }}
      onBlur={onBlur}
    >
      <NumberInputField placeholder="Order #" />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};
