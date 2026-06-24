//src/validators/authValidator.js

const { body } = require("express-validator");

const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ min: 3 })
    .withMessage("Nome deve ter pelo menos 3 caracteres"),

  body("cpf")
    .notEmpty()
    .withMessage("CPF é obrigatório")
    .isLength({ min: 11, max: 11 })
    .withMessage("CPF deve ter 11 caracteres"),

  body("birthDate")
    .notEmpty()
    .withMessage("Data de nascimento é obrigatória")
    .isISO8601()
    .withMessage("Data de nascimento inválida"),

  body("phone")
    .notEmpty()
    .withMessage("Telefone é obrigatório"),

  body("email")
    .notEmpty()
    .withMessage("Email é obrigatório")
    .isEmail()
    .withMessage("Email inválido"),

  body("password")
    .notEmpty()
    .withMessage("Senha é obrigatória")
    .isLength({ min: 6 })
    .withMessage("Senha deve ter pelo menos 6 caracteres"),

  body("roles")
    .optional()
    .isArray()
    .withMessage("Roles deve ser um array")
];

const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email é obrigatório")
    .isEmail()
    .withMessage("Email inválido"),

  body("password")
    .notEmpty()
    .withMessage("Senha é obrigatória")
];

module.exports = {
  registerValidator,
  loginValidator
};