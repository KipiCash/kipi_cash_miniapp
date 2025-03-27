import { setBuy } from "@/db/buy";
import { setPayment } from "@/db/payment";
import { Buy, BuyEntry, Payment } from "@/db/types";
import {
  MiniKit,
  type PayCommandInput,
  Tokens,
  tokenToDecimals,
} from "@worldcoin/minikit-js";

const RECEIVER_ADDRESS =
  process.env.RECEIVER_ADDRESS || "0x4f2f92cf7c8d18f440bad599b4e9615838433220";

export interface PaymentStatus {
  status: string;
  error: string;
  isProcessing: boolean;
}

export interface SwapResult {
  success: boolean;
  order?: string;
}

export async function initiatePayment(): Promise<{ id: string }> {
  const response = await fetch("/api/initiate-payment", { method: "POST" });
  return response.json();
}

export async function confirmPayment(
  finalPayload: any
): Promise<{ success: boolean }> {
  const response = await fetch(`/api/confirm-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finalPayload),
  });
  return response.json();
}

export async function pollAutoSwap(tokenWLD: number): Promise<SwapResult> {
  const interval = 10000;
  const maxAttempts = 30;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const swapRes = await fetch("/api/binance-swap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromAmount: tokenWLD.toString(),
      }),
    });

    const swapData = await swapRes.json();
    if (swapData.success) {
      return swapData;
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
    attempts++;
  }

  throw new Error("Swap no ejecutado dentro del tiempo esperado");
}

export async function executePayment(
  reference: string,
  tokenWLD: number,
  description: string
): Promise<any> {
  const payload: PayCommandInput = {
    reference,
    to: RECEIVER_ADDRESS,
    tokens: [
      {
        symbol: Tokens.WLD,
        token_amount: tokenToDecimals(tokenWLD, Tokens.WLD).toString(),
      },
    ],
    description,
  };

  if (!MiniKit.isInstalled()) {
    throw new Error("MiniKit no está instalado");
  }

  try {
    const result = await MiniKit.commandsAsync.pay(payload);
    return result.finalPayload;
  } catch (e: any) {
    if (
      e.message &&
      e.message.includes("No handler for event miniapp-payment")
    ) {
      console.warn("Error de handler ignorado:", e.message);
      throw new Error(
        "No se pudo obtener finalPayload debido al error de handler"
      );
    } else {
      throw e;
    }
  }
}

export async function registerPayment(
  clientId: string,
  amount: number,
  commissionAmount: number
): Promise<string> {
  // Crear objeto de pago
  const payment: Payment = {
    clientId,
    paidAt: new Date().toISOString(),
    amount,
    commissionAmount,
  };

  return await setPayment(payment);
}

export async function registerBuy(
  clientId: string,
  paymentId: string,
  buyEntries: BuyEntry[]
): Promise<string> {
  const buy: Buy = {
    clientId,
    paymentId,
    buys: buyEntries,
  };

  return await setBuy(buy);
}
