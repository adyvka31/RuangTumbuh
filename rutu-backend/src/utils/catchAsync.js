const catchAsync = (fn) => {
  return (req, res, next) => {
    // Jalankan fungsi asinkron, jika error, lempar ke error.middleware.js via next()
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

module.exports = catchAsync;