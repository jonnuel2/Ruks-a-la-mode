// app/admin/products/components/CategoryFilter.tsx
"use client";

export default function CategoryFilter({
  onSelectCategory,
  categories,
}: {
  onSelectCategory: (category: string) => void;
  categories: string[];
}) {
  return (
    <select
      onChange={(e) => onSelectCategory(e.target.value)}
      className="border lg:p-2 p-1 ml-1 rounded text-xs capitalize"
    >
      <option value="">All Categories</option>
      {categories?.map((category) => (
        <option key={category} value={category} className="">
          {category}
        </option>
      ))}
    </select>
  );
}
