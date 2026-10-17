import Product from "../models/Products.js";
import * as Yup from "yup";
import Category from "../models/Category.js";
import Order from "../schemas/order.js"

class OrderController {
    async store(request, response) {
        const schema = Yup.object({
            products: Yup.array().required().of(Yup.object({
                id: Yup.number().required(),
                quantity: Yup.number().required(),
                }),
            ),
            
        });

        try {
            schema.validateSync(request.body, { abortEarly: false, strict: true });
        } catch (error) {
            return response.status(400).json({ error: error.errors });
        }
        const { userId, userName} = request;
        const { products } = request.body;
        const productIds = products.map((product) => product.id);

        const findedProducts = await Product.findAll({
            where: {
                id: productIds,
            },
            include: {
                model: Category,
                as: "Category",
                attributes: ["name"],
            },
        });

        const mapedProducts = findedProducts.map(product => {
            const clientProduct = products.find((p) => p.id === product.id);
            const newProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                url: product.url,
                category: product.Category.name,
                quantity: clientProduct ? clientProduct.quantity : 0,
            };
            return newProduct;
        });

        const order = {
            user: {
                id: userId,
                name: userName,
                },
            products: mapedProducts,
            status: "Pedido realizado."
            };
        const newOrder = await Order.create(order);

        return response.status(200).json(newOrder);
    }

    async update(request, response) {
        const schema = Yup.object({
            status: Yup.string().required(),
        });

        try {
            schema.validate(request.body, {abortEarly: false, strict: true});
        } catch (error) {
            return response.status(400).json({error: error.errors})
        }

        const { status } = request.body;
        const { id } = request.params;

        try {
            await Order.updateOne({ _id: id }, { status });
        } catch (error) {
            return response.status(400).json({error: error.errors})
        }

        return response.status(200).json({message: "Status alterado com sucesso"});
    }

    async index ( _request, response) {
        const orders = await Order.find();

        return response.status(200).json(orders);
    }
}

export default new OrderController();