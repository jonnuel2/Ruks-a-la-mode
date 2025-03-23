// app/admin/products/components/SearchBar.tsx
"use client";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  return (
    <input
      type="text"
      placeholder="Search by name or ID"
      onChange={(e) => onSearch(e.target.value)}
      className="border lg:p-2 p-1 rounded text-xs"
    />
  );
}
