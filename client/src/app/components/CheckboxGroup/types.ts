export interface CheckboxGroupProps {
  options: Set<string> | string[];
  selectedOptions: Set<string>;
  onClickOption: (val: string) => void;
}
