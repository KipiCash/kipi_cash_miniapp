// app/api/binance-withdraw/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

const apiKey = process.env.BINANCE_API_KEY;
const apiSecret = process.env.BINANCE_API_SECRET;
const baseUrl = "https://api.binance.com";

function sign(query: string): string {
  return crypto
    .createHmac("sha256", apiSecret as string)
    .update(query)
    .digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    // Se esperan los siguientes parámetros en el body:
    // coin: Ejemplo "USDT"
    // amount: Monto a retirar (por lo general el resultado del swap)
    // address: Dirección de la billetera destino
    // network (opcional): Ejemplo "ERC20", "TRC20", etc.
    const { coin, amount, address, network } = await request.json();
    if (!coin || !amount || !address) {
      return NextResponse.json(
        { error: "Faltan parámetros obligatorios: coin, amount y address" },
        { status: 400 }
      );
    }

    const recvWindow = 60000;
    const timestamp = Date.now();

    // Construir el query para el endpoint de retiro
    let queryString = `coin=${coin}&address=${address}&amount=${amount}&recvWindow=${recvWindow}&timestamp=${timestamp}`;
    if (network) {
      queryString += `&network=${network}`;
    }
    const signature = sign(queryString);
    queryString += `&signature=${signature}`;

    const withdrawUrl = `${baseUrl}/sapi/v1/capital/withdraw/apply?${queryString}`;
    const withdrawResponse = await axios.post(withdrawUrl, null, {
      headers: { "X-MBX-APIKEY": apiKey },
    });
    const withdrawData = withdrawResponse.data;
    console.log("Respuesta del retiro", withdrawData);

    return NextResponse.json({ success: true, withdraw: withdrawData });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.msg || error.message || error.toString() },
      { status: 400 }
    );
  }
}
