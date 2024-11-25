// src/controllers/cliente.controller.ts
import { Request, Response, RequestHandler } from 'express';
import { AppDataSource } from '../config/data-source';
import { Cliente, StatusCliente } from '../entity/cliente';

const clienteRepository = AppDataSource.getRepository(Cliente);

export const addCliente = async (req: Request, res: Response) => {
    const { nome, email, telefone, endereco } = req.body;

    if (!nome || !email || !telefone || !endereco) {
        res.status(400).json({ message: "Por gentileza preencher todos os campos." });
        return
    }

    try {
        const cliente = new Cliente();
        cliente.nome = nome;
        cliente.email = email;
        cliente.telefone = telefone;
        cliente.endereco = endereco;

        await clienteRepository.save(cliente);
        res.status(201).json({ message: 'Cliente criado com sucesso', cliente });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar cliente', error });
    }
};

export const getClientes = async (req: Request, res: Response) => {
    try {
        const cliente = await clienteRepository.find();

        if (cliente.length === 0) {
            res.status(404).json({ message: "Não existem clientes cadastrados ou ativos!" });
            return
        }

        res.json(cliente);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar clientes", error });
    }
};

export const getClientesById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const cliente = await clienteRepository.findOneBy({ id: Number(id) });
        if (!cliente) {
            res.status(404).json({ message: "Cliente não encontrada" });
            return
        }
        res.json(cliente);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Erro ao buscar cliente", error: error.message });
        } else {
            res.status(500).json({ message: "Erro desconhecido ao buscar cliente" });
        }
    }
};

export const updateCliente: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const cliente = await clienteRepository.findOneBy({ id: Number(id) });

        if (!cliente) {
            res.status(404).json({ message: "Cliente não encontrada" });
            return
        }
        
        const { status } = req.body;
        if (status && !Object.values(StatusCliente).includes(status)) {
            res.status(400).json({
                message: `Status inválido. Valores permitidos: A , C`,
            });
            return;
        }

        clienteRepository.merge(cliente, req.body);
        const resultado = await clienteRepository.save(cliente);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar cliente", error });
    }
};