// src/entity/Pedido.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Pizza } from './pizza';
import { Cliente } from './cliente';

export enum StatusPedido {
    PENDENTE = "PN",
    CONFIRMADO = "CC",
    EM_PREPARACAO = "EP",
    A_CAMINHO = "AC",
    ENTREGUE = "EN",
    CANCELADO = "CN"
}


@Entity()
export class Pedido {
    @PrimaryGeneratedColumn()
    idPedido!: number;

    @ManyToOne(() => Pizza)
    idPizza!: Pizza;

    @ManyToOne(() => Cliente, cliente => cliente.pedidos)
    idCliente!: Cliente;

    @Column()
    quantidade!: number;

    @Column('decimal')
    valorTotal!: number;
    pizzas: any;
    total: any;

    @Column({
        type: "enum",
        enum: StatusPedido,
        default: StatusPedido.PENDENTE,
    })
    status!: StatusPedido;
}