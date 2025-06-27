"use client";

import { useState, useEffect } from "react";
import { ProductProps } from "@/helpers/types";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/helpers/utils/auth";
import { TailSpin } from "react-loader-spinner";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductProps; // Passed when editing
  onSave: (product: any) => void;
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
  onSave,
}: ProductModalProps) {
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    price: "",
    images: [],
    category: "",
    colors: [],
    components: [],
    weight: "",
    priceInUsd: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        images: [],
        category: "",
        colors: [],
        quantity: "",
        materialOptions: [],
        components: [],
        weight: "",
        priceInUsd: "",
      });
    }
  }, [product]);

  const uploadImage = async (file: File) => {
    if (!file) return;

    const storageRef = ref(storage, `products/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optional: Handle progress
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    // Identify changed fields
    if (formData?.id) {
      const updatedFields: any = {};
      if (!product) return; // Ensure we have an existing product to update

      for (const key in formData) {
        if (
          formData[key as keyof ProductProps] !==
          product[key as keyof ProductProps]
        ) {
          updatedFields[key as keyof ProductProps] =
            formData[key as keyof ProductProps];
        }
      }

      if (Object.keys(updatedFields).length === 0) {
        console.log("No changes detected.");
        return;
      }

      if (Object.keys(updatedFields).length > 0) {
        if (updatedFields?.hasOwnProperty("price")) {
          updatedFields["price"] = parseInt(updatedFields?.price);
        }
        if (updatedFields?.hasOwnProperty("priceInUsd")) {
          updatedFields["priceInUsd"] = parseFloat(updatedFields?.priceInUsd);
        }
        if (updatedFields?.hasOwnProperty("quantity")) {
          updatedFields["quantity"] = parseInt(updatedFields?.quantity);
        }
        if (updatedFields?.hasOwnProperty("weight")) {
          updatedFields["weight"] = parseFloat(updatedFields?.weight);
        }
        onSave({ ...updatedFields, id: formData?.id }); // Send only updated fields
        setFormData({
          name: "",
          description: "",
          price: "",
          images: [],
          category: "",
          colors: [],
          components: [],
          weight: "",
          priceInUsd: "",
        });
      }
    } else {
      let imageUrls = [];
      //Upload Images
      const uploadPromises = formData?.images?.map((file: File) =>
        uploadImage(file)
      );

      imageUrls = await Promise.all(uploadPromises);

      let product = { ...formData };
      product.price = parseInt(product.price);
      product.priceInUsd = parseFloat(product.priceInUsd);
      product.weight = parseFloat(product.weight);
      product.images = imageUrls;
      if (product?.components) {
        let components = [...product?.components];
        components?.forEach((c) => (c.weight = parseFloat(c.weight)));
      }
      onSave(product);
      setFormData({
        name: "",
        description: "",
        price: "",
        images: [],
        category: "",
        colors: [],
        components: [],
        weight: "",
        priceInUsd: "",
      });
    }
    setLoading(false);
    onClose();
  };

  // Handle dynamic input updates
  const handleAddColor = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: "", hexCode: "", stock: "" }], // Ensure it matches ColorProps
    });
  };

  const handleColorChange = (
    index: number,
    key: string,
    value: string | number
  ) => {
    const updatedColors = [...formData.colors];
    updatedColors[index] = { ...updatedColors[index], [key]: value };
    setFormData({ ...formData, colors: updatedColors });
  };

  const handleRemoveColor = (index: number) => {
    const updatedColors = formData.colors.filter(
      (_: any, i: number) => i !== index
    );
    setFormData({ ...formData, colors: updatedColors });
  };

  const handleAddImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ""],
    });
  };

  const handleImageChange = (index: number, value: File | string) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = formData.images.filter(
      (_: any, i: number) => i !== index
    );
    setFormData({ ...formData, images: updatedImages });
  };

  // const handleAddMaterial = () => {
  //   setFormData({
  //     ...formData,
  //     materialOptions: [
  //       ...(formData.materialOptions ?? []),
  //       { name: "", price: 0, stock: 0 },
  //     ],
  //   });
  // };

  // const handleMaterialChange = (
  //   index: number,
  //   key: string,
  //   value: string | number
  // ) => {
  //   const updatedMaterials = [...(formData.materialOptions ?? [])]; // Ensure it's an array
  //   if (updatedMaterials[index]) {
  //     updatedMaterials[index] = { ...updatedMaterials[index], [key]: value };
  //   }
  //   setFormData({ ...formData, materialOptions: updatedMaterials });
  // };

  // const handleRemoveMaterial = (index: number) => {
  //   const updatedMaterials = (formData.materialOptions ?? []).filter(
  //     (_: any, i: number) => i !== index
  //   );
  //   setFormData({ ...formData, materialOptions: updatedMaterials });
  // };

  const handleAddComponent = () => {
    setFormData({
      ...formData,
      components: [
        ...(formData.components ?? []),
        { name: "", price: "", stock: "", id: "", weight: "",priceInUsd: "" } // Ensure it matches ComponentProps,
      ],
    });
  };

  const handleComponentChange = (
    index: number,
    key: string,
    value: string | number
  ) => {
    const updatedComponents = [...(formData.components ?? [])];
    updatedComponents[index] = { ...updatedComponents[index], [key]: value };
    setFormData({ ...formData, components: updatedComponents });
  };

  const handleRemoveComponent = (index: number) => {
    const updatedComponents = (formData.components ?? []).filter(
      (_: any, i: number) => i !== index
    );
    setFormData({ ...formData, components: updatedComponents });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
      <div className="bg-white p-6 rounded-lg lg:w-1/2 overflow-y-scroll">
        <h2 className="text-lg lg:text-sm font-bold mb-4">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-2">
  <div className="space-y-3">
    {/* Basic Fields */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className="block text-xs mb-1">Product Name</label>
        <input
          type="text"
          placeholder="Enter product name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded text-xs"
          required
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Price (₦)</label>
        <input
          type="text"
          value={formData.price}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (/^\d*$/.test(inputValue)) {
              setFormData({ ...formData, price: inputValue });
            }
          }}
          placeholder="Enter price"
          className="w-full p-2 border text-xs rounded"
          required
        />
      </div>
            <div>
        <label className="block text-xs mb-1">Price ($)</label>
        <input
          type="text"
          value={formData.priceInUsd}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (/^\d*$/.test(inputValue)) {
              setFormData({ ...formData, priceInUsd: inputValue });
            }
          }}
          placeholder="Enter price in USD"
          className="w-full p-2 border text-xs rounded"
          required
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Weight (kg)</label>
        <input
          type="text"
          placeholder="Enter weight"
          value={formData.weight}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (/^\d*\.?\d*$/.test(inputValue)) {
              setFormData({ ...formData, weight: inputValue });
            }
          }}
          className="w-full p-2 text-xs border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Category</label>
        <input
          type="text"
          placeholder="Enter category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full p-2 text-xs border rounded"
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-xs mb-1">Description</label>
      <textarea
        placeholder="Enter product description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full p-2 border rounded text-xs min-h-[80px]"
        required
      />
    </div>

    {/* Images Section */}
    <div className="border-t pt-3">
      <p className="text-xs font-medium mb-2">Images</p>
      <div className="space-y-2">
        {formData?.images?.map((image: any, index: number) => (
          <div key={index} className="flex gap-2">
            {formData?.id ? (
              <input
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="flex-1 p-2 border text-xs rounded"
              />
            ) : (
              <input
                type="file"
                onChange={(e) =>
                  e.target.files
                    ? handleImageChange(index, e.target.files[0])
                    : null
                }
                className="flex-1 p-1 border text-xs rounded"
              />
            )}
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="text-xs bg-gray-100 px-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddImage}
          className="text-xs text-blue-500 mt-1"
        >
          + Add Image
        </button>
      </div>
    </div>

    {/* Colors Section */}
    <div className="border-t pt-3">
      <p className="text-xs font-medium mb-2">Colors</p>
      <div className="space-y-2">
        {formData.colors.map((color: any, index: number) => (
          <div key={index} className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs block mb-1">Color Name</label>
              <input
                type="text"
                placeholder="Color name"
                value={color.name}
                onChange={(e) =>
                  handleColorChange(index, "name", e.target.value)
                }
                className="w-full p-2 border text-xs rounded"
              />
            </div>
            <div>
              <label className="text-xs block mb-1">Hex Code</label>
              <input
                type="text"
                placeholder="#FFFFFF"
                value={color.hexCode}
                onChange={(e) =>
                  handleColorChange(index, "hexCode", e.target.value)
                }
                className="w-full p-2 border text-xs rounded"
              />
            </div>
            <div>
              <label className="text-xs block mb-1">Stock</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Qty"
                  value={color.stock}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^\d*$/.test(inputValue)) {
                      handleColorChange(
                        index,
                        "stock",
                        parseFloat(inputValue)
                      );
                    }
                  }}
                  className="no-spinner w-full p-2 border text-xs rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveColor(index)}
                  className="text-xs bg-gray-100 px-2 rounded"
                >
                  X
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddColor}
          className="text-xs text-blue-500 mt-1"
        >
          + Add Color
        </button>
      </div>
    </div>

    {/* Components Section */}
    <div className="border-t pt-3">
      <p className="text-xs font-medium mb-2">Components</p>
      <div className="space-y-2">
        {formData?.components?.map((component: any, index: number) => (
          <div key={index} className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs block mb-1">Name</label>
              <input
                type="text"
                placeholder="Component name"
                value={component.name}
                onChange={(e) =>
                  handleComponentChange(index, "name", e.target.value)
                }
                className="w-full p-2 border text-xs rounded"
              />
            </div>
            <div>
              <label className="text-xs block mb-1">Price</label>
              <input
                type="text"
                placeholder="Price"
                value={component.price}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^\d*$/.test(inputValue)) {
                    handleComponentChange(
                      index,
                      "price",
                      parseFloat(inputValue)
                    );
                  }
                }}
                className="w-full p-2 border text-xs rounded"
              />
            </div>
            <div>
              <label className="text-xs block mb-1">Weight</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Weight"
                  value={component.weight}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^\d*\.?\d*$/.test(inputValue)) {
                      handleComponentChange(
                        index,
                        "weight",
                        parseFloat(inputValue)
                      );
                    }
                  }}
                  className="no-spinner w-full p-2 border text-xs rounded"
                />
              
                <button
                  type="button"
                  onClick={() => handleRemoveComponent(index)}
                  className="text-xs bg-gray-100 px-2 rounded"
                >
                  X
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddComponent}
          className="text-xs text-blue-500 mt-1"
        >
          + Add component
        </button>
      </div>
    </div>

    {/* Form Actions */}
    <div className="flex justify-end gap-2 pt-4 border-t">
      <button
        type="button"
        onClick={onClose}
        className="px-3 py-1 text-xs bg-gray-200 rounded"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-3 py-1 text-xs bg-green-500 text-white rounded"
      >
        {loading ? (
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Processing...
          </span>
        ) : product ? (
          "Save Changes"
        ) : (
          "Add Product"
        )}
      </button>
    </div>
  </div>
</form>
      </div>
    </div>
  );
}
