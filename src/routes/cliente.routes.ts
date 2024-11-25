import { Router } from 'express';
import { getClientes, addCliente, getClientesById,updateCliente } from '../controller/cliente.controller';

const router = Router();

router.get('/', getClientes);
router.post('/', addCliente);
router.get('/:id', getClientesById);
router.put("/:id", updateCliente);

export default router;
