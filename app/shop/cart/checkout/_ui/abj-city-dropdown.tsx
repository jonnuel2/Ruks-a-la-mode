var abuja_list = [
  "Select City",
  "airport",
  "apo",
  "apo legislative",
  "apo mechanic",
  "apo resettlement",
  "area 1",
  "area 2",
  "area 3",
  "area 4",
  "area 5",
  "area 6",
  "area 7",
  "area 8",
  "asokoro",
  "asokoro (naf valley)",
  "bwari",
  "central area",
  "citec mbora",
  "dawaki",
  "durummi",
  "efab karsana",
  "gaduwa",
  "galadimawa",
  "gishiri",
  "gudu",
  "guzape",
  "gwarinpa",
  "idu",
  "jabi",
  "jahi",
  "kabusa",
  "kado",
  "kaura",
  "karimo",
  "karsana",
  "karu",
  "katampe",
  "kubwa",
  "kuje",
  "life camp",
  "life camp (ochaco)",
  "lokogoma",
  "lugbe",
  "lugbe fha",
  "mabushi",
  "maitama",
  "mararaba",
  "mpape",
  "nyanya",
  "prince & princess",
  "utako",
  "wuse 1-7",
  "wuye",
];

interface AbjCityDropdownProps {
  setabjCity: (abjCity: string) => void;
  abjCity: string;
}

const AbjCityDropdown: React.FC<AbjCityDropdownProps> = ({
  setabjCity,
  abjCity,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setabjCity(e?.target?.value);

  return (
    <div className="mb-4">
      <select
        id="abjCity"
        name="abjCity"
        value={abjCity}
        onChange={handleChange}
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-transparent capitalize shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {abuja_list.map((abjCity) => (
          <option key={abjCity} value={abjCity} className="capitalize">
            {abjCity}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AbjCityDropdown;
