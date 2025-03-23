// app/admin/products/components/ExtraInfoAccordion.tsx
"use client";

import { formatPrice } from "@/helpers/functions";
import { ProductProps } from "@/helpers/types";

export default function ExtraInfoAccordion({ product }: { product: any }) {
  return (
    <div className="p-4 bg-gray-50">
      <h3 className="font-bold text-sm mb-2">Extra Info</h3>
      <p className="text-xs mb-3">
        Quantity:{" "}
        {product?.colors?.reduce((sum: any, c: any) => sum + c?.stock, 0)}
      </p>
      <div className="grid grid-cols-5 gap-1 w-fit">
        {product?.colors.map((color: any, i: number) => (
          <div
            className={`flex items-center justify-center w-5 h-5 rounded-full p-0.5`}
            key={i}
          >
            <span
              key={i}
              className={` inline-block w-full h-full rounded-full`}
              style={{ backgroundColor: color.hexCode }}
              title={color.name}
            ></span>
          </div>
        ))}
      </div>

      {product.components?.length > 0 && (
        <div>
          <h4 className="text-sm">Components</h4>
          <ul>
            {product.components.map((component: any) => (
              <li key={component.name} className="text-xs">
                {component.name} - {formatPrice("NGN", component.price)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
