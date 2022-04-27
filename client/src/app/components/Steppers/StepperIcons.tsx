import { Icon } from '@chakra-ui/react';
import { GrDiamond } from 'react-icons/gr';
import { MdAssignment, MdAttachMoney } from 'react-icons/md';
import { FaDiscord } from 'react-icons/fa';

export { GrDiamond, MdAssignment, MdAttachMoney, FaDiscord };

export const StepOneIcon = () => <Icon w={6} h={6} as={GrDiamond} />;
export const StepTwoIcon = () => <Icon w={6} h={6} as={MdAssignment} />;
export const StepThreeIcon = () => <Icon w={6} h={6} as={FaDiscord} />;
export const StepFourIcon = () => <Icon w={6} h={6} as={MdAttachMoney} />;
