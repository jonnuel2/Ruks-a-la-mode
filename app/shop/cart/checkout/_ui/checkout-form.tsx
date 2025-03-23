"use client";

import { useState } from "react";
import CountryDropdown from "./country-dropdown";
import AbjCityDropdown from "./abj-city-dropdown";
import Link from "next/link";

const CheckoutForm = ({
  checkoutCart,
  shippingFee,
  setShippingFee,
  deliveryType,
  setDeliveryType,
}: {
  checkoutCart: (value: any) => void;
  shippingFee: number | undefined;
  setShippingFee: (value: undefined) => void;
  deliveryType: string;
  setDeliveryType: (value: string) => void;
}) => {
  const [shippingInfo, setShippingInfo] = useState({
    firstname: "",
    surname: "",
    email: "",
    address: "",
    state: "",
    city: "",
    country: "",
    zipCode: "",
    phonenumber: "",
  });

  const types = ["standard", "express", "freight"];

  return (
    <>
      <form className="mt-8 space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="firstName"
                className="block text-xs lg:text-sm font-medium text-coffee"
              >
                First Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={shippingInfo.firstname}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    firstname: e.target.value,
                  })
                }
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none bg-transparent text-sm"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="surname"
                className="block text-xs lg:text-sm font-medium text-coffee"
              >
                Surname
              </label>
              <input
                id="surname"
                name="surname"
                type="surname"
                required
                value={shippingInfo.surname}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, surname: e.target.value })
                }
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none bg-transparent text-sm"
              />
            </div>
          </div>
          <div className="flex flex-row space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="phonenumber"
                className="block text-xs lg:text-sm font-medium text-coffee"
              >
                Phone Number
              </label>
              <input
                id="phonenumber"
                name="phonenumber"
                type="text"
                required
                value={shippingInfo.phonenumber}
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    phonenumber: e.target.value,
                  })
                }
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none bg-transparent text-sm"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="email"
                className="block text-xs lg:text-sm font-medium text-coffee"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={shippingInfo.email}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, email: e.target.value })
                }
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none bg-transparent text-sm"
              />
            </div>
          </div>

          <CountryDropdown
            country={shippingInfo?.country}
            setCountry={(c) => {
              setShippingInfo({ ...shippingInfo, country: c });
              setShippingFee(undefined);
            }}
          />

          <div className="flex flex-row space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="address"
                className="block text-xs lg:text-sm font-medium text-coffee"
              >
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={shippingInfo.address}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, address: e.target.value })
                }
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none bg-transparent text-sm"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="zipCode"
                className="block text-xs lg:text-sm font-medium text-coffee"
              >
                Zipcode
              </label>
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                required
                value={shippingInfo.zipCode}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, zipCode: e.target.value })
                }
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none bg-transparent text-sm"
              />
            </div>
          </div>

          <div className="flex flex-row space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="state"
                className="block text-xs lg:text-sm font-medium text-coffee"
              >
                State
              </label>
              <input
                id="state"
                name="state"
                type="text"
                required
                value={shippingInfo.state}
                onChange={(e) => {
                  setShippingInfo({ ...shippingInfo, state: e.target.value });
                  setShippingFee(undefined);
                }}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none bg-transparent text-sm"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="city"
                className="block text-xs lg:text-sm font-medium text-coffee"
              >
                City
              </label>
              {shippingInfo.state?.trim().toLowerCase() === "abuja" ? (
                <AbjCityDropdown
                  abjCity={shippingInfo.city}
                  setabjCity={(a) =>
                    setShippingInfo({ ...shippingInfo, city: a })
                  }
                />
              ) : (
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={shippingInfo.city}
                  onChange={(e) => {
                    setShippingInfo({ ...shippingInfo, city: e.target.value });
                    setShippingFee(undefined);
                  }}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none bg-transparent text-sm"
                />
              )}
            </div>
          </div>
          <div className="flex gap-4">
            {shippingInfo.state?.trim().toLowerCase() !== "abuja" ? (
              shippingInfo?.country?.toLowerCase() === "nigeria" ? (
                types.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={option}
                      checked={deliveryType === option}
                      onChange={() => setDeliveryType(option)}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 border-gray-500 flex items-center justify-center ${
                        deliveryType === option ? "border-blue-500" : ""
                      }`}
                    >
                      {deliveryType === option && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <span className="capitalize">{option}</span>
                  </label>
                ))
              ) : (
                <div className="flex gap-4">
                  <label
                    key={"standard"}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={"standard"}
                      checked={deliveryType === "standard"}
                      onChange={() => setDeliveryType("standard")}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 border-gray-500 flex items-center justify-center ${
                        deliveryType === "standard" ? "border-blue-500" : ""
                      }`}
                    >
                      {deliveryType === "standard" && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <span className="capitalize">{"standard"}</span>
                  </label>
                  <label
                    key={"express"}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={"express"}
                      checked={deliveryType === "express"}
                      onChange={() => setDeliveryType("express")}
                      className="hidden"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 border-gray-500 flex items-center justify-center ${
                        deliveryType === "express" ? "border-blue-500" : ""
                      }`}
                    >
                      {deliveryType === "express" && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <span className="capitalize">{"express"}</span>
                  </label>
                </div>
              )
            ) : (
              <label
                key={"standard"}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="shipping"
                  value={"standard"}
                  checked={deliveryType === "standard"}
                  onChange={() => setDeliveryType("standard")}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 border-gray-500 flex items-center justify-center ${
                    deliveryType === "standard" ? "border-blue-500" : ""
                  }`}
                >
                  {deliveryType === "standard" && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <span className="capitalize">{"standard"}</span>
              </label>
            )}
          </div>
        </div>
        {shippingFee !== undefined ? (
          <div>
            <p>Shipping Fee: {shippingFee}</p>
            <Link
              className="mt-4"
              href="https://docs.google.com/document/d/1PmALWFEbB8emQyMLKd2EFfUbeFz0ngPDzGPXuncMJiY/edit?usp=drivesdk"
            >
              <p className="mt-4 text-blue-600">
                By Clicking Checkout, You Agree To Our Terms and Policy
              </p>
            </Link>
          </div>
        ) : (
          <></>
        )}
        <div
          onClick={() => {
            if (
              shippingInfo.email === "" ||
              shippingInfo.address === "" ||
              shippingInfo.city === "" ||
              shippingInfo.firstname === "" ||
              shippingInfo.surname === "" ||
              shippingInfo.state === "" ||
              shippingInfo.phonenumber === ""
            ) {
              return alert(
                "We need some information to process your delivery."
              );
            }
            checkoutCart(shippingInfo);
          }}
          className={`lg:w-[49%] w-full p-3 bg-black/85 flex items-center font-medium justify-center hover:opacity-70 ${"cursor-pointer"}`}
        >
          <p className="text-[#f5f5f5] lg:text-sm text-xs uppercase">
            {shippingFee === undefined ? "Get Shipping Fee" : "Check out"}
          </p>
        </div>
      </form>
    </>
  );
};

export default CheckoutForm;
