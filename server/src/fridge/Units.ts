// See https://en.wikibooks.org/wiki/Cookbook:Units_of_measurement

export const UNITS_OTHER = [
  '', // An empty unit. Example: 1 egg.
  'piece',
  'slice',
];

export const UNITS_VOLUME = [
  'teaspoon',
  'tablespoon',
  'fluid  ounce',
  'gill',
  'cup',
  'pint',
  'quart',
  'gallon',
  'ml',
  'l',
  'dl',
];

export const UNITS_MASS_AND_WEIGHT = [
  'pound',
  'ounce',
  'mg',
  'g',
  'kg',
];

export const UNITS = [
  ...UNITS_OTHER,
  ...UNITS_VOLUME,
  ...UNITS_MASS_AND_WEIGHT,
];
