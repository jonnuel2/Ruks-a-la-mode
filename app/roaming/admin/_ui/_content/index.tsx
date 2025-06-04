import {
  createBanner,
  getBanners,
  getPretext,
  updateBanner,
  updatePretext,
  deleteBanner as deleteBannerApi,
} from "@/helpers/api-controller";
import { storage } from "@/helpers/utils/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { Audio, TailSpin } from "react-loader-spinner";

type Banner = {
  id: string;
  imageUrl: string | null;
  videoUrl?: string | null;
  status: "active" | "inactive";
};

const Content = () => {
  const [loading, setLoading] = useState(false);

  const [preText, setPreText] = useState("");

  const {
    data: bannersData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: () => getBanners(),
  });
  const {
    data: pretextData,
    isLoading: isPretextLoading,
    isError: isPretextError,
    refetch: refetchPretext,
  } = useQuery({
    queryKey: ["pretext"],
    queryFn: () => getPretext(),
  });

  const banners = bannersData?.banners;
  const pretext = pretextData?.preText;

  const uploadMedia = async (file: File) => {
    if (!file) return;

    const mediaType = file.type.startsWith("video/") ? "videos" : "images";
    const storageRef = ref(storage, `banners/${mediaType}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optional: Progress handler
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const addBannerMutation = useMutation({
    mutationFn: (data: any) => createBanner(data),
    onSuccess: () => refetch(),
  });
  const updateBannerMutation = useMutation({
    mutationFn: (data: any) => updateBanner(data),
    onSuccess: () => refetch(),
  });
  const updatePretextMutation = useMutation({
    mutationFn: () => updatePretext(preText),
  });

  const deleteBannerMutation = useMutation({
    mutationFn: (id: string) => deleteBannerApi(id),
    onSuccess: () => refetch(),
    onError: (error: any) => {
      alert(error.message || "Something went wrong deleting the banner.");
    },
  });

  // Function that gets called on delete button click
  const deleteBanner = (id: string) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      deleteBannerMutation.mutate(id);
    }
  };

  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [file, setFile] = useState<File | null>(null);

  // Filtered and searched banners
  const filteredBanners = banners?.filter((banner: any) => {
    const matchesFilter = filter === "All" || banner?.data?.status === filter;
    return matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBanners?.length / itemsPerPage);
  const displayedBanners = filteredBanners?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFormSubmit = async () => {
    setLoading(true);
    const banner = { ...editingBanner };

    if (file) {
      const url = await uploadMedia(file);
      if (file.type.startsWith("video/")) {
        banner.videoUrl = url;
        banner.imageUrl = null; // Ensure only video is set
      } else {
        banner.imageUrl = url;
        banner.videoUrl = null; // Ensure only image is set
      }
    }

    if (editingBanner?.id) {
      updateBannerMutation.mutate(banner);
    } else {
      const filteredBanner = Object.fromEntries(
        Object.entries(banner).filter(([_, value]) => value !== "")
      );
      addBannerMutation.mutate(filteredBanner);
    }

    setLoading(false);
    setEditingBanner(null);
  };
  // Delete banner
  // const deleteBanner = (id: string) => {};

  useEffect(() => {
    setPreText(pretext);
  }, [pretext]);

  if (isLoading) return <Audio />;

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Banner</h2>
      {/* Filters and Search */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {["All", "active", "inactive"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded text-xs ${
                filter === status
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
          <button
            onClick={() =>
              setEditingBanner({
                id: "",
                imageUrl: "",
                status: "active",
              })
            }
            className="bg-green-500 text-white px-4 py-2 rounded text-xs"
          >
            Add New Banner
          </button>
        </div>

        {/* <input
          type="text"
          placeholder="Search by Title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded w-1/3"
        /> */}
      </div>
      {/* Banners Table */}
      <table className="min-w-full table-auto bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            {/* <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Description</th> */}
            <th className="px-4 py-2 border text-sm">Image</th>
            <th className="px-4 py-2 border text-sm">Status</th>
            <th className="px-4 py-2 border text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedBanners?.map((banner: any) => (
            <tr key={banner?.id}>
              <td className="px-4 py-2 border text-xs">
                {banner?.data?.imageUrl ? (
                  <img
                    src={banner?.data?.imageUrl}
                    alt={`Banner ${banner?.id}`}
                    className="w-28 h-16 object-cover rounded"
                  />
                ) : banner?.data?.videoUrl ? (
                  <video
                    src={banner?.data?.videoUrl}
                    className="w-28 h-16 object-cover rounded"
                    controls
                  />
                ) : (
                  <span className="text-gray-500">No Media</span>
                )}
              </td>
              <td className="px-4 py-2 border text-xs capitalize">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    banner?.data?.status === "active"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {banner?.data?.status}
                </span>
              </td>
              <td className="px-4 py-2 border text-xs">
                <button
                  onClick={() =>
                    setEditingBanner({
                      id: banner?.id,
                      imageUrl: banner?.data?.imageUrl,
                      videoUrl: banner?.data?.videoUrl,
                      status: banner?.data?.status,
                    })
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs mr-2 lg:mb-0 mb-2"
                >
                  Edit
                </button>
                {/* <button
                  onClick={() => deleteBanner(banner?.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                >
                  Delete
                </button> */}

                <button
                  onClick={() => deleteBanner(banner?.id)}
                  disabled={deleteBannerMutation.isPending}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                >
                  {deleteBannerMutation.isPending ? "Deleting..." : "Delete"}
                </button>
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
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 text-xs"
        >
          Previous
        </button>
        <span className="text-xs">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 text-xs"
        >
          Next
        </button>
      </div>
      {/* Add/Edit Banner Form */}
      {editingBanner !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md lg:w-1/3 w-full">
            <h3 className="text-xl font-bold mb-4">
              {editingBanner?.id ? "Edit Banner" : "Add New Banner"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFormSubmit();
              }}
            >
              {editingBanner?.id ? (
                <div className="mb-4">
                  {/* <img
                    src={editingBanner?.imageUrl}
                    alt={editingBanner?.id}
                    className="w-28 h-16 object-cover rounded"
                  /> */}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) =>
                      setFile(e.target.files ? e.target.files[0] : null)
                    }
                    className="border text-xs px-4 py-2 rounded w-full"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <input
                    type="file"
                    onChange={(e) =>
                      e.target.files ? setFile(e?.target?.files[0]) : null
                    }
                    className="border text-xs px-4 py-2 rounded w-full"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-700">Status</label>
                <select
                  value={editingBanner?.status || "active"}
                  onChange={(e) =>
                    setEditingBanner((prev) =>
                      prev
                        ? {
                            ...prev,
                            status: e.target.value as "active" | "inactive",
                          }
                        : null
                    )
                  }
                  className="border text-xs px-4 py-2 rounded w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {loading ? (
                    <TailSpin width={20} height={20} />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* PREHEADER */}
      <div>
        <h2 className="text-lg font-bold mb-4 mt-8">Pre Header</h2>
        <div>
          <input
            onChange={(e) => setPreText(e.target.value)}
            value={preText ? preText : ""}
            className="w-full p-2 outline-none border text-xs border-dark bg-transparent"
          />
          <button
            onClick={() => {
              preText
                ? preText === pretext
                  ? alert("No changes made to Preheader Text")
                  : updatePretextMutation.mutate()
                : null;
              alert("Saved. Reload to see changes.");
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded mt-4 text-xs"
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Content;
