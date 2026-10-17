import jwt from "jsonwebtoken";
import authConfig from "../../config/authConfig.js";

const authMiddleware = (request, response, next) => {
    const authToken = request.headers.authorization;

    if (!authToken) {
        return response.status(401).json({ error: "Erro de token. ATUALIZE" });
    }

    const token = authToken.split(" ")[1];

    jwt.verify(token, authConfig.secret, (error, decoded) => {
        if (error) {
            return response.status(401).json({ error: "Token inválido" });
        }

        request.userId = decoded.id;
        request.userName = decoded.name;
        request.userIsAdmin = decoded.admin;

        return next();
    });
};

export default authMiddleware;