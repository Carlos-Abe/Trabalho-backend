module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const formattedErrors = error.details.map((d) => d.message);
      return res.status(400).json({
        success: false,
        message: 'Falha na validação dos dados.',
        details: formattedErrors,
      });
    }

    next();
  };
};
