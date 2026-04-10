export const EUR_TO_BGN = 1.95583;

export type Currency = "EUR" | "BGN";

export function convertEurToBgn(eur: number): number {
  return Math.round(eur * EUR_TO_BGN * 100) / 100;
}

export function formatPrice(
  eurPrice: number,
  currency: Currency = "BGN"
): string {
  if (currency === "BGN") {
    const bgn = convertEurToBgn(eurPrice);
    return `${bgn.toFixed(0)} лв.`;
  }
  return `${eurPrice.toFixed(2)} €`;
}
