"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getAllProducts } from "@/helpers/api-controller";

interface ProductColor {
  name: string;
  hexCode: string;
  stock: number | null;
}

interface ProductComponent {
  name: string;
  price: string | number;
  stock: string | number;
  id: string;
  weight: number | null;
}

interface ProductData {
  name: string;
  description: string;
  price: number;
  images: string[];
  quantity: number;
  category: string;
  components: ProductComponent[];
  weight: number;
  sold: number;
  colors: ProductColor[];
  createdAt: string;
  updatedAt?: string;
}

interface Product {
  id: string;
  data: ProductData;
}

const formatPrice = (price: number) =>
  price.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  });

const getStatus = (current: number | null, original: number) => {
  if (current === null || current === 0) return "Out of Stock";
  if (current < 10 || (original > 0 && current <= original * 0.1)) return "Low Stock";
  return "In Stock";
};

const Inventory = () => {
  const [search, setSearch] = useState("");
  const [inventory, setInventory] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});

  // Calculate total stock for each product including all color variants
  const enhancedInventory = useMemo(() => {
    return inventory.map(product => {
      // Calculate total stock from color variants
      const colorStockTotal = product.data.colors.reduce((sum, color) => {
        return sum + (color.stock || 0);
      }, 0);

      // Calculate total stock from components
      const componentStockTotal = product.data.components.reduce((sum, comp) => {
        const stock = typeof comp.stock === 'string' ? parseInt(comp.stock) || 0 : comp.stock || 0;
        return sum + stock;
      }, 0);

      // Total stock is the sum of color variants and components
      const totalStock = colorStockTotal + componentStockTotal;

      return {
        ...product,
        totalStock,
        originalQuantity: product.data.quantity, // Store original quantity for depletion calculation
      };
    });
  }, [inventory]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await getAllProducts();
        
        if (response?.products && Array.isArray(response.products)) {
          setInventory(response.products);
          interface InitialExpandedState {
            [productId: string]: boolean;
          }

          const initialExpandedState: InitialExpandedState = response.products.reduce(
            (acc: InitialExpandedState, product: Product) => {
              acc[product.id] = false;
              return acc;
            },
            {} as InitialExpandedState
          );
          setExpandedProducts(initialExpandedState);
        } else {
          console.error("Unexpected API response structure:", response);
          setError("Unexpected data format received from server");
          setInventory([]);
        }
      } catch (err: any) {
        console.error("Error fetching inventory:", err);
        setError(err.message || "Failed to fetch inventory");
        setInventory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const toggleProductExpansion = (productId: string) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const filtered = enhancedInventory.filter((product) =>
    product.data.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 bg-red-50 rounded-lg">
        <p className="font-medium">Error loading inventory:</p>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Base Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sold
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length > 0 ? (
              filtered.map((product) => {
                const stockStatus = getStatus(product.totalStock, product.originalQuantity);
                return (
                  <>
                    {/* Main Product Row */}
                    <tr 
                      key={product.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleProductExpansion(product.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md overflow-hidden">
                            {product.data.images[0] && (
                              <img 
                                className="h-full w-full object-cover" 
                                src={product.data.images[0]} 
                                alt={product.data.name} 
                              />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.data.name}</div>
                            <div className="text-sm text-gray-500">{product.data.description.split('\n')[0]}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.data.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPrice(product.data.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.totalStock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.data.sold || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            stockStatus === "In Stock"
                              ? "bg-green-100 text-green-800"
                              : stockStatus === "Low Stock"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {stockStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleProductExpansion(product.id);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {expandedProducts[product.id] ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Details */}
                    {expandedProducts[product.id] && (
                      <>
                        {/* Color Variants Section */}
                        <tr className="bg-gray-50">
                          <td colSpan={7} className="px-6 py-3">
                            <h3 className="text-sm font-medium text-gray-900">Color Variants</h3>
                          </td>
                        </tr>
                        {product.data.colors.length > 0 ? (
                          product.data.colors.map((color, idx) => {
                            const colorStatus = getStatus(color.stock, product.originalQuantity);
                            return (
                              <tr key={`${product.id}-color-${idx}`} className="border-t border-gray-200">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={2}>
                                  <div className="flex items-center">
                                    {color.hexCode && (
                                      <span 
                                        className="w-4 h-4 rounded-full border border-gray-300 mr-2"
                                        style={{ backgroundColor: color.hexCode }}
                                      />
                                    )}
                                    {color.name}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatPrice(product.data.price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {color.stock ?? 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {/* Sold count for specific color would go here if available */}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                      colorStatus === "In Stock"
                                        ? "bg-green-100 text-green-800"
                                        : colorStatus === "Low Stock"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {colorStatus}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  {/* Actions for color variants */}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr className="border-t border-gray-200">
                            <td colSpan={7} className="px-6 py-4 text-sm text-gray-500">
                              No color variants available
                            </td>
                          </tr>
                        )}

                        {/* Components Section */}
                        <tr className="bg-gray-50">
                          <td colSpan={7} className="px-6 py-3">
                            <h3 className="text-sm font-medium text-gray-900">Components</h3>
                          </td>
                        </tr>
                        {product.data.components.length > 0 ? (
                          product.data.components.map((component, idx) => {
                            // const componentStock = typeof component.stock === 'string' ? 
                              // parseInt(component.stock) || 0 : 
                              // component.stock || 0;
                            // const componentStatus = getStatus(componentStock, product.originalQuantity);
                            
                            return (
                              <tr key={`${product.id}-component-${idx}`} className="border-t border-gray-200 bg-blue-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-800" colSpan={2}>
                                  {component.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                                  {formatPrice(typeof component.price === 'string' ? 
                                    parseInt(component.price) || 0 : 
                                    component.price || 0)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                                  {/* {componentStock} */}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-800">
                                  {/* Sold count for components would go here if available */}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {/* <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                      componentStatus === "In Stock"
                                        ? "bg-green-100 text-green-800"
                                        : componentStatus === "Low Stock"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {componentStatus}
                                  </span> */}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    Component
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr className="border-t border-gray-200">
                            <td colSpan={7} className="px-6 py-4 text-sm text-gray-500">
                              No components available
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  {inventory.length === 0 
                    ? "No products available in inventory" 
                    : "No products match your search"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;