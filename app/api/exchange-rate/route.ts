import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://app-backend.worldcoin.dev/public/v1/miniapps/prices?cryptoCurrencies=WLD&fiatCurrencies=PEN",
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 3600 }, // Revalidar cada hora
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener tipo de cambio: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en API de tipo de cambio:", error);
    return NextResponse.json(
      {
        error: "Error al obtener tipo de cambio",
      },
      { status: 500 }
    );
  }
}
