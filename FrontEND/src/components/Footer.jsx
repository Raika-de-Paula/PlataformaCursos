//src/components/Footer.jsx
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} Plataforma de Cursos. Todos os direitos reservados.
      </p>
    </footer>
  );
}