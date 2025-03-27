"use client";

import React, { useState, useEffect } from "react";

const fetchConversionRate = async () => {
  try {
    const coinResponse = await fetch(
      "https://www.worldcoinindex.com/apiservice/ticker?key=02L4vsaiNfZRP7B9a9FxZWg1RxC1gtrQXa8&label=wldbtc&fiat=usd"
    );
    const { Markets } = await coinResponse.json();
    console.log(Markets);

    const wldPriceUSD = Markets[0].Price;

    const fxResponse = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const fxData = await fxResponse.json();
    const usdToPen = fxData?.rates?.PEN;
    if (!usdToPen) {
      throw new Error("Error obteniendo tasa USD a PEN");
    }

    const usdToPenSell = usdToPen + 0.1;

    console.log(usdToPenSell);

    const wldPricePEN = wldPriceUSD * usdToPenSell;
    const penToWldRate = 1 / wldPricePEN;
    return penToWldRate;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function ConversionRateComponent() {
  const [conversionRate, setConversionRate] = useState<number | null>(null);

  useEffect(() => {
    const getRate = async () => {
      const rate = await fetchConversionRate();
      setConversionRate(rate);
    };
    getRate();
    const interval = setInterval(() => {
      getRate();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {conversionRate !== null ? (
        <>
          <p>Tasa de conversión: 1 PEN = {conversionRate.toFixed(6)} WLD</p>
          <p>
            Tasa de conversión: 1 WLD = {(1 / conversionRate).toFixed(6)} PEN
          </p>
        </>
      ) : (
        <p>Cargando tasa de conversión...</p>
      )}
    </div>
  );
}
