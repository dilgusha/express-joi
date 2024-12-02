const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);

    if (err.isJoi) {
        return res.status(400).json({
            message: 'Validation error',
            details: err.details.map(detail => detail.message),
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation error',
            details: Object.values(err.errors).map(e => e.message),
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    res.status(500).json({
        message: 'Internal server error',
        error: err.message || err,
    });
};

export default errorMiddleware;
