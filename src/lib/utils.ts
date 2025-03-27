import { TransactionStatus } from "@/app/types/transactionStatus";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDateHours = (
  date: Date
): {
  date: {
    day: string;
    month: string;
    year: number;
  };
  hour: {
    hours: string;
    minutes: string;
  };
} => {
  const pad = (num: number): string => num.toString().padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Los meses empiezan en 0, así que sumamos 1
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return {
    date: { day, month, year },
    hour: { hours, minutes },
  };
};

export const formatDate = (date: Date): string => {
  const { date: dateObj, hour } = getDateHours(date);

  return `${dateObj.day}/${dateObj.month}/${dateObj.year} a las ${hour.hours}:${hour.minutes}`;
};

export const stageDialogs: Partial<
  Record<
    TransactionStatus | "result",
    { inProcess: string; done: string; name: string }
  >
> = {
  waitingSS: {
    name: "Transferencia",
    inProcess: "Esperando captura de pantalla",
    done: "Captura de pantalla recibida",
  },
  checkingSS: {
    name: "Revision",
    inProcess: "Revisando captura de pantalla",
    done: "Captura de pantalla revisada",
  },
  result: {
    name: "Resultado",
    inProcess: "Esperando resultado",
    done: "Resultado Obtenido",
  },
  aproved: {
    name: "Aprobado",
    inProcess: "",
    done: "Transacción aprobada",
  },
  rejected: {
    name: "Rechazado",
    inProcess: "",
    done: "Transacción rechazada",
  },
  qrRejected: {
    name: "QR Rechazado",
    inProcess: "",
    done: "El QR ha sido actualizado correctamente",
  },
  finished: {
    name: "Finalizado",
    inProcess: "Yapeando...",
    done: "Transacción terminada",
  },
};
