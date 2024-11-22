import { Router} from 'express';
import { getPizzas, getPizzasById, addPizza, updatePizza} from "../controller/pizza.controller";

const router = Router();

router.get("/", getPizzas);
router.get("/:id", getPizzasById);
router.post("/", addPizza);
router.put("/:id", updatePizza);

export default router;
