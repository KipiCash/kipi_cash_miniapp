interface WorldCoinPriceResponse {
  result: {
    prices: {
      [cryptoCurrency: string]: {
        [fiatCurrency: string]: {
          asset: string;
          amount: string;
          decimals: number;
          symbol: string;
        };
      };
    };
  };
}

export async function getExchangeRate(): Promise<{
  WLDtoPEN: number;
  PENtoWLD: number;
}> {
  try {
    const response = await fetch("/api/exchange-rate");

    console.log(response);

    if (!response.ok) {
      throw new Error(`Error al obtener tipo de cambio: ${response.status}`);
    }

    const data: WorldCoinPriceResponse = await response.json();

    const penData = data.result.prices.WLD.PEN;

    const WLDtoPEN =
      Number.parseFloat(penData.amount) / Math.pow(10, penData.decimals);

    const PENtoWLD = 1 / WLDtoPEN;

    return { WLDtoPEN, PENtoWLD };
  } catch (error) {
    console.error("Error al obtener tipo de cambio:", error);
    throw error;
  }
}

export async function convertPENtoWLD(amountPEN: number): Promise<number> {
  const { PENtoWLD } = await getExchangeRate();
  const amountWLD = amountPEN * PENtoWLD;

  return Number.parseFloat(amountWLD.toFixed(6));
}

export async function convertWLDtoPEN(amountWLD: number): Promise<number> {
  const { WLDtoPEN } = await getExchangeRate();
  const amountPEN = amountWLD * WLDtoPEN;

  return Number.parseFloat(amountPEN.toFixed(2));
}
