// src/App.jsx

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import { NotificationProvider } from "./contexts/NotificationContext";
import "./styles/App.css";

export default function App() {
  return (
    <NotificationProvider>
      <div className="app-layout">
        <Navbar />

        <main className="app-content">
          <AppRoutes />
        </main>

        <Footer />
      </div>
    </NotificationProvider>
  );
}