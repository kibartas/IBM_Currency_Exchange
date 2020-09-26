import React, { ReactElement } from "react";

interface IProps {
  result: string;
}

const ResultField: React.FC<IProps> = ({ result }: IProps): ReactElement => {
  return (
    <div className={`label-input ${'result'}`}>
      <span>{result}</span>
    </div>
  );
};

export default ResultField;
