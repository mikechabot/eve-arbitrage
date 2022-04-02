import React from 'react';
import { Button, Icon } from '@chakra-ui/react';
import { MdAddCircle, MdRemoveCircle } from 'react-icons/md';

// @ts-ignore
export const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  // @ts-ignore
  const { checked, onChange } = rest;

  if (indeterminate) {
    return (
      <Button size="xs" onClick={onChange}>
        <Icon w={4} h={4} as={MdRemoveCircle} {...rest} color="red.500" />
      </Button>
    );
  }

  return (
    <Button
      // @ts-ignore
      ref={resolvedRef}
      size="xs"
      onClick={(e) => {
        // @ts-ignore
        e.target.checked = !checked;
        onChange(e);
      }}
      bgColor={checked ? 'base' : 'base'}
      {...rest}
    >
      <Icon
        w={4}
        h={4}
        as={checked ? MdRemoveCircle : MdAddCircle}
        color={checked ? 'red.500' : 'green.500'}
      />
    </Button>
  );
});
