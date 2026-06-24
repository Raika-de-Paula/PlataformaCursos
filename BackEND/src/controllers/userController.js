//src/controllers/userController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");

const updateEmail = async (req, res) => {
  try {
    const { newEmail, currentPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(400).json({ message: "Senha atual incorreta" });
    }

    const emailAlreadyExists = await User.findOne({
      email: newEmail,
      _id: { $ne: req.user.id }
    });

    if (emailAlreadyExists) {
      return res.status(400).json({ message: "Email já está em uso" });
    }

    user.email = newEmail;
    await user.save();

    res.json({
      message: "Email atualizado com sucesso",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(400).json({ message: "Senha atual incorreta" });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({
      message: "Senha atualizada com sucesso"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMyAccount = async (req, res) => {
  try {
    const { currentPassword, confirmation } = req.body;

    if (confirmation !== "APAGAR CONTA") {
      return res.status(400).json({
        message: "Confirmação inválida"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(400).json({ message: "Senha atual incorreta" });
    }

    await User.findByIdAndDelete(req.user.id);

    res.json({
      message: "Conta apagada com sucesso"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNotificationPreference = async (req, res) => {
  try {
    const { notificationsEnabled } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        notificationsEnabled
      },
      {
        returnDocument: "after"
      }
    ).select("name email roles notificationsEnabled");

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado"
      });
    }

    res.json({
      message: "Preferência de notificações atualizada",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        notificationsEnabled: user.notificationsEnabled
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateEmail,
  updatePassword,
  deleteMyAccount,
  updateNotificationPreference
};