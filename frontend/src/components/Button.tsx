import { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./Button.css";

interface ButtonProps {
  children: ReactNode;
  to?: string;
  variant?: "primary" | "outline";
  icon?: string;
  onClick?: () => void;
}

const Button = ({ children, to, variant = "primary", icon, onClick }: ButtonProps) => {
  const className = `btn btn--${variant}`;
  const content = (
    <>
      {icon && <img src={icon} alt="" className="btn__icon" />}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  );
};

export default Button;
