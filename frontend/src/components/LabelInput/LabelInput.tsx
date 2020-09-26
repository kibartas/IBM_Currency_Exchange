import React, {ReactElement, ReactNode} from 'react';

interface IProps {
  children: ReactNode;
  labelText: string;
}

const LabelInput: React.FC<IProps> = ({ children, labelText }: IProps): ReactElement => {
  return (
    <div className="label-input">
      <label>{labelText}</label>
      {children}
    </div>
  );
};

export default LabelInput;
