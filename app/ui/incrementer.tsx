import { IncrementerProps } from "@/helpers/types";
import { bungee, inter } from "@/styles/fonts";

function Incrementer({ leftClick, rightClick, value }: IncrementerProps) {
  return (
    <div className="justify-between flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        onClick={leftClick}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="#1B1B1B"
        className="md:w-5 md:h-5 h-3 w-3"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        />
      </svg>
      <p
        className={`lg:text-sm text-coffee text-xs outline-none font-medium select-none`}
      >
        {value}
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="#1B1B1B"
        className="md:w-5 md:h-5 h-3 w-3"
        onClick={rightClick}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
    </div>
  );
}

export default Incrementer;
