"use client";

import { Button } from "@/components/ui/button";
import { Item } from "@/db/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckoutModal } from "./CheckoutModal";

interface CartItem {
  item: Item;
  quantity: number;
}

interface CheckoutButtonProps {
  items: CartItem[];
}

export default function CheckoutButton({ items }: CheckoutButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleSuccess = () => {
    document.cookie = "cart={}; path=/;";
    router.refresh();
  };

  return (
    <>
      <Button
        className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
        onClick={() => setShowModal(true)}
      >
        Proceder al pago
      </Button>

      <CheckoutModal
        items={items}
        open={showModal}
        onOpenChange={setShowModal}
        onSuccess={handleSuccess}
      />
    </>
  );
}
