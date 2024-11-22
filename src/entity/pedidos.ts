// src/entity/Pedido.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Pizza } from './pizza';
import { Cliente } from './cliente';

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
}