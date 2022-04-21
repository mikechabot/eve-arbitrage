export interface FilterState {
  groups: Set<string>;
  stations: Set<string>;
  categories: Set<string>;
}

export interface FilterOptions {
  groups: Set<string>;
  stations: Set<string>;
  categories: Set<string>;
  quantityRange: {
    min: number;
    max: number;
  };
}

export type FilterFunc = (val: string) => void;
