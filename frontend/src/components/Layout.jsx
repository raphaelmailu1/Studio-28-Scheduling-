import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.82), rgba(255,255,255,0.82)), url('/images/studio28.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}