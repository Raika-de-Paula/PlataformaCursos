//src/pages/Home.jsx

import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";

export default function Home() {
  const { user, activeRole } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (activeRole === "student") {
      navigate("/my-courses");
      return;
    }

    if (activeRole === "instructor") {
      navigate("/instructor/courses");
      return;
    }
  }, [user, activeRole, navigate]);

  return <h1>Carregando...</h1>;
}