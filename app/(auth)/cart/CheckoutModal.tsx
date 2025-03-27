"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Info } from "lucide-react";
import type { Item } from "@/db/types";
import Image from "next/image";
import { usePayment } from "@/hooks/usePayment";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  formatCommissionType,
  getCommissionDescription,
} from "@/lib/payment/commission.service";
import { useUser } from "../../user-context";

interface CartItem {
  item: Item;
  quantity: number;
}

interface CheckoutModalProps {
  items: CartItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CheckoutModal({
  items,
  open,
  onOpenChange,
  onSuccess,
}: CheckoutModalProps) {
  const { user } = useUser();
  const router = useRouter();
  const {
    paymentStatus,
    commissionSummary,
    calculateItemCommissions,
    processPayment,
  } = usePayment();
  const {
    convertPENtoWLD,
    WLDtoPEN,
    loading: loadingRates,
  } = useExchangeRate();

  // Calcular subtotal (sin comisiones)
  const subtotal = items.reduce(
    (sum, { item, quantity }) => sum + item.price * quantity,
    0
  );

  useEffect(() => {
    if (open && items.length > 0) {
      const purchaseItems = items.map(({ item, quantity }) => ({
        item,
        quantity,
        storeId: item.storeId, // Asegurarnos de incluir el storeId
      }));

      calculateItemCommissions(purchaseItems);
    }
  }, [open, items, calculateItemCommissions]);

  const handlePayment = () => {
    if (!user) {
      router.push("/");
      return;
    }

    const totalCommission = commissionSummary?.totalCommission || 0;
    const grandTotal = subtotal + totalCommission;
    const wldAmount = convertPENtoWLD(grandTotal);

    const description = `Compra de ${items.length} productos del carrito`;

    const purchaseItems = items.map(({ item, quantity }) => ({
      item,
      quantity,
      storeId: item.storeId, // Asegurarnos de incluir el storeId
    }));

    processPayment(
      user.walletAddress!,
      wldAmount,
      description,
      purchaseItems,
      () => {
        console.log("Pago completado con éxito");
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
        router.push("/orders?success=true");
      }
    );
  };

  const totalCommission = commissionSummary?.totalCommission || 0;
  const grandTotal = subtotal + totalCommission;
  const totalWLD = convertPENtoWLD(grandTotal);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Confirmar compra</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto border rounded-md p-2">
            <h3 className="font-medium mb-2 px-2">Productos en el carrito</h3>
            <div className="space-y-3">
              {items.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-2 border-b last:border-b-0"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0 relative overflow-hidden">
                    <img
                      src={
                        item.imageImgLink ||
                        "/placeholder.svg?height=48&width=48"
                      }
                      alt={item.name}
                      // fill
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {item.name}
                    </h4>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-600">
                        Cantidad: {quantity}
                      </p>
                      <p className="text-sm font-medium">
                        S/{(item.price * quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {commissionSummary && commissionSummary.details.length > 0 && (
            <div className="border rounded-md p-3 bg-gray-50">
              <h3 className="text-sm font-medium mb-2">
                Comisiones aplicables:
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {commissionSummary.details.map((detail, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center">
                      <span className="truncate max-w-[150px]">
                        {detail.itemName}
                      </span>
                      <span className="mx-1">-</span>
                      <span>{formatCommissionType(detail.commission)}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="ml-1 text-gray-400 hover:text-gray-600">
                              <Info className="h-3.5 w-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">
                              {getCommissionDescription(detail.commission)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span>S/{detail.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t text-sm font-medium">
                  <span>Total comisiones:</span>
                  <span>S/{totalCommission.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Total a pagar */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Subtotal:</span>
              <span className="text-sm">S/{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Comisiones:</span>
              <span className="text-sm">S/{totalCommission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-medium">
              <span>Total a pagar:</span>
              <span>S/{grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
              <span>Total en WLD:</span>
              <span>{totalWLD.toFixed(6)} WLD</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Método de pago</h3>
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">WLD</span>
              </div>
              <div className="flex-1">
                <span className="font-medium">Pago con WorldCoin</span>
                <p className="text-xs text-gray-500">
                  Tipo de cambio: 1 WLD = S/{WLDtoPEN.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {paymentStatus.status && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm flex items-center gap-2">
                {paymentStatus.isProcessing && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {paymentStatus.status}
              </p>
            </div>
          )}

          {paymentStatus.error && (
            <div className="bg-red-50 p-3 rounded-md">
              <p className="text-sm text-red-600">{paymentStatus.error}</p>
            </div>
          )}

          <div className="pt-2 flex gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="flex-1"
                disabled={paymentStatus.isProcessing}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              className="flex-1 bg-black text-white hover:bg-gray-800"
              onClick={handlePayment}
              disabled={paymentStatus.isProcessing}
            >
              {paymentStatus.isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Procesando...
                </span>
              ) : (
                `Pagar ${totalWLD.toFixed(6)} WLD`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
