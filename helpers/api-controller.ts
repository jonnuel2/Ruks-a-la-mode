import axios from "axios";
import { ProductProps } from "./types";
import { signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';


//discounts
export async function getDiscount(code: string) {
  try {
    const discount = await axios.get(
      `/api/discounts/get-discount?code=${code}`
    );
    return discount.data;
  } catch (err) {
    return err;
  }
}

export async function getDiscounts() {
  try {
    const discounts = await axios.get(`/api/discounts/get-discounts`);
    return discounts.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function createDiscount(discount: any) {
  try {
    return await axios.post(`/api/discounts/add-discount`, discount);
  } catch (error) {
    return error;
  }
}

export async function updateDiscount(code: string, data: any) {
  try {
    const response = await axios.put(`/api/discounts/update-discount?code=${code}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating discount:', error);
    throw error;
  }
}

export async function deleteDiscount(code: any) {
  try {
    return await axios.delete(`/api/discounts/delete-discount?code=${code}`);
  } catch (error) {
    return error;
  }
}

//payments
export async function makePayment(data: any) {
  try {
    const transaction = await axios.post("/api/payments/make-payment", data);
    return transaction.data;
  } catch (error) {
    return error;
  }
}

export const getExchangeRates = async () => {
  try {
    const rates = await axios.get(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/ngn.json"
    );
    return rates.data;
  } catch (error) {
    return error;
  }
};

export async function verifyTransaction(txref: string) {
  try {
    const transaction = await axios.get(
      `/api/payments/verify-payment?txref=${txref}`
    );
    return transaction.data;
  } catch (error) {
    return error;
  }
}

//orders
export async function createOrder(order: any) {
  try {
    return await axios.post(`/api/orders/create-order`, order);
  } catch (error) {
    return error;
  }
}

export async function getAllOrders() {
  try {
    const orders = await axios.get(`/api/orders/get-all-orders`);
    return orders.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function updateOrder(data: any) {
  try {
    return await axios.put(`/api/orders/update-order`, data);
  } catch (error) {
    return error;
  }
}



export async function addTailor(data: any) {
  try {
    console.log("Sending tailor data:", data) // Add logging
    return await axios.put(`/api/orders/add-tailor`, data)
  } catch (error) {
    console.error("Error adding tailor:", error) // Add error logging
    return error
  }
}

//deliveries
export async function getDeliveries() {
  try {
    const deliveries = await axios.get(`/api/orders/get-deliveries`);
    return deliveries.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

//products
export async function updateProduct(data: any) {
  try {
    return await axios.put(`/api/products/update-product`, data);
  } catch (error) {
    return error;
  }
}

export async function updateProductsStock(items: any) {
  try {
    return await axios.put(`/api/products/update-products-stock`, items);
  } catch (error) {
    return error;
  }
}

export async function addNewProduct(product: ProductProps) {
  try {
    return await axios.post(`/api/products/add-new-product`, product);
  } catch (error) {
    return error;
  }
}

export async function getAllProducts() {
  try {
    const products = await axios.get(`/api/products/get-all-products`);
    return products.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getAllActiveProducts() {
  try {
    const products = await axios.get(`/api/products/get-all-active-products`);
    return products.data;
  } catch (err) {
    return err;
  }
}

export async function getProduct(id: string) {
  try {
    const product = await axios.get(`/api/products/get-product?id=${id}`);
    return product.data;
  } catch (err) {
    return err;
  }
}
export async function deleteProduct(id: any) {
  try {
    return await axios.delete(`/api/products/delete-product?id=${id}`);
  } catch (error) {
    return error;
  }
}

//admins
export async function getAdmins() {
  try {
    const admins = await axios.get(`/api/admins/get-admins`);
    return admins.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function updateLastSeen(admin: string) {
  try {
    return await axios.post(`/api/admins/update-login`, { admin });
  } catch (error) {
    return error;
  }
}

//content
export async function createBanner(data: any) {
  try {
    return await axios.post(`/api/banners/create-banner`, data);
  } catch (error) {
    return error;
  }
}

export async function updateBanner(data: any) {
  try {
    return await axios.post(`/api/banners/update-banner`, data);
  } catch (error) {
    return error;
  }
}

export async function getBanners() {
  try {
    const banners = await axios.get(`/api/banners/get-banners`);
    return banners.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getPretext() {
  try {
    const pretext = await axios.get(`/api/content/get-pretext`);
    return pretext.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function updatePretext(text: string) {
  try {
    return await axios.post(`/api/content/update-pretext`, { text });
  } catch (error) {
    return error;
  }
}

//analytics
export async function getTopSellers() {
  try {
    const topSellers = await axios.get(`/api/analytics/get-top-sellers`);
    return topSellers.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

//users
// export async function getAllUsers() {
//   try {
//     const response = await axios.get(`/api/users/get-users`);
//     return response.data;
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     return { users: [] }; // safer default fallback
//   }
// }
export async function getAllUsers(): Promise<{
  success: boolean;
  message: string;
  users: any[];
}> {
  try {
    const response = await axios.get(`/api/users/get-all-users`);
    return response.data;
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch users",
      users: []
    };
  }
}

//login 
export async function login(email: string, password: string) {
  try {
    const response = await axios.post(`/api/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    return error;
  }
}


export const logout = () => {
  const router = useRouter();
  localStorage.removeItem('loggedInUser'); // Remove user session
  localStorage.setItem('forceLogin', 'true'); // Mark that user logged out intentionally
  router.push('/login'); // Redirect to login page
};


//signup
export async function signup(
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string,
  confirmPassword: string
) {
  try {
    const response = await axios.post(`/api/auth/signup`, {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    return error;
  }
}


