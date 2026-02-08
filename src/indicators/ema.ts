export function calculateEMA(
  values: number[],
  period: number
): number[] {
  const k = 2 / (period + 1);
  const emaArray: number[] = [];

  let ema = values[0]; // start EMA with first value
  emaArray.push(ema);

  for (let i = 1; i < values.length; i++) {
    ema = values[i] * k + ema * (1 - k);
    emaArray.push(ema);
  }

  return emaArray;
}
