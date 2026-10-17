import * as Yup from "yup";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import auth from "../../config/authConfig.js";

class SessionController {
    async store(request, response) {
        const schema = Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        });

        const isValid = await schema.isValid(request.body, { strict: true });

        const emailOuPasswordIncorret = () => {
            return response.status(400).json({ error: "E-mail ou senha incorretos." });
        };

        if (!isValid) {
            return emailOuPasswordIncorret();
        }

        const { email, password } = request.body;

        const existingUser = await User.findOne({
            where: {
                email,
            },
        });
    
        if (!existingUser) {
            return emailOuPasswordIncorret();
        }

        const isPasswordCorrect = await bcrypt.compare(
            password, 
            existingUser.password_hash 
        );

        if (!isPasswordCorrect) {
            return emailOuPasswordIncorret();
        }

        const token = jwt.sign(
            { id: existingUser.id, admin: existingUser.admin, name: existingUser.name },
            auth.secret,
            { expiresIn: auth.expiresIn }
        );

        return response.status(200).json({
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            admin: existingUser.admin,
            token,
        });
    }
}

export default new SessionController();