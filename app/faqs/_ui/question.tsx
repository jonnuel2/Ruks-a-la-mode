"use client";

import { QuestionProps } from "@/helpers/types";
import React, { useState } from "react";

function Question({ answer, question }: QuestionProps) {
  const [open, setopen] = useState(false);
  return (
    <div
      className={`w-full border-dark/20 bg-lightgrey ${
        open ? "border-2" : "border"
      } rounded-lg px-5  transition-all duration-700 ease-in-out`}
    >
      <div
        className="flex w-full justify-between items-center py-5 cursor-pointer"
        onClick={() => setopen(!open)}
      >
        <p>{question}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`h-5 w-5 ${
            open ? "rotate-180 hover:rotate-360" : "hover:rotate-180"
          } transition-all duration-700 ease-in-out`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
      <div
        className={`w-full transition-all duration-700 ease-in-out ${
          open ? "border-t border-dark/20 py-6" : "h-0"
        }`}
      >
        <p className={`${open ? "visible" : "hidden"} text-sm opacity-50`}>
          {answer}
        </p>
      </div>
    </div>
  );
}

export default Question;
