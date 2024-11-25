import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../config/data-source";
import { Pedido, StatusPedido } from "../entity/pedidos";
import { Cliente } from "../entity/cliente";
import { Pizza } from "../entity/pizza";

const pedidoRepository = AppDataSource.getRepository(Pedido);
const clienteRepository = AppDataSource.getRepository(Cliente);
const pizzaRepository = AppDataSource.getRepository(Pizza);

const validarCliente = async (idCliente: number) => {
  return await clienteRepository.findOne({ where: { id: idCliente } });
};
const validarPizza = async (idPizza: number) => {
  return await pizzaRepository.findOne({ where: { id: idPizza } });
};

export const criarPedido: RequestHandler = async (req, res) => {
  try {
    const { idCliente, idPizza, quantidade } = req.body;

    if (!idCliente || !idPizza || !quantidade) {
      res.status(400).json({ message: "Dados insuficientes para criar o pedido" });
      return;
    }

    if (quantidade <= 0) {
      res.status(400).json({ message: "A quantidade deve ser maior que zero" });
      return;
    }

    const cliente = await validarCliente(idCliente);
    
    if (!cliente) {
      res.status(404).json({ message: "Cliente não encontrado" });
      return;
    }

    const pizza = await validarPizza(idPizza);
    if (!pizza) {
      res.status(404).json({ message: "Pizza não encontrada" });
      return;
    }

    if (!pizza.disponibilidade) {
      res.status(400).json({ message: "Pizza indisponível no momento" });
      return;
    }

    const valorTotal = pizza.preco * quantidade;

    const pedido = pedidoRepository.create({
      idCliente: cliente,
      idPizza: pizza,
      quantidade,
      valorTotal,
      status: StatusPedido.PENDENTE,
    });

    await pedidoRepository.save(pedido);

    res.status(201).json({ message: "Pedido criado com sucesso", pedido });
  } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Erro ao criar pedido", detalhes: error.message });
      } else {
        res.status(500).json({ error: "Erro desconhecido ao criar pedido" });
      }
    }
};

export const obterPedidos: RequestHandler = async (_req, res) => {
  try {
    const pedidos = await pedidoRepository.find({
      relations: ["idCliente", "idPizza"],
    });

    if (pedidos.length === 0) {
      res.status(404).json({ message: "Não existem pedidos cadastrados!" });
      return;
    }
    res.json(pedidos);
  } catch (error) {
        res.status(500).json({ message: 'Erro ao listar pedidos', error });
	}
};

export const obterPedidosId: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const pedido = await pedidoRepository.findOne({
      where: { idPedido: Number(id) },
      relations: ["idCliente", "idPizza"],
    });

    if (!pedido) {
      res.status(404).json({ message: "Pedido não encontrado" });
      return;
    }
    res.json(pedido);
  } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar pedido', error });
    }
};

export const atualizarPedido: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { idCliente, idPizza, quantidade, status } = req.body;

  try {
    const mapaStatus = {
      [StatusPedido.PENDENTE]: "Pendente",
      [StatusPedido.CONFIRMADO]: "Confirmado",
      [StatusPedido.EM_PREPARACAO]: "Em Preparação",
      [StatusPedido.A_CAMINHO]: "A Caminho",
      [StatusPedido.ENTREGUE]: "Entregue",
      [StatusPedido.CANCELADO]: "Cancelado",
    };

    const statusValidos = Object.keys(mapaStatus);
    if (status && !statusValidos.includes(status)) {
      res.status(400).json({
        message: "Status inválido. Status aceitos:",
        statusValidos: Object.entries(mapaStatus).map(([key, value]) => `${key} - ${value}`),
      });
      return;
    }

    const pedido = await pedidoRepository.findOne({
      where: { idPedido: Number(id) },
      relations: ["idCliente", "idPizza"],
    });

    if (!pedido) {
      res.status(404).json({ message: "Pedido não encontrado" });
      return;
    }

    if (idCliente && idCliente !== pedido.idCliente.id) {
      res.status(400).json({
        message: "Não é permitido alterar o cliente.",
      });
      return;
    }

    if (quantidade !== undefined) {
      if (quantidade <= 0) {
        res.status(400).json({ message: "Quantidade deve ser maior que zero" });
        return;
      }
      pedido.quantidade = quantidade;
      pedido.valorTotal = pedido.idPizza.preco * quantidade;
    }

    if (idPizza) {
      const pizza = await validarPizza(idPizza);
      
      if (!pizza) {
        res.status(404).json({ message: "Pizza não encontrada" });
        return;
      }
      
      if (!pizza.disponibilidade) {
        res.status(400).json({ message: "Pizza indisponível no momento" });
        return;
      }
      pedido.idPizza = pizza;
    }

    if (status) {
      pedido.status = status;
    }

    pedido.status = status || pedido.status;

    await pedidoRepository.save(pedido);

    res.status(200).json({ message: "Pedido atualizado com sucesso", pedido });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar pedido",
      detalhes: error instanceof Error ? error.message : error,
    });
  }
};