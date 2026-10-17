import * as Yup from "yup";
import Product from "./../models/Products.js";
import Category from "../models/Category.js";

class ProductController {
    async store(request, response) {
        const schema = Yup.object({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number().required(),
            offer: Yup.boolean(),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (error) {
            return response.status(400).json({ error: error.errors });
        }
        
        const name = request.body.name;
        const price = Number(request.body.price);
        const category_id = Number(request.body.category_id);
        const offer = Boolean(request.body.offer)

        const categoryExists = await Category.findByPk(category_id);

        if (!categoryExists) {
            return response.status(400).json({ 
                error: "A categoria informada não existe. Cadastre uma categoria antes de criar o produto." 
            });
        }

        const productExists = await Product.findOne({
            where: { name },
        });

        if (productExists) {
            return response.status(400).json({ error: "Já existe um produto cadastrado com esse nome." });
        }

        if (!request.file) {
            return response.status(400).json({ error: "A imagem do produto é obrigatória." });
        }

        const { filename } = request.file;

        try {
            const newProduct = await Product.create({
                name,
                price,
                category_id,
                path: filename,
                offer,
            });

            return response.status(201).json(newProduct);
        } catch (error) {
            console.error("ERRO REAL DO POSTGRESQL:", error.original?.detail || error.message);
            return response.status(500).json({ error: "Erro interno ao salvar o produto no banco de dados." });
        }
    }

    async update(request, response) {
        const schema = Yup.object({
            name: Yup.string(),
            price: Yup.number(),
            category_id: Yup.number(),
            offer: Yup.boolean(),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (error) {
            return response.status(400).json({ error: error.errors });
        }
        
        const { name, price, category_id, offer } = request.body;
        const { id } = request.params;

        let path;
        if (request.file) {
            const { filename } = request.file;
            path = filename;
        }
      
        await Product.update(
            {
            name,
            price,
            category_id,
            path,
            offer,
            }, {
                where: { id },
            },
        );
        // Busca o produto atualizado para retornar ao cliente com a categoria
        const updatedProduct = await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: "Category",
                    attributes: ["id", "name"],
                },
            ],
        });
        return response.status(200).json(updatedProduct);
    }

    async index(_request, response) {
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    as: "Category",
                    attributes: ["id", "name"],
                },
            ],
        });
        return response.status(200).json(products);
    }
}

export default new ProductController();