import React, { Ref } from "react";

interface IProps {
  register?: Ref<any>;
  name?: string;
}

const CurrencyField: React.FC<IProps> = ({
  register,
  name
}: IProps): React.ReactElement => (
    <input
      name={name}
      ref={register}
      required
      type="text"
      maxLength={16}
      placeholder="f.e. 12.23"
      onKeyPress={(event) => {
        if (!((event.key >= "0" && event.key <= "9") || event.key === ".")) {
          event.preventDefault();
        }
      }}
    />
  );

export default CurrencyField;
