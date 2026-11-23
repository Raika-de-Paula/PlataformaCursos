//src/controllers/userController.js

const User = require("../models/User");
const Course = require("../models/Course");
const InstructorProfile = require("../models/InstructorProfile");
const StudentProfile = require("../models/StudentProfile");
const Enrollment = require("../models/Enrollment");
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
    const { currentPassword, confirmation, role } = req.body;

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
      currentPassword || "",
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(400).json({ message: "Senha atual incorreta" });
    }

    // Define qual conta apagar (se não vier no body, usa a única role que o usuário tiver)
    const targetRole =
      role || (user.roles.length === 1 ? user.roles[0] : null);

    if (!targetRole || !user.roles.includes(targetRole)) {
      return res.status(400).json({
        message: "Tipo de conta inválido ou não vinculado a este usuário."
      });
    }

    if (targetRole === "instructor") {
      // Bloqueia exclusão se houver cursos que ainda não foram finalizados
      const unfinishedCoursesCount = await Course.countDocuments({
        instructorId: req.user.id,
        status: { $ne: "finished" }
      });

      if (unfinishedCoursesCount > 0) {
        return res.status(400).json({
          message:
            "Você só pode apagar sua conta de instrutor quando todos os seus cursos estiverem finalizados."
        });
      }

      // Mantém os cursos finalizados no ar, mas anonimiza o instrutor
      await Course.updateMany(
        { instructorId: req.user.id },
        { $set: { instructorId: null } }
      );

      await InstructorProfile.deleteOne({ userId: req.user.id });
    }

    if (targetRole === "student") {
      await StudentProfile.deleteOne({ userId: req.user.id });
      await Enrollment.deleteMany({ studentId: req.user.id });
    }

    // Remove apenas o papel apagado da lista de roles do usuário
    const remainingRoles = user.roles.filter((r) => r !== targetRole);

    if (remainingRoles.length === 0) {
      // Se não sobrou nenhum outro perfil, apaga o registro principal do usuário
      await User.findByIdAndDelete(req.user.id);
      return res.json({
        message: "Conta apagada com sucesso",
        accountDeletedCompletely: true
      });
    }

    // Se ainda possui o outro perfil (ex: era aluno e instrutor), mantém o usuário com a role restante
    user.roles = remainingRoles;
    await user.save();

    res.json({
      message: `Conta de ${
        targetRole === "instructor" ? "instrutor" : "aluno"
      } apagada com sucesso`,
      accountDeletedCompletely: false,
      remainingRoles
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