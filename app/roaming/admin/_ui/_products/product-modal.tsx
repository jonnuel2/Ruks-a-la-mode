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
        { name: "", price: "", stock: "", id: "", weight: "" },
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg lg:w-1/2 h-5/6 overflow-y-scroll">
        <h2 className="text-lg lg:text-sm font-bold mb-4">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 overflow-y-scroll">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 border rounded text-xs"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-2 border rounded text-xs"
              required
            />
            <input
              type="text"
              value={formData.price}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue)) {
                  setFormData({ ...formData, price: inputValue });
                }
              }}
              placeholder="Price"
              className="w-full p-2 border text-xs rounded"
              required
            />
            <input
              type="text"
              placeholder="Weight"
              value={formData.weight}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Allow decimals (e.g., 0.4, 12.75)
                if (/^\d*\.?\d*$/.test(inputValue)) {
                  setFormData({ ...formData, weight: inputValue });
                }
              }}
              className="w-full p-2 text-xs border rounded"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full p-2 text-xs border rounded"
              required
            />
            {/* <input
              type="text"
              value={formData.quantity}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue)) {
                  setFormData({ ...formData, quantity: inputValue });
                }
              }}
              placeholder="Quantity"
              className="w-full p-2 text-xs border rounded"
              required
            /> */}

            {/* Images Input */}
            <div>
              <p className="font-medium">Images</p>
              {formData?.images?.map((image: any, index: number) => (
                <div key={index} className="flex gap-2 mt-2">
                  {formData?.id ? (
                    <input
                      type="text"
                      placeholder="Image Url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="p-2 border text-xs rounded w-full"
                    />
                  ) : (
                    <input
                      type="file"
                      placeholder="Choose Image(s)"
                      onChange={(e) =>
                        e.target.files
                          ? handleImageChange(index, e.target.files[0])
                          : null
                      }
                      className="p-2 border text-xs rounded w-full"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-xs"
                  >
                    ❌
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddImage}
                className="mt-2 text-blue-500 text-xs"
              >
                + Add Image
              </button>
            </div>

            {/* Colors */}
            <div>
              <p className="font-medium text-xs">Colors</p>
              {formData.colors.map((color: any, index: number) => (
                <div key={index} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Color"
                    value={color.name}
                    onChange={(e) =>
                      handleColorChange(index, "name", e.target.value)
                    }
                    className="p-2 border text-xs rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="HexCode"
                    value={color.hexCode}
                    onChange={(e) =>
                      handleColorChange(index, "hexCode", e.target.value)
                    }
                    className="p-2 border text-xs rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Stock"
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
                    className="p-2 border text-xs rounded w-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(index)}
                    className="text-xs"
                  >
                    ❌
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddColor}
                className="mt-2 text-blue-500 text-xs"
              >
                + Add Color
              </button>
            </div>

            {/* Material Options */}
            {/* <div>
              <p className="font-medium">Material Options</p>
              {formData?.materialOptions?.map(
                (material: any, index: number) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Material Name"
                      value={material.name}
                      onChange={(e) =>
                        handleMaterialChange(index, "name", e.target.value)
                      }
                      className="p-2 border text-xs rounded w-full"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={material.price}
                      onChange={(e) =>
                        handleMaterialChange(
                          index,
                          "price",
                          parseFloat(e.target.value)
                        )
                      }
                      className="p-2 border text-xs rounded w-full"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={material.stock}
                      onChange={(e) =>
                        handleMaterialChange(
                          index,
                          "stock",
                          parseInt(e.target.value)
                        )
                      }
                      className="p-2 border text-xs rounded w-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(index)}
                      className="text-xs"
                    >
                      ❌
                    </button>
                  </div>
                )
              )}
              <button
                type="button"
                onClick={handleAddMaterial}
                className="mt-2 text-blue-500 text-xs"
              >
                + Add Material
              </button>
            </div> */}

            {/* Components */}
            <div>
              <p className="font-medium">Components</p>
              {formData?.components?.map((component: any, index: number) => (
                <div key={index} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Component Name"
                    value={component.name}
                    onChange={(e) =>
                      handleComponentChange(index, "name", e.target.value)
                    }
                    className="p-2 border text-xs rounded w-full"
                  />
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
                    className="p-2 border text-xs rounded w-full"
                  />
                  <input
                    type="text"
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
                    className="p-2 border text-xs rounded w-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveComponent(index)}
                    className="text-xs"
                  >
                    ❌
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddComponent}
                className="mt-2 text-blue-500 text-xs"
              >
                + Add component
              </button>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded text-xs"
            >
              {loading ? (
                <TailSpin width={20} height={20} />
              ) : product ? (
                "Save Changes"
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
