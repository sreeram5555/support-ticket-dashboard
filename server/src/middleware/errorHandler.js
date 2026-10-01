const errorHandler = (err, req, res, next) => {
  console.error('Global Error Handler:', err);
  
  res.status(500).json({
    success: false,
    error: {
      code: 500,
      message: 'Internal server error',
      details: []
    }
  });
};

module.exports = errorHandler;
