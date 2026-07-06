import { theme } from "../styles/theme";

export default function Card({ children }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.93)",
        backdropFilter: "blur(8px)",
        padding: "24px",
        borderRadius: "20px",
        marginBottom: "20px",
        border: `1px solid ${theme.colors.border}`,
        boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
      }}
    >
      {children}
    </div>
  );
}