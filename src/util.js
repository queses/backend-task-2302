// A decorator for an Express handler which sends errors to "next" to handle them:
const asyncHandler = handler => (req, res, next) => {
    const result = handler(req, res, next)
    return Promise.resolve(result).catch(next)
}

module.exports = { asyncHandler }
