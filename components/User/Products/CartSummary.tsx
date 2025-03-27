import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  cart: { id: number; quantity: number }[];
  products:
    | {
        id: number;
        precio: number;
        imagen_url: string | null;
      }[]
    | null;
  onCheckout: () => void;
}

export default function CartSummary({
  cart,
  products,
  onCheckout,
}: CartSummaryProps) {
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const product = products?.find((p) => p.id === item.id);
      return total + (product?.precio || 0) * item.quantity;
    }, 0);
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="flex justify-between items-center mb-2">
        <span>Total productos: {getTotalItems()}</span>
        <span>Total: ${getTotalPrice()}</span>
      </div>
      <Button onClick={onCheckout} className="w-full">
        Proceder al pago
      </Button>
    </div>
  );
}
