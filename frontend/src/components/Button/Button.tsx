import React, {ReactElement} from 'react';

interface IProps {
  type?: "button" | "submit" | "reset" | undefined;
  text: string;
}

const Button: React.FC<IProps> = ({type, text}: IProps): ReactElement => {
  return (
    <button type={type}>{text}</button>
  );
};

export default Button;
