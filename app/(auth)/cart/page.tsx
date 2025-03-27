import { getItemById } from "@/db/item";
import { Item } from "@/db/types";
import { cookies } from "next/headers";
import CartItemList from "./CartView";
import CheckoutButton from "./CheckoutButton";

interface ItemInCart {
  item: Item;
  quantity: number;
}

const getItemsInCart = async (cart: {
  [id: string]: number;
}): Promise<ItemInCart[]> => {
  const itemsInCart: ItemInCart[] = [];

  for (const id of Object.keys(cart)) {
    const item = await getItemById(id);
    if (item) {
      itemsInCart.push({ item, quantity: cart[id] });
    }
  }

  return itemsInCart;
};

export default async function CartPage() {
  const cookieStore = cookies();
  const cart = JSON.parse(cookieStore.get("cart")?.value ?? "{}") as {
    [id: string]: number;
  };

  const itemsInCart = await getItemsInCart(cart);

  const total = itemsInCart.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Carrito de compras</h1>

        {itemsInCart.length > 0 ? (
          <>
            <CartItemList items={itemsInCart} />

            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium">Total</span>
                <span className="text-2xl font-bold">S/{total.toFixed(2)}</span>
              </div>

              <CheckoutButton items={itemsInCart} />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay productos en el carrito</p>
          </div>
        )}
      </div>
    </div>
  );
}
