import bcrypt from "bcrypt"
import User from "../models/User.js";
import * as Yup from "yup"
import { v4 } from 'uuid';

class UserController {
    async store(request, response) {
        /*console.log("REQUEST", request);*/
        const schema = Yup.object({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().min(12).required(),
            admin: Yup.boolean(),
        })

        try {
            schema.validateSync(request.body, {abortEarly: false, strict: true});
        } catch (erro) {
            console.log(erro);
            return response.status(400).json({error: erro.errors});
        }

        const { name, email, password, admin} = request.body;

        const existingUser = await User.findOne({
            where: {
                email,
            },
        });
        if (existingUser) {
            return response.status(400).json({
                message: "Este e-mail já foi cadastrado no sistema."
            })
        }

        const existingName = await User.findOne({
            where: {
                name,
            },
        });

        if (existingName) {
            return response.status(401).json({
                Message: "Este nome já está cadastrado no sistema."
            })
        }

        const password_hash = await bcrypt.hash(password, 12);

        const user = await User.create({
            id: v4(),
            name,
            email,
            password_hash,
            admin,
    });

    return response.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
    });
    }
}

export default new UserController;