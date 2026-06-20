export const COMMUTE_FACTORS = {
  car_solo: 0.21,
  carpool: 0.105,
  transit: 0.04,
  bike_walk: 0,
  wfh: 0,
}; // kg CO2e per km

export const HOME_ENERGY_ANNUAL = {
  grid_standard: 2500,
  grid_renewable: 300,
  solar: 100,
}; // kg CO2e per year

export const RECEIPT_CATEGORY_KG = {
  meat_dairy: 2.5,
  produce: 0.3,
  packaged_processed: 1.0,
  electronics: 50,
  clothing: 10,
  household: 5,
  other: 1,
}; // kg CO2e per line item, directional estimate for demo, not lab-grade figures
