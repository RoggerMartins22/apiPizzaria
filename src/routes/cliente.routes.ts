import { Router } from 'express';
import { getClientes, createCliente } from '../controller/cliente.controller';

const router = Router();

router.get('/', getClientes);
router.post('/', createCliente);

export default router;
