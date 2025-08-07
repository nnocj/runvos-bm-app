exports.generalHandleErrors = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      console.error(err.stack);
      res.status(500).json({ error: err.message || 'Something went wrong!' });
    }
  };
};
