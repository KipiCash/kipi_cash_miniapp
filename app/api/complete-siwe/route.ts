// app/api/verify-wallet-auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  verifySiweMessage,
  MiniAppWalletAuthSuccessPayload,
} from "@worldcoin/minikit-js";
import { cookies } from "next/headers";

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload;
  nonce: string;
}

export async function POST(req: NextRequest) {
  const { payload, nonce } = (await req.json()) as IRequestPayload;
  if (nonce != cookies().get("siwe")?.value) {
    return NextResponse.json({
      status: "error",
      isValid: false,
      message: "Invalid nonce",
    });
  }
  try {
    const validMessage = await verifySiweMessage(payload, nonce);
    return NextResponse.json({
      status: "success",
      isValid: validMessage,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      isValid: false,
      message: error.message,
    });
  }
}
