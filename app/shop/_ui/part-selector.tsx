"use client";

import { ProductComponent } from "@/helpers/types";
import { useState } from "react";

type PartSelectorProps = {
  components: ProductComponent[] | undefined;
  onSelectPart: (selected: ProductComponent) => void;
  selectedPart: string;
};

export default function PartSelector({
  components,
  onSelectPart,
  selectedPart,
}: PartSelectorProps) {
  const handleSelect = (component: ProductComponent) => {
    onSelectPart(component);
  };

  return (
    <div className="mt-6 w-full">
      <p className="mb-2 font-semibold">Select Component</p>
      <div className="grid lg:grid-cols-4 gap-2 grid-cols-2">
        <label
          key={"Full Set"}
          className={`px-3 py-1.5 border rounded-md uppercase text-[9px] cursor-pointer flex items-center text-center justify-center ${
            selectedPart === "" ? "bg-black text-white" : "bg-white"
          }`}
        >
          <input
            type="radio"
            name="component"
            value={"Full Set"}
            checked={selectedPart === ""}
            onChange={() =>
              handleSelect({ id: "", name: "", price: 0, stock: 0 })
            }
            className="hidden"
          />
          Full Set
        </label>
        {components?.map((component) => (
          <label
            key={component?.name}
            className={`px-3 py-1.5 border rounded-md uppercase text-[9px] cursor-pointer flex items-center text-center justify-center ${
              selectedPart === component?.name
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            <input
              type="radio"
              name="component"
              value={component?.name}
              checked={selectedPart === component?.name}
              onChange={() => handleSelect(component)}
              className="hidden"
            />
            {component?.name}
          </label>
        ))}
      </div>
    </div>
  );
}
