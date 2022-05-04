import { FC } from 'react';

import {
  Text,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';

import { FilterAccordions } from 'app/pages/Assets/components/Filters/FilterAccordions';
import { FilterFunc, FilterOptions, FilterState } from '../types';

interface FilterDrawerProps {
  isOpen: boolean;
  resultsCount: number;
  toggleDrawerOpen: () => void;
  filters: FilterOptions;
  selectedFilters: FilterState;
  onFilterGroup: FilterFunc;
  onFilterStation: FilterFunc;
  onFilterCategory: FilterFunc;
}

export const FilterDrawer: FC<FilterDrawerProps> = ({
  isOpen,
  resultsCount,
  filters,
  selectedFilters,
  onFilterGroup,
  onFilterStation,
  onFilterCategory,
  toggleDrawerOpen,
}) => {
  return (
    <Drawer isOpen={isOpen} onClose={toggleDrawerOpen} placement="bottom" isFullHeight>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          Filters
          <Text fontSize="sm" fontWeight={600}>
            Showing {resultsCount} results
          </Text>
        </DrawerHeader>
        <DrawerBody>
          <FilterAccordions
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterGroup={onFilterGroup}
            onFilterStation={onFilterStation}
            onFilterCategory={onFilterCategory}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
