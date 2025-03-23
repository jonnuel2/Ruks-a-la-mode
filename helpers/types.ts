export interface SharedState {
  cart: { items: any[]; discount: string };
  setcart: (value: any) => void;
  all_products: any[];
  set_all_products: (value: any[]) => void;
  selectedProduct: any;
  setSelectedProduct: (value: ProductProps) => void;
  currency: string;
  setCurrency: (value: string) => void;
  currencies: string[];
  user: any;
  setuser: (value: any) => void;
  exchangeRates: { [key: string]: number };
  setExchangeRates: (value: { [key: string]: number }) => void;
}
export interface CartItemProps {
  item: ProductProps;
  quantity: number;
}

export interface IncrementerProps {
  leftClick: () => void;
  rightClick: () => void;
  value: number;
}

// export interface ProductProps {
//   id: string;
//   image: string;
//   category?: string;
//   collection?: string;
//   name: string;
//   price: number;
//   sizes?: string[];
//   quantity?: number;
//   size?: string;
//   weight?: number;
//   description?: string;
// }

export type Payment = {
  id: string;
  customerName: string;
  orderId: string;
  amount: number;
  method: string; // e.g., "Credit Card", "PayPal", "Bank Transfer"
  status: string; // e.g., "Successful", "Pending", "Failed"
  date: string;
};

export type PaymentDetailsProps = {
  payment: Payment;
  onClose: () => void;
};

export type Delivery = {
  id: string;
  customerName: string;
  address: string;
  status: string;
  expectedDate: string;
  assignedTo: string | null;
};

export interface QuestionProps {
  question: string;
  answer: string;
}

export interface HeroTextProps {
  title: string;
  subtitle: string;
}

export interface CategoryGridProps {
  // items: { id: string; data: ProductProps }[];
  items: ProductProps[];
  viewProduct: (id: string) => void;
}

export interface Material {
  name: string; // e.g., "Cotton", "Silk"
  price: number; // Price for this material variation
  stock: number; // Stock level for this material
  weight?: number;
}

export interface ProductComponent {
  id: string;
  name: string; // e.g., "Shirt" or "Pants"
  price: number; // Price for this component if sold individually
  stock: number;
  materialOptions?: Material[];
  weight?: number;
}

export interface ProductProps {
  images: string[];
  id: string;
  name: string; // e.g., "Two-Piece Set"
  description: string;
  price: number; // Price for the full product if sold as a set
  components?: ProductComponent[]; // For products like Two-Piece
  materialOptions?: Material[];
  colors: ColorProps[];
  category: string;
  collection?: string;
  quantity: number;
  weight?: number;
}

export interface ColorProps {
  name: string;
  hexCode: string;
}
