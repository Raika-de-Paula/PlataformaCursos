const { body } = require("express-validator");

const createCourseValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Título é obrigatório")
    .isLength({ min: 3, max: 100 })
    .withMessage("Título deve ter entre 3 e 100 caracteres"),

  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Descrição muito grande"),

  body("category")
    .notEmpty()
    .withMessage("Categoria é obrigatória")
];

module.exports = {
  createCourseValidator
};