import {
  GrDiamond,
  MdAssignment,
  FaDiscord,
  StepOneIcon,
  StepThreeIcon,
  StepTwoIcon,
} from 'app/components/Steppers/StepperIcons';

export const steps = [
  {
    label: 'Pick Assets',
    icon: StepOneIcon,
    rawIcon: GrDiamond,
  },
  {
    label: 'Create Order',
    icon: StepTwoIcon,
    rawIcon: MdAssignment,
  },
  {
    label: 'Share',
    icon: StepThreeIcon,
    rawIcon: FaDiscord,
  },
];
