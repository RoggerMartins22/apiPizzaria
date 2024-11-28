import { Router } from 'express';
import { adicionarCliente, obterClientes, obterClientesId, atualizarCliente } from '../controller/cliente.controller';

const router = Router();

router.get('/', obterClientes);
router.post('/', adicionarCliente);
router.get('/:id', obterClientesId);
router.put("/:id", atualizarCliente);

export default router;
