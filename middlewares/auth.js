const {validateToken} = require("../services/auth");
function checkForAuthenticationCookie(cookieName) {
    return async(req,res,next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            return next(); 
        }
        try {
            if (tokenCookieValue) {
                const userPayload = await validateToken(tokenCookieValue);
                req.user = userPayload;
            }
        } catch (error) {
            // console.error("Token validation error:", error);
            return res.status(401).json({ error: "Authentication failed" });
        }
        return next();
    }
}

module.exports = {
    checkForAuthenticationCookie,
}