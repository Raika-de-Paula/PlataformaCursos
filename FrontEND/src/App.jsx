//src/App.jsx

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import "./styles/App.css";

export default function App() {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-content">
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
}