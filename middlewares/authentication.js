const { validateToken } = require('../services/auth');
function checkforAuthCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];  // Fixed typo

        // If no cookie is found, proceed to the next middleware
        if (!tokenCookieValue) {
            return next();
        }

        try {
            // Assuming validateToken verifies the token and returns user payload
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;  // Attach the user payload to req.user if valid
        } catch (error) {
            console.error('Token validation failed:', error);  // Log the error for debugging
            // You can also clear the invalid token if needed, e.g.:
            // res.clearCookie(cookieName);
        }

        // Always call next() to continue the request cycle
        return next();
    };
}

module.exports = {
    checkforAuthCookie,
};
