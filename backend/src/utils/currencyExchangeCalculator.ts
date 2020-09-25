
// the calculations will be precise to significantDecimals decimal places
const significantDecimals = 5;


const multiplyMoney = (x: number, y: number): number => {
  const precision = Math.pow(10, significantDecimals);
  const wholeAmount = x * precision;
  const result = Math.floor(wholeAmount * y);
  return result / precision;
};

const divideMoney = (x: number, y: number): number => {
  return multiplyMoney(x, 1 / y);
};

export const convertMoney = (from: number, to: number, multiplyBy: number): number => {
  return multiplyMoney(divideMoney(to, from), multiplyBy);
};
