"use client";

import { useState, useEffect } from "react";
import { getExchangeRate } from "@/lib/currency/exchange.service";

interface ExchangeRates {
  WLDtoPEN: number;
  PENtoWLD: number;
  loading: boolean;
  error: string | null;
}

export function useExchangeRate() {
  const [rates, setRates] = useState<ExchangeRates>({
    WLDtoPEN: 0,
    PENtoWLD: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchRates() {
      try {
        const { WLDtoPEN, PENtoWLD } = await getExchangeRate();

        if (isMounted) {
          setRates({
            WLDtoPEN,
            PENtoWLD,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error en useExchangeRate:", error);
        }
      }
    }

    fetchRates();

    return () => {
      isMounted = false;
    };
  }, []);

  const convertPENtoWLD = (amountPEN: number): number => {
    return Number.parseFloat((amountPEN * rates.PENtoWLD).toFixed(6));
  };

  // Función para convertir WLD a PEN
  const convertWLDtoPEN = (amountWLD: number): number => {
    return Number.parseFloat((amountWLD * rates.WLDtoPEN).toFixed(2));
  };

  return {
    ...rates,
    convertPENtoWLD,
    convertWLDtoPEN,
  };
}
