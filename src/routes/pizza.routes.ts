import { Router} from 'express';
import { obterPizzas, obterPizzaId, adicionarPizza, atualizarPizza} from "../controller/pizza.controller";

const router = Router();

router.get("/", obterPizzas);
router.get("/:id", obterPizzaId);
router.post("/", adicionarPizza);
router.put("/:id", atualizarPizza);

export default router;
