import { Router } from 'express';
import { criarPedido, obterPedidos, obterPedidosId, atualizarPedido} from '../controller/pedidos.controller';

const router = Router();

router.post('/', criarPedido);
router.get('/', obterPedidos);
router.get('/:id', obterPedidosId);
router.put('/:id', atualizarPedido);

export default router;
