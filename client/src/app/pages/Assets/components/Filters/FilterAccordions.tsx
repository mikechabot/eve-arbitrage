import { FC } from 'react';
import { Accordion } from '@chakra-ui/react';

import { FilterAccordion } from 'app/pages/Assets/components/Filters/FilterAccordion';

import { FilterFunc, FilterOptions, FilterState } from 'app/pages/Assets/components/Filters/types';

interface FilterAccordionsProps {
  filters: FilterOptions;
  selectedFilters: FilterState;
  onFilterGroup: FilterFunc;
  onFilterStation: FilterFunc;
  onFilterCategory: FilterFunc;
}

export const FilterAccordions: FC<FilterAccordionsProps> = ({
  filters,
  selectedFilters,
  onFilterCategory,
  onFilterGroup,
  onFilterStation,
}) => (
  <Accordion allowToggle allowMultiple defaultIndex={[0, 1, 2]}>
    <FilterAccordion
      label="Categories"
      options={filters.categories}
      selectedOptions={selectedFilters.categories}
      onChange={onFilterCategory}
    />
    <FilterAccordion
      label="Groups"
      options={filters.groups}
      selectedOptions={selectedFilters.groups}
      onChange={onFilterGroup}
    />
    <FilterAccordion
      label="Stations"
      options={filters.stations}
      selectedOptions={selectedFilters.stations}
      onChange={onFilterStation}
    />
  </Accordion>
);
