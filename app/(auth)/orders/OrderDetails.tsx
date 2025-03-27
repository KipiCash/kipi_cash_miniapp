"use client";

import type { Buy } from "@/db/types";
import { useEffect, useState } from "react";
import { getStoreById } from "@/db/store";
import { getItemById } from "@/db/item";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OrderDetailsProps {
  buy: Buy;
}

interface StoreDetails {
  name: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    redemed: number;
    id: string;
  }[];
}

export default function OrderDetails({ buy }: OrderDetailsProps) {
  const [storeDetails, setStoreDetails] = useState<{
    [key: string]: StoreDetails;
  }>({});
  const [loading, setLoading] = useState(true);
  const [isFullyRedeemed, setIsFullyRedeemed] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalRedeemed, setTotalRedeemed] = useState(0);

  useEffect(() => {
    const loadStoreDetails = async () => {
      const details: { [key: string]: StoreDetails } = {};
      let itemsCount = 0;
      let redeemedCount = 0;

      for (const entry of buy.buys) {
        try {
          const store = await getStoreById(entry.storeId);
          const items = await Promise.all(
            entry.items.map(async (item) => {
              const itemDetails = await getItemById(item.itemId);
              itemsCount += item.amount;
              redeemedCount += item.redemed;
              return {
                name: itemDetails.name,
                price: item.price || itemDetails.price,
                quantity: item.amount,
                redemed: item.redemed,
                id: itemDetails.id,
              };
            })
          );

          details[entry.storeId] = {
            name: store.name,
            items,
          };
        } catch (error) {
          console.error(
            `Error loading details for store ${entry.storeId}:`,
            error
          );
        }
      }

      setTotalItems(itemsCount);
      setTotalRedeemed(redeemedCount);
      setIsFullyRedeemed(itemsCount > 0 && itemsCount === redeemedCount);
      setStoreDetails(details);
      setLoading(false);
    };

    loadStoreDetails();
  }, [buy]);

  if (loading) {
    return (
      <div className="p-4 border-t">
        <p className="text-center text-gray-500">Cargando detalles...</p>
      </div>
    );
  }

  const kipiBusinessUrl = "https://kipi-business.vercel.app";
  const qrUrl = `${kipiBusinessUrl}/scan-qr?buyId=${buy.id}`;
  const pendingItems = totalItems - totalRedeemed;

  return (
    <div className="border-t">
      {/* Resumen de canje */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Resumen de canje</h3>
          <Badge
            variant="outline"
            className={`${
              isFullyRedeemed
                ? "text-green-600 border-green-200 bg-green-50"
                : "text-amber-600 border-amber-200 bg-amber-50"
            }`}
          >
            {isFullyRedeemed ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <Clock className="w-3 h-3 mr-1" />
            )}
            {isFullyRedeemed ? "Completado" : "Pendiente"}
          </Badge>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          <div className="bg-white p-2 rounded-md">
            <p className="text-xs text-gray-500">Total</p>
            <p className="font-medium">{totalItems}</p>
          </div>
          <div className="bg-white p-2 rounded-md">
            <p className="text-xs text-gray-500">Canjeados</p>
            <p className="font-medium text-green-600">{totalRedeemed}</p>
          </div>
          <div className="bg-white p-2 rounded-md">
            <p className="text-xs text-gray-500">Pendientes</p>
            <p className="font-medium text-amber-600">{pendingItems}</p>
          </div>
        </div>

        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progreso de canje</span>
            <span>
              {totalItems > 0
                ? Math.round((totalRedeemed / totalItems) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{
                width: `${
                  totalItems > 0 ? (totalRedeemed / totalItems) * 100 : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Store Sections */}
      {Object.entries(storeDetails).map(([storeId, store]) => (
        <div key={storeId} className="p-4 border-b last:border-b-0">
          <h4 className="font-medium mb-3">{store.name}</h4>
          <div className="space-y-3">
            {store.items.map((item) => {
              const isItemFullyRedeemed =
                item.quantity > 0 && item.quantity === item.redemed;
              const pendingCount = item.quantity - item.redemed;

              return (
                <div
                  key={item.id}
                  className={`flex justify-between text-sm p-2 rounded-md ${
                    isItemFullyRedeemed ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={isItemFullyRedeemed ? "text-gray-500" : ""}>
                        {item.name}
                      </p>
                      {isItemFullyRedeemed ? (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-200 bg-green-50"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Canjeado
                        </Badge>
                      ) : item.redemed > 0 ? (
                        <Badge
                          variant="outline"
                          className="text-amber-600 border-amber-200 bg-amber-50"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          Parcial
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-gray-500 text-xs">
                      PRD-{item.id.slice(-3)}
                    </p>

                    {/* Mostrar progreso de canje siempre */}
                    <div className="mt-1">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>
                          {item.redemed} canjeados · {pendingCount} pendientes
                        </span>
                        <span>
                          {Math.round((item.redemed / item.quantity) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{
                            width: `${(item.redemed / item.quantity) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{item.quantity}x</span>
                    <span className="w-20 text-right">
                      S/{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Validation Code Section */}
      <div className="p-4 border-t bg-gray-50">
        {isFullyRedeemed ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">
              Todos los productos de esta compra han sido canjeados
              exitosamente.
            </p>
          </div>
        ) : (
          <p className="text-sm text-center mb-3">Código de validación</p>
        )}

        <div className="flex flex-col items-center">
          <div
            id={`qr-code-${buy.paymentId}`}
            className={`p-2 bg-white rounded-lg ${
              isFullyRedeemed ? "opacity-50" : ""
            } relative`}
          >
            <QRCodeSVG
              value={qrUrl}
              size={128}
              level="H"
              includeMargin
              className="rounded-lg"
            />

            {isFullyRedeemed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white bg-opacity-80 rounded-full p-1">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-center text-gray-500 mt-2">
            {isFullyRedeemed
              ? "Este código QR ya ha sido utilizado completamente."
              : "Presenta este código QR en la tienda para recibir tus productos."}
          </p>
        </div>
      </div>
    </div>
  );
}
