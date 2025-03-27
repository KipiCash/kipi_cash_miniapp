import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function GET() {
  const nonce = crypto.randomUUID().replace(/-/g, "");

  cookies().set("siwe", nonce, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
  });

  return NextResponse.json({ nonce });
}
