import { Request, Response, RequestHandler} from "express";
import { AppDataSource } from "../config/data-source";
import { Pizza } from "../entity/pizza";

const pizzaRepository = AppDataSource.getRepository(Pizza);

export const getPizzas = async (req: Request, res: Response) => {
    try {
        const pizzas = await pizzaRepository.find({ where: { disponibilidade: true } });
        
        if (pizzas.length === 0) {
            res.status(404).json({ message: "Não existem pizzas cadastradas ou ativas!" });
            return
        }
        res.json(pizzas);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar pizzas", error });
    }
};

export const getPizzasById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const pizza = await pizzaRepository.findOneBy({ id: Number(id) });
        if (!pizza) {
            res.status(404).json({ message: "Pizza não encontrada" });
            return
        }
        res.json(pizza);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Erro ao buscar pizza", error: error.message });
        } else {
            res.status(500).json({ message: "Erro desconhecido ao buscar pizza" });
        }
    }
};

export const addPizza: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nome, ingredientes, preco, disponibilidade } = req.body;

        if (!nome || !ingredientes || !preco) {
            res.status(400).json({ message: "Nome, ingredientes e preço são obrigatórios." });
            return
        }

        const novaPizza = pizzaRepository.create({
            nome,
            ingredientes,
            preco,
            disponibilidade: disponibilidade !== undefined ? disponibilidade : true,  // Se não passar disponibilidade, assume true
        });

        const resultado = await pizzaRepository.save(novaPizza);
        res.status(201).json({
            message: "Pizza criada com sucesso",
            pizza: resultado,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao adicionar pizza", error: error });
    }
};

export const updatePizza: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const pizza = await pizzaRepository.findOneBy({ id: Number(id) });
        if (!pizza) {
            res.status(404).json({ message: "Pizza não encontrada" });
            return
        }
        pizzaRepository.merge(pizza, req.body);
        const resultado = await pizzaRepository.save(pizza);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar pizza", error });
    }
};