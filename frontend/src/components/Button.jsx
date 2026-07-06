export default function Button({ children, onClick, variant }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: variant === "danger" ? "#ef4444" : "#111",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "999px",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      {children}
    </button>
  );
}