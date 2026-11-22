//src/middlewares/validateMiddleware.js

const { validationResult } = require("express-validator");

const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorList = errors.array();

    return res.status(400).json({
      // Envia apenas a mensagem do primeiro campo inválido na ordem do formulário
      message: errorList[0].msg,
      errors: errorList.map((err) => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  next();
};

module.exports = validateMiddleware;