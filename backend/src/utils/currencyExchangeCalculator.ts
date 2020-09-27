import { Decimal } from "decimal.js-light";

Decimal.config({
  rounding: 2
});

const multiplyMoney = (x: Decimal, y: Decimal): Decimal => {
  return x.times(y);
};

const divideMoney = (x: Decimal, y: Decimal): Decimal => {
  return x.div(y);
};

export const convertMoney = (
  from: number,
  to: number,
  multiplyBy: number
): Decimal => {
  return multiplyMoney(
    divideMoney(new Decimal(to.toString()), new Decimal(from.toString())),
    new Decimal(multiplyBy)
  );
};
