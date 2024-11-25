import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm";
import { Pedido } from './pedidos';

export enum StatusCliente {
    ATIVO = "A",
    CANCELADO = "C",
}

@Entity()
export class Cliente {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    nome!: string;

    @Column({ type: "varchar", length: 100 })
    email!: string;

    @Column({ type: "varchar", length: 100 })
    telefone!: string;

    @Column("text", { array: true })
    endereco!: string[];

    @Column({
        type: "enum",
        enum: StatusCliente,
        default: StatusCliente.ATIVO,
    })
    status!: StatusCliente;

    @OneToMany(() => Pedido, pedido => pedido.idCliente)
    pedidos!: Pedido[];
}
