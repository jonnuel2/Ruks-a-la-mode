import { HeroTextProps } from "@/helpers/types";
import React from "react";

export default function HeroText({ subtitle, title }: HeroTextProps) {
  return (
    <div className="flex flex-col items-center text-center lg:w-2/3 w-full lg:mt-5">
      <p className="lg:text-5xl text-4xl tracking-wide">{title}</p>
      <p className="opacity-60 lg:text-base text-sm leading-relaxed tracking-wide mt-6">
        {subtitle}
      </p>
    </div>
  );
}
