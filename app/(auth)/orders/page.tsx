"use client";

import { getBuysByClient } from "@/db/buy";
import { getPaymentById } from "@/db/payment";
import type { Buy, Payment } from "@/db/types";
import { useEffect, useState } from "react";
import OrdersList from "./OrdersList";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { useUser } from "@/app/user-context";

export default function OrdersPage() {
  const [ordersWithPayments, setOrdersWithPayments] = useState<
    { buy: Buy; payment: Payment }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const showSuccessMessage = searchParams.get("success") === "true";

  const { user } = useUser();

  useEffect(() => {
    if (!user?.walletAddress) return;

    async function fetchOrders() {
      setLoading(true);
      try {
        const buys = await getBuysByClient(user?.walletAddress!);
        console.log("buys", buys);
        const payments = await Promise.all(
          buys.map((buy) => getPaymentById(buy.paymentId))
        );

        const combinedOrders = buys.map((buy, index) => ({
          buy,
          payment: payments[index],
        }));
        setOrdersWithPayments(combinedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user?.walletAddress]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Historial de compras</h1>

        {showSuccessMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <AlertDescription className="text-green-800">
              ¡Compra realizada con éxito! Puedes ver el código QR de validación
              en los detalles de tu pedido.
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <OrdersListSkeleton />
        ) : (
          <OrdersList orders={ordersWithPayments} />
        )}
      </div>
    </div>
  );
}

function OrdersListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
            </div>
            <div className="text-right">
              <div className="h-5 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-28 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-4 w-36 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}
