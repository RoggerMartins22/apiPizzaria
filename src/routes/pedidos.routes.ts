import { Router } from 'express';
import { criarPedido, obterPedidos, obterPedidosId, atualizarPedido} from '../controller/pedidos.controller';

const router = Router();

router.post('/pedidos', criarPedido);
router.get('/pedidos', obterPedidos);
router.get('/pedidos/:id', obterPedidosId);
router.put('/pedidos/:id', atualizarPedido);

export default router;
