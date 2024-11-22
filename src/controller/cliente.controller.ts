// src/controllers/cliente.controller.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Cliente } from '../entity/cliente';

const clienteRepository = AppDataSource.getRepository(Cliente);

export const createCliente = async (req: Request, res: Response) => {
    const { nome, email, telefone, endereco } = req.body;

    try {
        const cliente = new Cliente();
        cliente.nome = nome;
        cliente.email = email;
        cliente.telefone = telefone;
        cliente.endereco = endereco;

        // Salvando o novo cliente no banco de dados
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
