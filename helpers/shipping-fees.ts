const abujaDeliveryFees: any = {
  airport: 7000,
  apo: 4000,
  "apo legislative": 4500,
  "apo mechanic": 4500,
  "apo resettlement": 5000,
  "area 1": 4000,
  "area 2": 4000,
  "area 3": 4000,
  "area 4": 4000,
  "area 5": 4000,
  "area 6": 4000,
  "area 7": 4000,
  "area 8": 4000,
  "area 9": 4000,
  "area 10": 4000,
  "area 11": 4000,
  asokoro: 4500,
  "asokoro (naf valley)": 5000,
  bwari: 5000,
  "central area": 3000,
  "citec mbora": 4000,
  dawaki: 5000,
  durummi: 4000,
  "efab karsana": 5000,
  gaduwa: 4500,
  galadimawa: 4500,
  gishiri: 3500,
  gudu: 4500,
  guzape: 5000,
  gwarinpa: 4000,
  idu: 4500,
  jabi: 2500,
  jahi: 4000,
  kabusa: 5000,
  kado: 3500,
  kaura: 5000,
  karimo: 5000,
  karsana: 5500,
  karu: 7000,
  katampe: 3500,
  kubwa: 6000,
  kuje: 8000,
  "life camp": 3500,
  "life camp (ochaco)": 4000,
  lokogoma: 4500,
  lugbe: 4500,
  "lugbe fha": 4500,
  mabushi: 3000,
  maitama: 4000,
  mararaba: 7000,
  mpape: 3500,
  nyanya: 5500,
  "prince & princess": 4000,
  utako: 1500,
  "wuse 1-7": 3000,
  wuye: 2000,
};

const nigeriaDeliveryFees = [
  { min: 0, max: 2, standard: 9000, express: 12000 },
  { min: 3, max: 5, standard: 14000, express: 17000 },
  { min: 6, max: 8, standard: 19000, express: 22000 },
  { min: 9, max: 11, standard: 24000, express: 27000 },
  { min: 12, max: 14, standard: 29000, express: 32000 },
  { min: 15, max: 17, standard: 34000, express: 37000 },
  { min: 18, max: 20, standard: 39000, express: 42000 },
];

const freightDeliveryFee = { min: 0, max: 5, fee: 50000 };

const expressInternationalDeliveryFees = [
  {
    min: 0,
    max: 2,
    UK: 67000,
    WEST_AFRICA: 77000,
    US_CAN: 78000,
    EUROPE: 89000,
    AFRICA: 90500,
    ARAB: 96000,
    ASIA: 107000,
    CARIBBEANS: 107000,
  },
  {
    min: 2,
    max: 2.5,
    UK: 86000,
    WEST_AFRICA: 91000,
    US_CAN: 107000,
    EUROPE: 111000,
    AFRICA: 113000,
    ARAB: 119500,
    ASIA: 127000,
    CARIBBEANS: 137000,
  },
  {
    min: 2.5,
    max: 3,
    UK: 100500,
    WEST_AFRICA: 105500,
    US_CAN: 121500,
    EUROPE: 131000,
    AFRICA: 133000,
    ARAB: 142500,
    ASIA: 149500,
    CARIBBEANS: 164500,
  },
  {
    min: 3,
    max: 3.5,
    UK: 114000,
    WEST_AFRICA: 119000,
    US_CAN: 141500,
    EUROPE: 150500,
    AFRICA: 152500,
    ARAB: 164500,
    ASIA: 172000,
    CARIBBEANS: 192000,
  },
  {
    min: 3.5,
    max: 4,
    UK: 129000,
    WEST_AFRICA: 134000,
    US_CAN: 161500,
    EUROPE: 170500,
    AFRICA: 172500,
    ARAB: 188000,
    ASIA: 195000,
    CARIBBEANS: 221000,
  },
  {
    min: 4,
    max: 4.5,
    UK: 143000,
    WEST_AFRICA: 148500,
    US_CAN: 181500,
    EUROPE: 190500,
    AFRICA: 192500,
    ARAB: 210500,
    ASIA: 218000,
    CARIBBEANS: 249000,
  },
  {
    min: 4.5,
    max: 5,
    UK: 158500,
    WEST_AFRICA: 163500,
    US_CAN: 202000,
    EUROPE: 211500,
    AFRICA: 213500,
    ARAB: 234500,
    ASIA: 242000,
    CARIBBEANS: 278000,
  },
  {
    min: 5,
    max: 5.5,
    UK: 168500,
    WEST_AFRICA: 173500,
    US_CAN: 212000,
    EUROPE: 221500,
    AFRICA: 227500,
    ARAB: 248500,
    ASIA: 256000,
    CARIBBEANS: 300000,
  },
  {
    min: 5.5,
    max: 6,
    UK: 185000,
    WEST_AFRICA: 190500,
    US_CAN: 229000,
    EUROPE: 238000,
    AFRICA: 248500,
    ARAB: 269500,
    ASIA: 277000,
    CARIBBEANS: 329000,
  },
  {
    min: 6,
    max: 6.5,
    UK: 197000,
    WEST_AFRICA: 202500,
    US_CAN: 241000,
    EUROPE: 250000,
    AFRICA: 264500,
    ARAB: 286000,
    ASIA: 293000,
    CARIBBEANS: 353000,
  },
  {
    min: 6.5,
    max: 7,
    UK: 208500,
    WEST_AFRICA: 214000,
    US_CAN: 253000,
    EUROPE: 262000,
    AFRICA: 280500,
    ARAB: 302000,
    ASIA: 309000,
    CARIBBEANS: 376000,
  },
  {
    min: 7,
    max: 7.5,
    UK: 219500,
    WEST_AFRICA: 225000,
    US_CAN: 263500,
    EUROPE: 273000,
    AFRICA: 296000,
    ARAB: 317000,
    ASIA: 324000,
    CARIBBEANS: 399000,
  },
  {
    min: 7.5,
    max: 8,
    UK: 231000,
    WEST_AFRICA: 237000,
    US_CAN: 275500,
    EUROPE: 285000,
    AFRICA: 312000,
    ARAB: 333000,
    ASIA: 340500,
    CARIBBEANS: 423000,
  },
  {
    min: 8,
    max: 8.5,
    UK: 242500,
    WEST_AFRICA: 248000,
    US_CAN: 286500,
    EUROPE: 295500,
    AFRICA: 327000,
    ARAB: 348000,
    ASIA: 355500,
    CARIBBEANS: 446000,
  },
  {
    min: 8.5,
    max: 9,
    UK: 253500,
    WEST_AFRICA: 259500,
    US_CAN: 298500,
    EUROPE: 307500,
    AFRICA: 343000,
    ARAB: 364000,
    ASIA: 371500,
    CARIBBEANS: 470000,
  },
  {
    min: 9,
    max: 9.5,
    UK: 265500,
    WEST_AFRICA: 271500,
    US_CAN: 310000,
    EUROPE: 319500,
    AFRICA: 359000,
    ARAB: 380000,
    ASIA: 387500,
    CARIBBEANS: 494000,
  },
  {
    min: 9.5,
    max: 10,
    UK: 263000,
    WEST_AFRICA: 270000,
    US_CAN: 308000,
    EUROPE: 390000,
    AFRICA: 361000,
    ARAB: 383000,
    ASIA: 390000,
    CARIBBEANS: 504000,
  },
  {
    min: 10,
    max: 11,
    UK: 288300,
    WEST_AFRICA: 296000,
    US_CAN: 337800,
    EUROPE: 348800,
    AFRICA: 396100,
    ARAB: 420300,
    ASIA: 428000,
    CARIBBEANS: 553000,
  },
  {
    min: 11,
    max: 12,
    UK: 313600,
    WEST_AFRICA: 322000,
    US_CAN: 367600,
    EUROPE: 379600,
    AFRICA: 431200,
    ARAB: 457600,
    ASIA: 466000,
    CARIBBEANS: 602000,
  },
  {
    min: 12,
    max: 13,
    UK: 338900,
    WEST_AFRICA: 348000,
    US_CAN: 397400,
    EUROPE: 410400,
    AFRICA: 466300,
    ARAB: 494900,
    ASIA: 504000,
    CARIBBEANS: 652000,
  },
  {
    min: 13,
    max: 14,
    UK: 364200,
    WEST_AFRICA: 374000,
    US_CAN: 427200,
    EUROPE: 441200,
    AFRICA: 501400,
    ARAB: 532200,
    ASIA: 542000,
    CARIBBEANS: 701000,
  },
  {
    min: 14,
    max: 15,
    UK: 389500,
    WEST_AFRICA: 400000,
    US_CAN: 457000,
    EUROPE: 472000,
    AFRICA: 536500,
    ARAB: 569500,
    ASIA: 570000,
    CARIBBEANS: 751000,
  },
  {
    min: 15,
    max: 16,
    UK: 392400,
    WEST_AFRICA: 404400,
    US_CAN: 438800,
    EUROPE: 448400,
    AFRICA: 542800,
    ARAB: 563600,
    ASIA: 571600,
    CARIBBEANS: 778000,
  },
  {
    min: 16,
    max: 17,
    UK: 416300,
    WEST_AFRICA: 424800,
    US_CAN: 465600,
    EUROPE: 474800,
    AFRICA: 576100,
    ARAB: 598200,
    ASIA: 606700,
    CARIBBEANS: 826000,
  },
  {
    min: 17,
    max: 18,
    UK: 440200,
    WEST_AFRICA: 449200,
    US_CAN: 492400,
    EUROPE: 503200,
    AFRICA: 609200,
    ARAB: 632800,
    ASIA: 641800,
    CARIBBEANS: 874000,
  },
  {
    min: 18,
    max: 19,
    UK: 464100,
    WEST_AFRICA: 473600,
    US_CAN: 519200,
    EUROPE: 530600,
    AFRICA: 642700,
    ARAB: 667400,
    ASIA: 676900,
    CARIBBEANS: 922000,
  },
  {
    min: 19,
    max: 20,
    UK: 488000,
    WEST_AFRICA: 498000,
    US_CAN: 546000,
    EUROPE: 558000,
    AFRICA: 676000,
    ARAB: 702000,
    ASIA: 712000,
    CARIBBEANS: 970000,
  },
];

const standardInternationalDeliveryFees = [
  { min: 0, max: 2, UK: 60000, US: 75000, CAN: 75000, FRA: 77000 },
  { min: 2, max: 3, UK: 80000, US: 100000, CAN: 100000, FRA: 90000 },
  { min: 3, max: 4, UK: 90000, US: 120000, CAN: 120000, FRA: 105000 },
  { min: 4, max: 5, UK: 110000, US: 145000, CAN: 145000, FRA: 118000 },
  { min: 5, max: 6, UK: 130000, US: 160000, CAN: 160000, FRA: 137000 },
  { min: 6, max: 7, UK: 140000, US: 180000, CAN: 180000, FRA: 155000 },
  { min: 7, max: 8, UK: 155000, US: 200000, CAN: 200000, FRA: 180000 },
  { min: 8, max: 9, UK: 170000, US: 225000, CAN: 225000, FRA: 199000 },
  { min: 9, max: 10, UK: 193000, US: 235000, CAN: 235000, FRA: 216000 },
  { min: 10, max: 11, UK: 200000, US: 251000, CAN: 251000, FRA: 238000 },
  { min: 11, max: 12, UK: 218000, US: 265000, CAN: 265000, FRA: 269000 },
  { min: 12, max: 13, UK: 235000, US: 281000, CAN: 281000, FRA: 285000 },
  { min: 13, max: 14, UK: 250000, US: 296000, CAN: 296000, FRA: 309000 },
  { min: 14, max: 15, UK: 262000, US: 311000, CAN: 311000, FRA: 321000 },
  { min: 15, max: 16, UK: 392400, US: 438800, CAN: 448400, FRA: 542800 },
  { min: 16, max: 17, UK: 416300, US: 465600, CAN: 474800, FRA: 576100 },
  { min: 17, max: 18, UK: 440200, US: 492400, CAN: 503200, FRA: 609400 },
  { min: 18, max: 19, UK: 464100, US: 519200, CAN: 530600, FRA: 642700 },
  { min: 19, max: 20, UK: 488000, US: 546000, CAN: 558000, FRA: 676000 },
];

const countryGroups = {
  WEST_AFRICA: [
    "benin",
    "Burkina Faso",
    "Cabo Verde",
    "Cote D Ivoire",
    "Gambia",
    "Ghana",
    "Guinea",
    "Guinea Bissau",
    "Liberia",
    "Mali",
    "Niger",
    "Senegal",
    "Sierra Leone",
    "Togo",
  ],
  AFRICA: [
    "Algeria",
    "Angola",
    "Botswana",
    "Burundi",
    "Cameroon",
    "Chad",
    "Congo",
    "Djibouti",
    "Egypt",
    "Equatorial Guinea",
    "Ethiopia",
    "Gabon",
    "Kenya",
    "Lesotho",
    "Libya",
    "Madagascar",
    "Malawi",
    "Mauritania",
    "Mauritius",
    "Morocco",
    "Mozambique",
    "Namibia",
    "Rwanda",
    "Seychelles",
    "South Africa",
    "Sudan",
    "Swaziland",
    "Tanzania",
    "Tunisia",
    "Uganda",
    "Zambia",
    "Zimbabwe",
  ],
  UK: ["Ireland", "United Kingdom", "UK", "London"],
  EUROPE: [
    "Albania",
    "Andorra",
    "Austria",
    "Belarus",
    "Belgium",
    "Bosnia & Herzegovina",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Faroe Islands",
    "Finland",
    "France",
    "Germany",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Hungary",
    "Iceland",
    "Italy",
    "Jersey",
    "Kazakhstan",
    "Latvia",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macedonia",
    "Malta",
    "Monaco",
    "Montenegro",
    "Netherlands",
    "Norway",
    "Poland",
    "Portugal",
    "Romania",
    "Russia",
    "San Marino",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
    "Switzerland",
    "Ukraine",
  ],
  US_CAN: ["United States", "Canada"],
  ASIA: [
    "Afghanistan",
    "Armenia",
    "Azerbaijan",
    "Bahrain",
    "Bangladesh",
    "Bhutan",
    "Brunei",
    "Cambodia",
    "China",
    "Hong Kong",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Israel",
    "Japan",
    "Jordan",
    "Kuwait",
    "Kyrgyz Republic",
    "Laos",
    "Lebanon",
    "Macau",
    "Malaysia",
    "Maldives",
    "Mongolia",
    "Nepal",
    "Oman",
    "Pakistan",
    "Palestine",
    "Philippines",
    "Qatar",
    "Saudi Arabia",
    "Singapore",
    "South Korea",
    "Sri Lanka",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Thailand",
    "Timor L'Este",
    "Turkey",
    "Turkmenistan",
    "Uzbekistan",
    "Vietnam",
    "Yemen",
  ],
  CARIBBEANS: [
    "Anguilla",
    "Antigua & Barbuda",
    "Aruba",
    "Bahamas",
    "Barbados",
    "Bermuda",
    "British Virgin Islands",
    "Cayman Islands",
    "Cuba",
    "Dominica",
    "Dominican Republic",
    "French West Indies",
    "Grenada",
    "Haiti",
    "Jamaica",
    "Montserrat",
    "Puerto Rico",
    "Saint Kitts & Nevis",
    "Saint Lucia",
    "Saint Vincent",
    "Trinidad & Tobago",
    "Turks & Caicos",
    "Virgin Islands (US)",
  ],
  UNKNOWN: [
    "Select Country",
    "Argentina",
    "Australia",
    "Belize",
    "Bolivia",
    "Brazil",
    "Chile",
    "Colombia",
    "Cook Islands",
    "Costa Rica",
    "Cruise Ship",
    "Ecuador",
    "El Salvador",
    "Falkland Islands",
    "Fiji",
    "French Polynesia",
    "French West Indies",
    "Georgia",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guyana",
    "Honduras",
    "Isle of Man",
    "Mexico",
    "Moldova",
    "Netherlands Antilles",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Reunion",
    "Saint Pierre & Miquelon",
    "Samoa",
    "Satellite",
    "St. Lucia",
    "Suriname",
    "Tonga",
    "Uruguay",
    "Venezuela",
  ],
};

const scalingFactors = [
  {
    min: 0,
    max: 1,
    sf: 1,
  },
  {
    min: 2,
    max: 4,
    sf: 0.8,
  },
  {
    min: 5,
    max: 7,
    sf: 0.7,
  },
  {
    min: 8,
    max: 10,
    sf: 0.6,
  },
  {
    min: 11,
    max: 13,
    sf: 0.5,
  },
  {
    min: 14,
    max: 16,
    sf: 0.4,
  },
  {
    min: 17,
    max: 19,
    sf: 0.3,
  },
  {
    min: 20,
    max: 22,
    sf: 0.2,
  },
  {
    min: 23,
    max: 25,
    sf: 0.1,
  },
];

export {
  abujaDeliveryFees,
  nigeriaDeliveryFees,
  freightDeliveryFee,
  expressInternationalDeliveryFees,
  standardInternationalDeliveryFees,
  countryGroups,
  scalingFactors,
};
