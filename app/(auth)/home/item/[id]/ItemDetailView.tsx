"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Item } from "@/db/types";
import { Minus, Plus } from "lucide-react";
import { usePayment } from "@/hooks/usePayment";
import { useUser } from "../../../../user-context";
import { useRouter } from "next/navigation";
import { PaymentModal } from "./PaymentModal";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { addProductTocart } from "@/app/(auth)/cart/actions";
import Link from "next/link";

interface ItemDetailViewProps {
  item: Item;
  storeName: string;
  storeId: string;
}

export default function ItemDetailView({
  item,
  storeName,
  storeId,
}: ItemDetailViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const {
    paymentStatus,
    commissionSummary,
    calculateItemCommissions,
    processPayment,
  } = usePayment();
  const { user } = useUser();
  const router = useRouter();

  const {
    convertPENtoWLD,
    WLDtoPEN,
    loading: loadingRates,
    error: rateError,
  } = useExchangeRate();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < item.stock) {
      setQuantity(quantity + 1);
    }
  };

  const addToCart = () => {
    console.log(`Añadiendo ${quantity} unidades de ${item.name} al carrito`);

    addProductTocart(item.id, quantity);
    router.refresh();
  };

  const buyNow = async () => {
    await calculateItemCommissions([
      {
        item,
        quantity,
        storeId: item.storeId,
      },
    ]);

    setShowPaymentModal(true);
  };

  const handlePayment = (commissions: number) => {
    const totalPEN = item.price * quantity + commissions;

    const wldAmount = convertPENtoWLD(totalPEN);

    const description = `Compra de ${quantity} unidad(es) de ${item.name}`;

    const purchaseItems = [
      {
        item,
        quantity,
        storeId: item.storeId,
      },
    ];

    processPayment(
      user!.walletAddress!,
      wldAmount,
      description,
      purchaseItems,
      () => {
        console.log("Pago completado con éxito");
        setShowPaymentModal(false);
        router.push("/orders?success=true");
      }
    );
  };

  const priceInWLD = convertPENtoWLD(item.price);

  return (
    <div className="flex flex-col max-w-md mx-auto">
      {/* Product Image */}
      <div className="w-full aspect-square bg-gray-200 relative">
        <img
          src={item.imageImgLink || "/placeholder.svg?height=400&width=400"}
          alt={item.name}
          // fill
          className="object-cover w-full h-full"
        />
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-4">
        <h1 className="text-xl font-semibold">{item.name}</h1>
        <p className="text-sm text-gray-600">
          Vendido por{" "}
          <Link href={`/home/store/${storeId}`} className="font-medium">
            {storeName}
          </Link>
        </p>

        <div className="text-2xl font-bold">S/{item.price.toFixed(2)}</div>

        <p className="text-sm text-gray-500">
          {priceInWLD.toFixed(6)} WLD
          {rateError && (
            <span className="text-xs text-amber-600 ml-2">
              (tipo de cambio aproximado)
            </span>
          )}
        </p>

        <div>
          <p className="text-sm text-gray-600 mb-2">Cantidad</p>
          <div className="flex items-center">
            <button
              onClick={decreaseQuantity}
              className="w-8 h-8 border rounded-md flex items-center justify-center"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="mx-4">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="w-8 h-8 border rounded-md flex items-center justify-center"
              disabled={quantity >= item.stock}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {item.description && (
          <div>
            <h2 className="font-semibold mb-2">Descripción</h2>
            <p className="text-sm text-gray-700">{item.description}</p>
          </div>
        )}

        {item.instruction && (
          <div>
            <h2 className="font-semibold mb-2">Instrucciones</h2>
            <p className="text-sm text-gray-700">
              {item.instruction.instructions}
            </p>

            {item.instruction.contactNumber && (
              <p className="text-sm text-gray-700 mt-2">
                Contacto: {item.instruction.contactNumber}
              </p>
            )}

            {item.instruction.direction && (
              <p className="text-sm text-gray-700 mt-2">
                Dirección: {item.instruction.direction}
              </p>
            )}
          </div>
        )}

        {item.specifications && item.specifications.length > 0 && (
          <div>
            <h2 className="font-semibold mb-2">Especificaciones</h2>
            <div className="space-y-1">
              {item.specifications.map((spec, index) => (
                <div key={index} className="flex text-sm">
                  <span className="font-medium mr-2">{spec.name}:</span>
                  <span className="text-gray-700">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 space-y-3">
          <Button
            className="w-full bg-black text-white hover:bg-gray-800"
            onClick={addToCart}
          >
            Añadir al carrito
          </Button>

          <Button
            variant="outline"
            className="w-full border-black text-black hover:bg-gray-100"
            onClick={buyNow}
          >
            Comprar ahora
          </Button>
        </div>
      </div>

      <PaymentModal
        item={item}
        quantity={quantity}
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        onPay={handlePayment}
        paymentStatus={paymentStatus}
        exchangeRate={{ WLDtoPEN, PENtoWLD: convertPENtoWLD(1) }}
        commissionSummary={commissionSummary}
      />
    </div>
  );
}
