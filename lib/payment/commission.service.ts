import {
  getAllCommissionsByAmount,
  calculateCommissionAmount,
} from "@/db/commission";
import type { CommissionsClient, Item } from "@/db/types";

export interface CommissionDetail {
  commission: CommissionsClient;
  amount: number;
  itemId: string;
  itemName: string;
  itemPrice: number;
  quantity: number;
}

export interface CommissionSummary {
  details: CommissionDetail[];
  totalCommission: number;
}

export async function calculateCommissions(
  items: { item: Item; quantity: number }[]
): Promise<CommissionSummary> {
  const details: CommissionDetail[] = [];
  let totalCommission = 0;

  for (const { item, quantity } of items) {
    const applicableCommissions = await getAllCommissionsByAmount(item.price);

    for (const commission of applicableCommissions) {
      const commissionAmount = calculateCommissionAmount(
        item.price,
        commission
      );

      const totalItemCommission = commissionAmount * quantity;

      details.push({
        commission,
        amount: totalItemCommission,
        itemId: item.id,
        itemName: item.name,
        itemPrice: item.price,
        quantity,
      });

      totalCommission += totalItemCommission;
    }
  }

  return {
    details,
    totalCommission,
  };
}

export function formatCommissionType(commission: CommissionsClient): string {
  if (commission.type === "percentage") {
    return `${commission.amount}%`;
  } else {
    return `S/.${commission.amount.toFixed(2)}`;
  }
}

export function getCommissionDescription(
  commission: CommissionsClient
): string {
  const minText =
    commission.minThreshold !== null
      ? `S/.${commission.minThreshold.toFixed(2)}`
      : "cualquier precio";

  const maxText =
    commission.maxThreshold !== null
      ? `S/.${commission.maxThreshold.toFixed(2)}`
      : "sin límite";

  return `Comisión de ${formatCommissionType(
    commission
  )} para productos entre ${minText} y ${maxText}`;
}
