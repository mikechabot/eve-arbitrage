import matchSorter from 'match-sorter';

/**
 * Filter row values greater than a specified value
 * @param rows
 * @param id
 * @param filterValue
 */
export const filterGreaterThan = (rows, id, filterValue) => {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
};

/**
 * This is an autoRemove method on the filter function that
 * when given the new filter value and returns true, the filter
 * will be automatically removed. Normally this is just an undefined
 * check, but here, we want to remove the filter if it's not a number
 * @param val
 */
filterGreaterThan.autoRemove = (val) => typeof val !== 'number';

/**
 * This is a custom aggregator that  takes in an array of leaf values and
 * returns the rounded median
 * @param leafValues
 */
export const roundedMedian = (leafValues) => {
  let min = leafValues[0] || 0;
  let max = leafValues[0] || 0;

  leafValues.forEach((value) => {
    min = Math.min(min, value);
    max = Math.max(max, value);
  });

  return Math.round((min + max) / 2);
};

/**
 * Perform a fuzzy match on the cell's content
 * @param rows
 * @param id
 * @param filterValue
 */
export const fuzzyTextFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]?.typeName] });
};

/**
 * Let the table remove the filter if the string is empty
 * @param val
 */
fuzzyTextFilterFn.autoRemove = (val) => !val;
