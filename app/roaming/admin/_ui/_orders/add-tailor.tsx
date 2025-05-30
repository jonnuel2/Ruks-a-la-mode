import React, { useEffect, useState } from "react";

type Tailor = {
  name: string;
  description: string;
};

type AddTailorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tailors: Tailor[]) => Promise<void> | void;
  orderId: string;
  initialData: Tailor[];
};

const AddTailorModal: React.FC<AddTailorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  orderId,
  initialData,
}) => {
  const [tailorList, setTailorList] = useState<Tailor[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setTailorList(initialData);
      setIsAdding(false); // editing mode
    } else {
      setTailorList([{ name: "", description: "" }]);
      setIsAdding(true); // adding mode
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddInput = () => {
    setTailorList([...tailorList, { name: "", description: "" }]);
  };

  const handleChange = (index: number, field: keyof Tailor, value: string) => {
    const updated = [...tailorList];
    updated[index][field] = value;
    setTailorList(updated);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(tailorList);
      // Close modal automatically after successful submit
      onClose();
    } catch (error) {
      // optionally handle error here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Assign / Edit Tailors</h2>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {tailorList.map((tailor, index) => (
            <div key={index} className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Tailor Name</label>
              <input
                type="text"
                value={tailor.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="Enter tailor name"
                className="border p-2 rounded text-sm"
                disabled={isSubmitting}
              />

              <label className="text-sm font-semibold">Description</label>
              <input
                type="text"
                value={tailor.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
                placeholder="Enter description"
                className="border p-2 rounded text-sm"
                disabled={isSubmitting}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleAddInput}
            className="text-blue-600 text-sm underline"
            disabled={isSubmitting}
          >
            + Add Another Tailor
          </button>

          <div className="space-x-2">
            <button
              onClick={handleSubmit}
              className="bg-gray-900 text-white px-4 py-2 text-sm rounded hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (isAdding ? "Adding..." : "Saving...") : isAdding ? "Add" : "Save"}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 text-sm rounded hover:bg-gray-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTailorModal;
