// BackEND/src/server.js

require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const studentRoutes = require("./routes/studentRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Conecta ao MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
  })
);
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

// Rota de teste
app.get("/", (req, res) => {
  res.json({
    message: "API rodando!"
  });
});

app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    user: req.user
  });
});

// Rotas
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/instructors", instructorRoutes);
app.use("/courses", courseRoutes);
app.use("/", enrollmentRoutes);
app.use("/", commentRoutes);
app.use("/users", userRoutes);
app.use("/notifications", notificationRoutes);

app.use((err, req, res, next) => {
  console.error("ERRO GLOBAL:", err);

  res.status(500).json({
    message: "Erro interno no servidor",
    error: err.message || err
  });
});

// Só inicia o listen localmente (na Vercel a função é invocada sob demanda)
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;