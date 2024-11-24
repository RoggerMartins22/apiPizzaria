import { Request, Response, RequestHandler} from 'express';
import { AppDataSource } from '../config/data-source';
import { Pedido, StatusPedido } from '../entity/pedidos';
import { Cliente } from '../entity/cliente';
import { Pizza } from '../entity/pizza';

const pedidoRepository = AppDataSource.getRepository(Pedido);
const clienteRepository = AppDataSource.getRepository(Cliente);
const pizzaRepository = AppDataSource.getRepository(Pizza);

export const criarPedido: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
      const { clienteId, pizzaId, quantidade } = req.body;

      const cliente = await AppDataSource.getRepository(Cliente).findOne({ where: { id: clienteId } });
      if (!cliente) {
        res.status(404).json({ message: "Cliente não encontrado" });
        return
      }

      const pizza = await AppDataSource.getRepository(Pizza).findOne({ where: { id: pizzaId } });
      if (!pizza) {
        res.status(404).json({ message: "Pizza não encontrada" });
        return
      }

      const valorTotal = pizza.preco * quantidade;

      const pedido = new Pedido();
      pedido.idCliente = cliente;
      pedido.idPizza = pizza;
      pedido.quantidade = quantidade;
      pedido.valorTotal = valorTotal;
      pedido.status = StatusPedido.PENDENTE;

      await AppDataSource.getRepository(Pedido).save(pedido);
      res.status(201).json({ message: "Pedido criado com sucesso", pedido });
  } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Erro ao criar pedido", detalhes: error.message });
      }
       res.status(500).json({ error: "Erro desconhecido ao criar pedido" });
  }
};


export const obterPedidos: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const pedidos = await pedidoRepository.find({
            relations: ['idCliente', 'idPizza'],
        });

        if (pedidos.length === 0) {
            res.status(404).json({ message: 'Não existem pedidos cadastrados!' });
            return
        }

        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar pedidos', error });
    }
};

export const obterPedidosId: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const pedido = await pedidoRepository.findOne({
            where: { idPedido: Number(id) },
            relations: ['idCliente', 'idPizza'],
        });

        if (!pedido) {
            res.status(404).json({ message: 'Pedido não encontrado' });
            return
        }

        res.json(pedido);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar pedido', error });
    }
};

export const atualizarPedido: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { pizzaId, quantidade } = req.body;

    try {
        const pedido = await pedidoRepository.findOne({
            where: { idPedido: Number(id) },
            relations: ['idPizza'],
        });

        if (!pedido) {
            res.status(404).json({ message: 'Pedido não encontrado' });
            return
        }

        const pizza = await pizzaRepository.findOne({ where: { id: pizzaId } });
        if (!pizza) {
            res.status(404).json({ message: 'Pizza não encontrada' });
            return
        }

        if (!pizza.disponibilidade) {
            res.status(400).json({ message: 'Pizza indisponível no momento' });
            return
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

