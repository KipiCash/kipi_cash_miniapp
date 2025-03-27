import { MiniAppPaymentSuccessPayload } from "@worldcoin/minikit-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as MiniAppPaymentSuccessPayload;
    console.log("Payload: ", payload);

    // IMPORTANT: Here we should fetch the reference you created in /initiate-payment to ensure the transaction we are verifying is the same one we initiated
    //   const reference = getReferenceFromDB();
    const cookieStore = cookies();

    const reference = cookieStore.get("payment-nonce")?.value;
    console.log("Cookie payment-nonce:", reference);

    if (!reference) {
      return NextResponse.json(
        { success: false, error: "Cookie 'payment-nonce' no encontrada" },
        { status: 400 }
      );
    }

    if (!payload.reference) {
      return NextResponse.json(
        { success: false, error: "El payload no contiene 'reference'" },
        { status: 400 }
      );
    }

    if (payload.reference === reference) {
      const response = await fetch(
        `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${process.env.APP_ID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
          },
        }
      );
      const transaction = await response.json();
      console.log(transaction);
      if (
        transaction.reference == reference &&
        transaction.transaction_status !== "failed"
      ) {
        console.log("Transacción confirmada:", transaction);
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Transacción no confirmada",
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Referencia no coincide" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error en confirm-payment endpoint:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
