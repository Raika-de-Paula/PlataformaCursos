require("dotenv").config();

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
app.use(cors());
app.use(express.json());


// Rota de teste
app.get("/", (req, res) => {
  res.json({
    message: "API rodando!"
  });
});

app.get(
  "/profile",
  authMiddleware,
  (req, res) => {
    res.json({
      user: req.user
    });
  }
);

// Rotas
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/instructors", instructorRoutes);
app.use("/courses", courseRoutes);
app.use("/", enrollmentRoutes);
app.use("/", commentRoutes);
app.use("/users", userRoutes);
app.use("/notifications", notificationRoutes);

// Inicialização do servidor
const PORT = process.env.PORT || 3000;

app.use((err, req, res, next) => {
  console.error("ERRO GLOBAL:", err);

  res.status(500).json({
    message: "Erro interno no servidor",
    error: err.message || err
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});