import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Pizza {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100 })
    nome!: string;

    @Column("text", { array: true })
    ingredientes!: string[];

    @Column("decimal")
    preco!: number;

    @Column({ default: true })
    disponibilidade!: boolean;
}
