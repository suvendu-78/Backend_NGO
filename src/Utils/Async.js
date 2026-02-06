const Async = (fn) => async (req, res, next) => {
  try {
    const data = await fn(req, res, next);
    return data;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export default Async;
