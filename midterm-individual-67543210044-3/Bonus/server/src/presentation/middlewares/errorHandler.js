const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the stack trace

    const status = err.statusCode || 500; // Use statusCode if available
    const message = err.message || 'Something went wrong';

    res.status(status).json({ error: message });
};

module.exports = errorHandler;
