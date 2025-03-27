// app/api/binance-swap/route.ts
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
    const { fromAmount } = await request.json();
    if (!fromAmount) {
      return NextResponse.json(
        { error: "El parámetro fromAmount es obligatorio" },
        { status: 400 }
      );
    }

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "API Key y Secret son requeridos" },
        { status: 500 }
      );
    }

    const endpointQuote = "/sapi/v1/convert/getQuote";
    const fromAsset = "WLD";
    const toAsset = "USDT";
    const walletType = "SPOT";
    const validTime = "10s";
    const recvWindow = 60000;
    const timestamp = Date.now();

    let queryString = `fromAsset=${fromAsset}&toAsset=${toAsset}&fromAmount=${fromAmount}&walletType=${walletType}&validTime=${validTime}&recvWindow=${recvWindow}&timestamp=${timestamp}`;
    const signature = sign(queryString);
    queryString += `&signature=${signature}`;

    const quoteUrl = `${baseUrl}${endpointQuote}?${queryString}`;
    const quoteResponse = await axios.post(quoteUrl, null, {
      headers: { "X-MBX-APIKEY": apiKey },
    });
    const quoteData = quoteResponse.data;
    const quoteId = quoteData.quoteId;
    if (!quoteId) {
      return NextResponse.json(
        { error: "No se recibió quoteId, verifica tu balance y parámetros" },
        { status: 400 }
      );
    }
    console.log("Cotización obtenida", quoteData);

    const endpointAccept = "/sapi/v1/convert/acceptQuote";
    const newTimestamp = Date.now();
    let acceptQuery = `quoteId=${quoteId}&recvWindow=${recvWindow}&timestamp=${newTimestamp}`;
    const acceptSignature = sign(acceptQuery);
    acceptQuery += `&signature=${acceptSignature}`;

    const acceptUrl = `${baseUrl}${endpointAccept}?${acceptQuery}`;
    const acceptResponse = await axios.post(acceptUrl, null, {
      headers: { "X-MBX-APIKEY": apiKey },
    });
    const orderResponse = acceptResponse.data;
    console.log("Response de conversión", orderResponse);

    return NextResponse.json({ success: true, order: orderResponse });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.msg || error.message || error.toString() },
      { status: 400 }
    );
  }
}
