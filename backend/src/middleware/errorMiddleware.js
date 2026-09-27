export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const isProd = process.env.NODE_ENV === 'production';
  let message = err.message;
  if (isProd && statusCode >= 500) {
    message = 'Internal server error';
  }
  res.status(statusCode).json({
    message,
    stack: isProd ? null : err.stack,
  });
};
