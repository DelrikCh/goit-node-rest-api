import HttpError from "../helpers/HttpError.js";
import { findUser } from "../services/authServices.js";
import { verifyToken } from "../helpers/jwt.js";

const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    const [bearer, token] = authorization?.split(" ") || [];

    if (bearer !== "Bearer" || !token) {
        return next(HttpError(401, "Not authorized"));
    }

    const { payload, error } = verifyToken(token);
    if (error || !payload?.id) {
        return next(HttpError(401, "Not authorized"));
    }

    const user = await findUser({ id: payload.id });
    if (!user || user.token !== token) {
        return next(HttpError(401, "Not authorized"));
    }

    req.user = user;
    next();
};

export default authenticate;
