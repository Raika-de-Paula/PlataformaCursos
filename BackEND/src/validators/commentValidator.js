const { body } = require("express-validator");

const commentValidator = [
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Comentário não pode estar vazio")
    .isLength({ min: 2, max: 1000 })
    .withMessage("Comentário deve ter entre 2 e 1000 caracteres")
];

module.exports = {
  commentValidator
};