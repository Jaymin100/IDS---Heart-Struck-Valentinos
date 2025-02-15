import React from "react";

// Button component
const Button = ({ label, onClick, disabled = false, style = {} }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "none",
        backgroundColor: disabled ? "#ccc" : "#007bff",
        color: "#fff",
        cursor: disabled ? "not-allowed" : "pointer",
        ...style, // Allow custom styles to override defaults
      }}
    >
      {label}
    </button>
  );
};

export default Button;