import React from "react";

interface IButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<IButtonProps> = (props) => {
  const { onClick, children, disabled } = props;
  const handleClick = () => {
    if (!disabled) onClick();
  };
  return <button onClick={handleClick}>{children}</button>;
};
