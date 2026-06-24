//src/controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const {
      name,
      cpf,
      birthDate,
      phone,
      email,
      password,
      roles
    } = req.body;

    const existingUser = await User.findOne({
      $or: [
        { email },
        { cpf }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email ou CPF já cadastrado"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      cpf,
      birthDate,
      phone,
      email,
      passwordHash,
      roles
    });

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email ou senha inválidos"
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Email ou senha inválidos"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        roles: user.roles
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  register,
  login
};