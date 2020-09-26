import React, {ChangeEvent, ReactElement} from "react";

interface IProps {
  register?: any;
  name: string;
  currencies: string[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}

const CurrencySelect: React.FC<IProps> = ({
  register,
  name,
  currencies,
  onChange,
  value
}: IProps): ReactElement => {
  return (
    <select
      ref={register}
      name={name}
      required
      onChange={onChange}
      value={value}
    >
      {currencies.length !== 0 &&
        currencies.map((currency, index) => (
          <option key={index} value={currency}>
            {currency}
          </option>
        ))}
    </select>
  );
};

export default CurrencySelect;
