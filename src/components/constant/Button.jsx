import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  style = {},
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`text-white font-semibold transition-all duration-300 hover:opacity-90 ${className}`}
      style={{
        backgroundColor: "var(--primary-color)",
        ...style,
      }}
    >
      {children}
    </button>
  );
};

export default Button;
