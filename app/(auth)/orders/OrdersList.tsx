"use client";

import { useState } from "react";
import type { Buy, Payment } from "@/db/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, ChevronUp } from "lucide-react";
import OrderDetails from "./OrderDetails";

interface OrdersListProps {
  orders: {
    buy: Buy;
    payment: Payment;
  }[];
}

export default function OrdersList({ orders }: OrdersListProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">No tienes compras realizadas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(({ buy, payment }) => (
        <div
          key={buy.paymentId}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {/* Order Header */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">
                  Compra #{buy.paymentId.slice(-5)}
                </h3>
                <p className="text-sm text-gray-500">
                  {format(
                    new Date(payment.paidAt),
                    "dd 'de' MMMM, yyyy - HH:mm",
                    {
                      locale: es,
                    }
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">S/{payment.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  Comisión: S/{payment.commissionAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                setExpandedOrderId(
                  expandedOrderId === buy.paymentId ? null : buy.paymentId
                )
              }
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              {expandedOrderId === buy.paymentId ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Ocultar detalles
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Detalles de la compra
                </>
              )}
            </button>
          </div>

          {/* Order Details */}
          {expandedOrderId === buy.paymentId && <OrderDetails buy={buy} />}
        </div>
      ))}
    </div>
  );
}
