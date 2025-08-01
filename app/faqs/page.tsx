import React from "react";
import Questions from "./_ui/questions";
import HeroText from "../ui/hero-text";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center flex-col w-full lg:px-16 px-6 pt-3 overflow-hidden">
      
      <HeroText
        title="Frequently Asked Questions"
        subtitle=""
      />
      <Questions />
    </div>
  );
}