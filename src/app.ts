import express from 'express';
import { AppDataSource } from './config/data-source';
import pizzaRoutes from './routes/pizza.routes';
import clientesRoutes from './routes/cliente.routes';
import pedidosRoutes from './routes/pedidos.routes';

const app = express();

AppDataSource.initialize()
  .then(() => {
    console.log("Banco de dados conectado com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados", error);
  });

app.use(express.json());

app.use('/pizzas', pizzaRoutes);
app.use('/clientes', clientesRoutes);
app.use('/pedidos', pedidosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
