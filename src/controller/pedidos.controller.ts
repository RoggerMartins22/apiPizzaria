import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Pedido, StatusPedido } from '../entity/pedidos';
import { Cliente } from '../entity/cliente';
import { Pizza } from '../entity/pizza';

const pedidoRepository = AppDataSource.getRepository(Pedido);
const clienteRepository = AppDataSource.getRepository(Cliente);
const pizzaRepository = AppDataSource.getRepository(Pizza);

export const criarPedido = async (req: Request, res: Response): Promise<Response> => {
  try {
      const { clienteId, pizzaId, quantidade } = req.body;

      const cliente = await AppDataSource.getRepository(Cliente).findOne({ where: { id: clienteId } });
      if (!cliente) {
          return res.status(404).json({ message: "Cliente não encontrado" });
      }

      const pizza = await AppDataSource.getRepository(Pizza).findOne({ where: { id: pizzaId } });
      if (!pizza) {
          return res.status(404).json({ message: "Pizza não encontrada" });
      }

      const valorTotal = pizza.preco * quantidade;

      const pedido = new Pedido();
      pedido.idCliente = cliente;
      pedido.idPizza = pizza;
      pedido.quantidade = quantidade;
      pedido.valorTotal = valorTotal;
      pedido.status = StatusPedido.PENDENTE;

      await AppDataSource.getRepository(Pedido).save(pedido);
      return res.status(201).json({ message: "Pedido criado com sucesso", pedido });
  } catch (error) {
      if (error instanceof Error) {
          return res.status(500).json({ error: "Erro ao criar pedido", detalhes: error.message });
      }
      return res.status(500).json({ error: "Erro desconhecido ao criar pedido" });
  }
};


export const obterPedidos = async (req: Request, res: Response) => {
    try {
        const pedidos = await pedidoRepository.find({
            relations: ['idCliente', 'idPizza'],
        });

        if (pedidos.length === 0) {
            return res.status(404).json({ message: 'Não existem pedidos cadastrados!' });
        }

        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar pedidos', error });
    }
};

export const obterPedidosId = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const pedido = await pedidoRepository.findOne({
            where: { idPedido: Number(id) },
            relations: ['idCliente', 'idPizza'],
        });

        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar pedido', error });
    }
};

export const atualizarPedido = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { pizzaId, quantidade } = req.body;

    try {
        const pedido = await pedidoRepository.findOne({
            where: { idPedido: Number(id) },
            relations: ['idPizza'],
        });

        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        const pizza = await pizzaRepository.findOne({ where: { id: pizzaId } });
        if (!pizza) {
            return res.status(404).json({ message: 'Pizza não encontrada' });
        }

        if (!pizza.disponibilidade) {
            return res.status(400).json({ message: 'Pizza indisponível no momento' });
        }

        pedido.idPizza = pizza;
        pedido.quantidade = quantidade;
        pedido.valorTotal = pizza.preco * quantidade;

        await pedidoRepository.save(pedido);
        res.json({ message: 'Pedido atualizado com sucesso', pedido });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar pedido', error });
    }
};

