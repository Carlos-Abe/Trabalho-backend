const errorHandler = (err, req, res, next) => {
  console.error('🚨 Erro capturado pelo middleware:', err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Erro interno do servidor.',
    details: err.details || null,
  });
};

module.exports = errorHandler;
