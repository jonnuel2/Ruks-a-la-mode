"use client";

import Incrementer from "@/app/ui/incrementer";
import SimilarProducts from "@/app/ui/similar-products";
import SizeGuide from "@/app/ui/size-guide";
import { useAppContext } from "@/helpers/store";
// import { bungee, inter } from "@/styles/fonts";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import PartSelector from "../_ui/part-selector";
import MaterialSelector from "../_ui/material-selector";
import Button from "@/app/ui/button";
import { formatPrice } from "@/helpers/functions";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/helpers/api-controller";
import { Blocks } from "react-loader-spinner";

type Params = Promise<{ slug: string }>;

export default function Page(props: { params: Params }) {
  const [openCustom, setOpenCustom] = useState(false);
  const params = use(props.params);
  const { slug } = params;
  const router = useRouter();
  const context = useAppContext();
  const { cart, setcart, all_products, currency, exchangeRates } = context;

  const {
    data: productData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["product"],
    queryFn: () => getProduct(slug),
  });

  const product = productData?.product;

  const sizes = ["Select Size", 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];

  const lengths = [
    "Select Length",
    "Petite",
    "Petite+",
    "Average",
    "Average+",
    "Tall",
    "Very Tall",
  ];

  const [measurement, setMeasurement] = useState({
    size: "",
    length: "",
    custom: {
      bust: "",
      waist: "",
      hips: "",
      "dress/pants length": "",
      height: "",
    },
  });

  const more = [
    {
      text: "Size Guide",
      url: "https://drive.google.com/file/d/1rz9N8QZTzkUZTjbRqL6xYoi5X2wOh6_z/view?usp=sharing",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
          />
        </svg>
      ),
    },
    {
      text: "Length Guide",
      url: "https://drive.google.com/file/d/1rtkcLWXlncIHvlp5SpMZSQzelrN56H4h/view?usp=drivesdk",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664"
          />
        </svg>
      ),
    },
    {
      text: "Share Your Experience With Us",
      url: "https://ig.me/m/ruksalamode",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
          />
        </svg>
      ),
    },
  ];

  const [selectedPart, setSelectedPart] = useState({
    id: "",
    name: "",
    price: 0,
    stock: 0,
    material: {
      name: "",
      price: 0,
      stock: 0,
    },
  });

  const [selectedMaterial, setSelectedMaterial] = useState({
    name: "",
    price: 0,
    stock: 0,
  });

  const [selectedColor, setSelectedColor] = useState({
    // name: product?.data?.colors[0]?.name,
    // hexColor: product?.data?.colors[0]?.hexColor,
    // stock: product?.data?.colors[0]?.stock,
    name: "",
    hexColor: "",
    stock: 0,
  });

  // Reset selectedColor when the product changes (slug changes)
  // useEffect(() => {
  //   if (product?.data?.colors?.length > 0) {
  //     setSelectedColor({
  //       name: product?.data?.colors[0]?.name,
  //       hexColor: product?.data?.colors[0]?.hexColor,
  //       stock: product?.data?.colors[0]?.stock,
  //     });
  //   } else {
  //     // Handle cases where the product has no colors (optional)
  //     setSelectedColor({
  //       name: "",
  //       hexColor: "",
  //       stock: 0,
  //     });
  //   }
  // }, [slug, product?.data?.colors]); // Reset when slug or product colors change

  const [orderDetails, setOrderDetails] = useState({
    quantity: 1,
  });
  const itemIndex = cart?.items?.findIndex(
    (c: any) => c.item.name === product?.data?.name
  );
  console.log(itemIndex);

  const isProductInCart =
    itemIndex !== -1 ? (itemIndex === undefined ? false : true) : false;

  const viewProduct = (id: string) => {
    router.push(`/shop/${id}`);
  };

  // Handle decreasing product quantity
  const handleLeftClick = () => {
    if (!isProductInCart) return;

    const newCart = { ...cart };
    const productInCart = newCart?.items[itemIndex];

    if (productInCart.quantity > 1) {
      productInCart.quantity -= 1;
    } else {
      // Remove product from the cart when quantity is 0
      newCart?.items?.splice(itemIndex, 1);
    }

    setcart(newCart);
  };

  // Handle increasing product quantity
  const handleRightClick = () => {
    if (!isProductInCart) return;

    const newCart = { ...cart };

    if (newCart?.items[itemIndex].quantity < selectedColor?.stock)
      newCart.items[itemIndex].quantity += 1;

    setcart(newCart);
  };

  // Function to get the correct price based on selection
  const getPrice = () => {
    if (selectedPart?.name) {
      // If a part is selected, check if it has materialOptions
      if (selectedMaterial?.name) {
        return selectedMaterial.price;
      }
      return selectedPart.price;
    }

    // If no part is selected, check if the product has materialOptions
    if (selectedMaterial?.name) {
      return selectedMaterial.price;
    }

    // Fallback to product base price
    return product?.data?.price ?? 0;
  };

  // const addToBag = () => {
  //   if (product) {
  //     console.log("adding");
  //     const { size, custom, length } = measurement;

  //     if (
  //       !size &&
  //       !length &&
  //       !Object?.entries(custom)?.some(([_, value]) => value !== "")
  //     ) {
  //       // return alert("Incomplete Measurement Parameters");
  //       toast.error("Incomplete Measurement Parameters", {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //       });
  //       return;
  //     }

  //     let filteredMeasurement;

  //     if (
  //       Object.entries(measurement?.custom).some(([_, value]) => value !== "")
  //     ) {
  //       filteredMeasurement = Object.fromEntries(
  //         Object.entries(measurement?.custom).filter(
  //           ([_, value]) => value !== ""
  //         )
  //       );
  //     } else {
  //       filteredMeasurement = Object.fromEntries(
  //         Object.entries(measurement).filter(
  //           ([_, value]) => typeof value !== "object"
  //         )
  //       );
  //     }

  //     let color = { ...product?.data?.colors[0] };

  //     // if (product?.data?.colors?.length > 1) {
  //     //   if (selectedColor?.name === "") return alert("Please choose a color");
  //     //   if (selectedColor?.name === "") {
  //     //     toast.warning("Please choose a color", {
  //     //       position: "top-right",
  //     //       autoClose: 3000,
  //     //       hideProgressBar: false,
  //     //       closeOnClick: true,
  //     //       pauseOnHover: true,
  //     //       draggable: true,
  //     //     });

  //     //   color = { ...selectedColor };
  //     // }
  //     if (product?.data?.colors?.length > 1 && !selectedColor?.name) {
  //       toast.warning("Please choose a color", {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //       });
  //       return;
  //     }

  //     const itemData: any = {
  //       item: {
  //         name: product?.data?.name,
  //         price: getPrice(),
  //         id: product?.id,
  //         image: product?.data?.images[0],
  //         stock:
  //           product?.data?.colors?.find((c: any) => c?.name === color?.name)
  //             ?.stock ?? 10,
  //         measurement: filteredMeasurement,
  //         color,
  //         weight: product?.data?.weight,
  //       },
  //       quantity: orderDetails?.quantity,
  //     };
  //     if (selectedPart?.name) {
  //       itemData.item["selectedPart"] = selectedPart;
  //       itemData.item["name"] += ` (${selectedPart?.name})`;
  //     }
  //     if (selectedMaterial?.name) {
  //       itemData.item["selectedMaterial"] = selectedMaterial;
  //       itemData.item["name"] += ` (${selectedMaterial?.name})`;
  //     }
  //     if (product?.data?.colors?.length > 1) {
  //       itemData.item["name"] += ` (${selectedColor?.name})`;
  //     }
  //     setcart({ ...cart, items: [...cart?.items, itemData] });

  //     localStorage.setItem(
  //       "cart",
  //       JSON.stringify({ ...cart, items: [...cart?.items, itemData] })
  //     );

  //     // alert("Cart Updated");
  //     toast.success("Cart Updated Successfully!", {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //     });
  //   }
  // };

  const addToBag = () => {
    if (product) {
      console.log("adding");
      const { size, custom, length } = measurement;
  
      // Validate measurements
      if (
        !size &&
        !length &&
        !Object?.entries(custom)?.some(([_, value]) => value !== "")
      ) {
        toast.error("Incomplete Measurement Parameters", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
  
      // Validate color selection for multi-color products
      if (product?.data?.colors?.length > 1 && !selectedColor?.name) {
        toast.warning("Please choose a color", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
  
      // Prepare measurements
      let filteredMeasurement;
      if (Object.entries(measurement?.custom).some(([_, value]) => value !== "")) {
        filteredMeasurement = Object.fromEntries(
          Object.entries(measurement?.custom).filter(
            ([_, value]) => value !== ""
          )
        );
      } else {
        filteredMeasurement = Object.fromEntries(
          Object.entries(measurement).filter(
            ([_, value]) => typeof value !== "object"
          )
        );
      }
  
      // Use the SELECTED color, not the first one
      const color = product?.data?.colors?.length > 1 
        ? selectedColor 
        : product?.data?.colors[0]; // Fallback to first color if product has only one color
  
      // Prepare cart item
      const itemData: any = {
        item: {
          name: product?.data?.name,
          price: getPrice(),
          id: product?.id,
          image: product?.data?.images[0],
          stock: color?.stock ?? 10,
          measurement: filteredMeasurement,
          color: { // Store the complete color object
            name: color?.name,
            hexCode: color?.hexCode,
            stock: color?.stock
          },
          weight: product?.data?.weight,
        },
        quantity: orderDetails?.quantity,
      };
  
      // Add part info if selected
      if (selectedPart?.name) {
        itemData.item["selectedPart"] = selectedPart;
        itemData.item["name"] += ` (${selectedPart?.name})`;
      }
  
      // Add material info if selected
      if (selectedMaterial?.name) {
        itemData.item["selectedMaterial"] = selectedMaterial;
        itemData.item["name"] += ` (${selectedMaterial?.name})`;
      }
  
      // Add color to name if multiple colors exist
      if (product?.data?.colors?.length > 1) {
        itemData.item["name"] += ` (${color?.name})`;
      }
  
      // Update cart
      const updatedCart = { 
        ...cart, 
        items: [...cart?.items, itemData] 
      };
      
      setcart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
  
      toast.success("Cart Updated Successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Blocks />
      </div>
    );
  }
  console.log("checkiii", product?.data);

  console.log("art?.items?.length >>>>", product?.data?.colors?.length);
  console.log("product?.data?.colors >>>>", product?.data);

  return (
    <div className={`flex flex-col w-full lg:px-24 px-4  text-black/80 `}>
      <ToastContainer />
      <div className="flex lg:flex-row  flex-col lg:items-start lg:justify-center items-center lg:space-x-4 w-full lg:mt-10">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          // navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="h-full lg:w-[570px] w-full flex items-center justify-center"
        >
          {product?.data?.images?.map((image: any, i: number) => (
            <SwiperSlide key={i}>
              <div className="lg:h-[715px] lg:w-[570px] w-full h-[440px] relative lg:mt-0 mt-8">
                {image ? (
                  <Image
                    priority
                    alt="merch"
                    src={image}
                    fill
                    style={{ objectFit: "cover" }} // or "contain"
                  />
                ) : (
                  <></>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex flex-col items-start lg:w-2/5 w-full lg:mt-0 mt-10">
          {/* name */}
          <p className="lg:text-4xl text-2xl font-medium tracking-wider lg:text-left text-center">
            {product?.data?.name}
          </p>
          {/* price */}
          <p className={`mt-4 lg:text-lg font-medium tracking-wide`}>
            {formatPrice(
              currency,
              getPrice() *
                exchangeRates[currency.toLowerCase()] *
                orderDetails.quantity
            )}
          </p>
          {/* Description */}
          <p className="mt-6 tracking-wider lg:text-base font-medium text-sm">
            {product?.data?.description
              .split("- ")
              .map((item: any) => item.trim()) // Remove extra spaces
              .filter((item: any) => item)
              .map((item: any, index: number) => (
                <li key={index}>{item}</li>
              ))}
          </p>
          {/* COLORS */}
          <p className="mt-4 mb-2">Color: {selectedColor?.name}</p>
          <div className="flex w-full items-center justify-start">
            <div className="grid grid-cols-10 gap-1.5">
              {product?.data?.colors.map((color: any, i: number) => (
                <div
                  className={`${
                    color?.name === selectedColor?.name
                      ? "border border-blue-950"
                      : ""
                  } flex items-start justify-center w-6 h-6 rounded-full cursor-pointer p-0.5`}
                  key={i}
                >
                  <span
                    key={i}
                    className={` inline-block w-full h-full rounded-full`}
                    style={{ backgroundColor: color.hexCode }}
                    title={color.name}
                    onClick={() => setSelectedColor(color)}
                  ></span>
                </div>
              ))}
            </div>
          </div>
          {product?.data?.components?.length > 0 && (
            <PartSelector
              components={product?.data?.components}
              onSelectPart={(selected: any) => setSelectedPart(selected)}
              selectedPart={selectedPart?.name}
            />
          )}
          {product?.data?.materialOptions?.length > 0 && (
            <MaterialSelector
              materials={product?.data?.materialOptions}
              onSelectPart={(selected) => setSelectedMaterial(selected)}
              selectedPart={selectedMaterial?.name}
            />
          )}
          <div className="mt-6 w-full flex flex-col lg:items-start items-center justify-start">
            <div className="w-full flex flex-col lg:items-start items-center">
              {/* size */}
              <div className="mb-4 text-sm w-full flex flex-col items-start">
                <p className="mb-2 ">Size</p>

                <select
                  className="border text-sm border-dark outline-none bg-transparent p-2 lg:w-3/4 w-full"
                  onChange={(e) =>
                    setMeasurement({ ...measurement, size: e.target.value })
                  }
                >
                  {sizes?.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              {/* length */}
              <div className="text-sm w-full flex flex-col items-start">
                <p className="mb-2 ">Length</p>

                <select
                  className="border text-sm border-dark outline-none bg-transparent p-2 lg:w-3/4 w-full"
                  onChange={(e) =>
                    setMeasurement({ ...measurement, length: e.target.value })
                  }
                >
                  {lengths?.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* custome size */}
            <div className="mt-6 w-full flex flex-col items-start">
              {openCustom ? (
                <CustomMeasurement
                  measurement={measurement}
                  setMeasurement={setMeasurement}
                  setOpenCustom={setOpenCustom}
                />
              ) : (
                <Button
                  label="Custom Size"
                  onClick={() => setOpenCustom(true)}
                />
              )}
            </div>
            {/* <input
              className="border border-dark bg-transparent text-sm p-2 mt-4 outline-none"
              placeholder="Measurement (inches)"
              value={measurement?.custom}
              onChange={(e) =>
                setMeasurement({ ...measurement, custom: e.target.value })
              }
            /> */}
          </div>
          {/* <SizeGuide
            measurement={measurement}
            setMeasurement={setMeasurement}
          /> */}

          {/* add to cart */}
          <div className="flex flex-row gap-4 lg:gap-2 items-center lg:items-start lg:mt-10 mt-6 lg:space-x-3 w-full">
            {isProductInCart ? (
              <></>
            ) : (
              <div className="flex flex-col items-start">
                <div className="w-40 py-2 px-3 border-dark border ">
                  <Incrementer
                    leftClick={() =>
                      setOrderDetails({
                        ...orderDetails,
                        quantity:
                          orderDetails.quantity > 1
                            ? orderDetails.quantity - 1
                            : orderDetails.quantity,
                      })
                    }
                    rightClick={() =>
                      setOrderDetails({
                        ...orderDetails,
                        quantity:
                          selectedColor?.stock &&
                          orderDetails.quantity < selectedColor?.stock
                            ? orderDetails.quantity + 1
                            : orderDetails.quantity,
                      })
                    }
                    value={orderDetails?.quantity}
                  />
                </div>
              </div>
            )}

            {/* add to cart */}
            {/* {isProductInCart ? (
              <Incrementer
                leftClick={handleLeftClick}
                rightClick={handleRightClick}
                value={cart?.items ? cart?.items[itemIndex].quantity : 1}
              />
            ) : (
              <div
                className="flex items-center justify-center w-full lg:w-1/2 border bg-dark p-2 cursor-pointer"
                onClick={addToBag}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#f5f5f5"
                  className="size-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                <p className="text-xs text-lightgrey">Add To Bag</p>
              </div>
            )} */}
            {isProductInCart ? (
              <Incrementer
                leftClick={handleLeftClick}
                rightClick={handleRightClick}
                value={cart?.items ? cart?.items[itemIndex].quantity : 0}
              />
            ) : (
              <div className="relative group">
                {" "}
                {/* Tooltip container */}
                <div
                  className={`flex items-center justify-center w-full border py-2 h-[40px] px-4 text-nowrap ${
                    !selectedColor?.name || selectedColor?.stock <= 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-dark hover:bg-gray-800 cursor-pointer"
                  }`}
                  onClick={
                    !selectedColor?.name || selectedColor?.stock <= 0
                      ? undefined
                      : addToBag
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#f5f5f5"
                    className="size-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                  <p className="text-xs text-lightgrey">
                    {!selectedColor?.name
                      ? "Add to Bag"
                      : selectedColor?.stock <= 0
                      ? "Out of Stock"
                      : "Add To Bag"}
                  </p>
                </div>
                {/* Tooltip (shown only when button is disabled due to no color selection) */}
                {!selectedColor?.name && (
                  <div className="absolute z-10 hidden group-hover:block bg-black text-white text-xs p-2 rounded mt-1 whitespace-nowrap">
                    Please select a color
                  </div>
                )}
              </div>
            )}
          </div>

          {/* other items */}
          <div className="flex items-start lg:items-center lg:flex-row flex-col lg:space-y-0 space-y-3 lg:space-x-6 mt-6 lg:mt-8">
            {more?.map((m) => (
              <Link key={m.text} href={m.url}>
                <div className="flex items-center space-x-2">
                  {m.icon}
                  <p className="capitalize md:text-xs text-[10px]">{m.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <SimilarProducts
        items={all_products
          ?.filter((p: any) => p?.data?.category === product?.data?.category)
          .filter((p: any) => p.id !== product?.id)
          .slice(0, 4)}
        viewProduct={viewProduct}
      />
    </div>
  );
}

const CustomMeasurement = ({
  measurement,
  setMeasurement,
  setOpenCustom,
}: {
  measurement: any;
  setMeasurement: any;
  setOpenCustom: any;
}) => (
  <div className="flex flex-col lg:items-start items-center w-full">
    <div className="flex items-start w-full">
      <button
        onClick={() => setOpenCustom(false)}
        className="mb-3 py-2 px-4 border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium "
      >
        X
      </button>
    </div>

    {Object.keys(measurement?.custom)?.map((m) => (
      <div
        key={m}
        className="flex flex-col lg:flex-row items-start lg:items-center gap-2 justify-between mb-4 lg:w-[60%] w-full"
      >
        <p className="capitalize lg:text-sm text-xs">{m}</p>
        <div className="flex items-center justify-start">
          <input
            className="bg-transparent lg:text-sm text-xs h-[24px] border-dark border mr-3 px-3 outline-none"
            value={measurement[m]}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Allow decimals (e.g., 0.4, 12.75)
              if (/^\d*\.?\d*$/.test(inputValue)) {
                setMeasurement({
                  ...measurement,
                  custom: { ...measurement?.custom, [m]: inputValue },
                });
              }
            }}
          />
          <p className="text-xs">in</p>
        </div>
      </div>
    ))}
  </div>
);
