export const LNG_PRICE_HISTORY = [
  { month: "Jul-25", spot: 14.2, contract: 11.0 },
  { month: "Aug-25", spot: 15.8, contract: 11.0 },
  { month: "Sep-25", spot: 16.1, contract: 11.0 },
  { month: "Oct-25", spot: 17.4, contract: 11.0 },
  { month: "Nov-25", spot: 18.9, contract: 11.0 },
  { month: "Dec-25", spot: 20.2, contract: 11.0 },
  { month: "Jan-26", spot: 19.7, contract: 11.0 },
  { month: "Feb-26", spot: 21.3, contract: 11.0 },
  { month: "Mar-26", spot: 22.8, contract: 11.0 },
  { month: "Apr-26", spot: 24.1, contract: 11.0 },
  { month: "May-26", spot: 23.6, contract: 11.0 },
  { month: "Jun-26", spot: 26.25, contract: 11.0 },
];

export const IMPORT_VOLUME_BY_FUEL = [
  { month: "Jul-25", LNG: 280, Diesel: 420, Petrol: 185, CrudeOil: 520, FurnaceOil: 95 },
  { month: "Aug-25", LNG: 295, Diesel: 435, Petrol: 190, CrudeOil: 535, FurnaceOil: 88 },
  { month: "Sep-25", LNG: 310, Diesel: 410, Petrol: 178, CrudeOil: 510, FurnaceOil: 92 },
  { month: "Oct-25", LNG: 325, Diesel: 445, Petrol: 195, CrudeOil: 560, FurnaceOil: 98 },
  { month: "Nov-25", LNG: 340, Diesel: 460, Petrol: 200, CrudeOil: 580, FurnaceOil: 105 },
  { month: "Dec-25", LNG: 360, Diesel: 480, Petrol: 210, CrudeOil: 600, FurnaceOil: 112 },
  { month: "Jan-26", LNG: 370, Diesel: 490, Petrol: 215, CrudeOil: 615, FurnaceOil: 108 },
  { month: "Feb-26", LNG: 355, Diesel: 470, Petrol: 205, CrudeOil: 590, FurnaceOil: 100 },
  { month: "Mar-26", LNG: 380, Diesel: 500, Petrol: 220, CrudeOil: 630, FurnaceOil: 115 },
  { month: "Apr-26", LNG: 390, Diesel: 510, Petrol: 225, CrudeOil: 640, FurnaceOil: 118 },
  { month: "May-26", LNG: 375, Diesel: 495, Petrol: 218, CrudeOil: 620, FurnaceOil: 110 },
  { month: "Jun-26", LNG: 385, Diesel: 505, Petrol: 222, CrudeOil: 635, FurnaceOil: 113 },
];

export const LIVE_PRICES = {
  crudeOil: { value: 82.45, unit: "$/barrel", change: +1.2, trend: "up" },
  lng: { value: 26.25, unit: "$/MMBtu", change: +0.85, trend: "up" },
  diesel: { value: 718.50, unit: "$/MT", change: -3.20, trend: "down" },
  petrol: { value: 692.30, unit: "$/MT", change: +4.10, trend: "up" },
  furnaceOil: { value: 485.00, unit: "$/MT", change: -1.50, trend: "down" },
  lpg: { value: 578.00, unit: "$/MT", change: +2.20, trend: "up" },
};

export const COUNTRY_COMPARISON = [
  { country: "Bangladesh", crudeOil: 82.45, lng: 26.25, diesel: 718.50, petrol: 692.30 },
  { country: "India", crudeOil: 81.20, lng: 24.80, diesel: 698.00, petrol: 675.00 },
  { country: "Pakistan", crudeOil: 84.10, lng: 28.40, diesel: 745.00, petrol: 720.00 },
  { country: "Sri Lanka", crudeOil: 86.50, lng: 29.10, diesel: 762.00, petrol: 735.00 },
];

export const PRICE_SHOCK_THRESHOLD = 18.0;
