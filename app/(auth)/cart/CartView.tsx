"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  removeProductFromCart,
  subsTractOneProductFromCart,
  addProductTocart,
} from "./actions";
import { useRouter } from "next/navigation";
import type { Item } from "@/db/types";

interface CartItemListProps {
  items: {
    item: Item;
    quantity: number;
  }[];
}

export default function CartItemList({ items }: CartItemListProps) {
  const router = useRouter();

  const handleRemoveItem = (id: string) => {
    removeProductFromCart(id);
    router.refresh();
  };

  const handleDecrementQuantity = (id: string) => {
    subsTractOneProductFromCart(id);
    router.refresh();
  };

  const handleIncrementQuantity = (id: string) => {
    addProductTocart(id);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.item.id}
          className="flex items-center gap-4 p-4 bg-white rounded-lg border"
        >
          <div className="w-20 h-20 bg-gray-200 rounded-md relative flex-shrink-0 overflow-hidden">
            <img
              src={
                item.item.imageImgLink || "/placeholder.svg?height=80&width=80"
              }
              alt={item.item.name}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {item.item.name}
            </h3>
            <p className="text-gray-600">S/{item.item.price.toFixed(2)}</p>

            <div className="flex items-center mt-2">
              <button
                onClick={() => handleDecrementQuantity(item.item.id)}
                className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-50"
                type="button"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="mx-3 min-w-[2ch] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => handleIncrementQuantity(item.item.id)}
                className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-50"
                type="button"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            onClick={() => handleRemoveItem(item.item.id)}
            className="p-2 text-gray-400 hover:text-gray-600"
            aria-label="Eliminar producto"
            type="button"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
}
