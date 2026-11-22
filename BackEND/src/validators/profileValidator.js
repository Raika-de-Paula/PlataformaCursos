const { body } = require("express-validator");

const profileValidator = [
  body("contacts.email")
    .optional()
    .isEmail()
    .withMessage("Email inválido"),

  body("contacts.phone")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Telefone inválido")
];

module.exports = {
  profileValidator
};