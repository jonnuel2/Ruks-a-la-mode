import { formatPrice } from "@/helpers/functions";
import { useAppContext } from "@/helpers/store";
import { useRouter } from "next/navigation";
import Image from "next/image";

type ProductComponentProps = {
  addToBag: () => void;
  isInCart?: boolean;
  viewProduct?: () => void;
  product: any;
};

export default function Product({
  product,
  viewProduct,
}: ProductComponentProps) {
  const context = useAppContext();
  const { exchangeRates, currency } = context;
  const router = useRouter();

  const isOutOfStock = product?.data?.totalStock <= 0; // Check if the product is out of stock

  return (
    <div
      className={`transition-transform duration-300 ease-out cursor-pointer hover:scale-105 flex flex-col items-center mb-8 relative ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div onClick={viewProduct} className="w-full flex flex-col items-start lg:items-center">
        <div className="relative sm:h-96 w-full h-60 sm:w-80">
          {product?.data?.images[0] && (
            <Image
              priority
              fill
              src={product?.data?.images[0]}
              alt={product?.data?.name}
              className="object-cover"
              sizes="33vw"
            />
          )}

          {isOutOfStock && (
            <div className="absolute top-2 left-2 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full shadow-md">
              OUT OF STOCK
            </div>
          )}
        </div>

        <p className="lg:text-base mt-6 text-xs lg:w-auto w-32 font-medium uppercase mb-2 text-left lg:text-center text-dark">
          {product?.data?.name}
        </p>
        <p className="lg:text-base text-xs font-light text-center text-dark">
          {formatPrice(
            currency,
            product?.data?.price * exchangeRates[currency.toLowerCase()]
          )}
        </p>
      </div>
    </div>
  );
}
