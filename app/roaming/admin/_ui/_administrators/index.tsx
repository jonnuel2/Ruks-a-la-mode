import { getAdmins } from "@/helpers/api-controller";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Manager" | "Support";
}

const Administrators = () => {
  // const [admins, setAdmins] = useState<AdminUser[]>([
  //   {
  //     id: "A001",
  //     name: "John Doe",
  //     email: "john.doe@example.com",
  //     role: "Super Admin",
  //   },
  //   {
  //     id: "A002",
  //     name: "Jane Smith",
  //     email: "jane.smith@example.com",
  //     role: "Manager",
  //   },
  //   {
  //     id: "A003",
  //     name: "Bob Johnson",
  //     email: "bob.johnson@example.com",
  //     role: "Support",
  //   },
  // ]);

  const {
    data: adminsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admins"],
    queryFn: () => getAdmins(),
  });

  const admins = adminsData?.admins;

  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Filtered and searched admins
  const filteredAdmins = admins?.filter((admin: any) => {
    const matchesFilter =
      filter.toLowerCase() === "all" ||
      admin?.data?.role.toLowerCase() === filter.toLowerCase();
    const matchesSearch = admin?.id
      ?.toLowerCase()
      ?.includes(searchQuery?.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAdmins?.length / itemsPerPage);
  const displayedAdmins = filteredAdmins?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Management</h2>

      {/* Filters and Search */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {["All", "Super", "Deliveries", "Production"].map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`px-4 py-2 rounded ${
                filter.toLowerCase() === role?.toLowerCase()
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded w-1/3"
        />
      </div>

      {/* Admins Table */}
      <table className="min-w-full table-auto bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {displayedAdmins?.map((admin: any) => (
            <tr key={admin?.id}>
              <td className="px-4 py-2 border">{admin?.id}</td>
              <td className="px-4 py-2 border capitalize">
                {admin?.data?.role}
              </td>
              <td className="px-4 py-2 border capitalize">
                {admin?.data?.lastLogin}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Administrators;
