import express from 'express';
import { AppDataSource } from './config/data-source';
import pizzaRoutes from './routes/pizza.routes';
import clientesRoutes from './routes/cliente.routes';

const app = express();

// Conectar ao banco de dados
AppDataSource.initialize()
  .then(() => {
    console.log("Banco de dados conectado com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados", error);
  });

// Middleware para ler JSON
app.use(express.json());

// Rotas da API
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/clientes', clientesRoutes);

// Definir a porta da API
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
