import * as Yup from "yup";
import Category from "./../models/Category.js";
import { Op } from "sequelize"; // <-- Important para usar operadores como [Op.ne]

class CategoryController {
    async store(request, response) {
        const schema = Yup.object({
            name: Yup.string().required("O nome da categoria é obrigatório."),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (erro) {
            return response.status(400).json({ error: erro.errors });
        }

        const name = request.body.name.toLowerCase().trim();
        
        if (!request.file) {
            return response.status(400).json({ error: "A imagem da categoria é obrigatória." });
        }

        const { filename } = request.file;

        const existingCategory = await Category.findOne({
            where: { name },
        });

        if (existingCategory) {
            return response.status(400).json({ error: "Essa categoria já foi criada." });
        }

        try {
            const newCategory = await Category.create({
                name,
                path: filename,
            });

            return response.status(201).json(newCategory); // Status 201 Created é o padrão para criação
        } catch (error) {
            console.error("ERRO NO POSTGRESQL (Category Store):", error.original?.detail || error.message);
            return response.status(500).json({ error: "Erro interno ao criar a categoria." });
        }
    }

    async update(request, response) {
        const schema = Yup.object({
            name: Yup.string(),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (erro) {
            return response.status(400).json({ error: erro.errors });
        }

        const { id } = request.params;
        
        // Verifica se a categoria existe antes de atualizar
        const category = await Category.findByPk(id);
        if (!category) {
            return response.status(404).json({ error: "Categoria não encontrada." });
        }

        let name = category.name;
        if (request.body.name) {
            name = request.body.name.toLowerCase().trim();
            
            // Garante que o nome não pertence a OUTRA categoria já cadastrada
            const existingCategory = await Category.findOne({
                where: { 
                    name,
                    id: { [Op.ne]: id } // Ignora o ID atual na busca por duplicados
                },
            });

            if (existingCategory) {
                return response.status(400).json({ error: "Já existe outra categoria com esse nome." });
            }
        }

        let path = category.path;
        if (request.file) {
            path = request.file.filename;
        }      

        try {
            await Category.update(
                { name, path }, 
                { where: { id } }
            );

            // Busca atualizada para retornar o objeto correto
            const updatedCategory = await Category.findByPk(id);

            return response.status(200).json(updatedCategory);
        } catch (error) {
            console.error("ERRO NO POSTGRESQL (Category Update):", error.original?.detail || error.message);
            return response.status(500).json({ error: "Erro interno ao atualizar a categoria." });
        }
    }

    async index(request, response) {
        const categories = await Category.findAll();
        return response.status(200).json(categories);
    }
}

export default new CategoryController();