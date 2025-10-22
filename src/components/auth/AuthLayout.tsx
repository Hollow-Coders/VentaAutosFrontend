import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      {children}
      <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#666" }}>
        © {new Date().getFullYear()} Mi App
      </p>
    </div>
  );
}
