import { Hono } from 'hono';
import * as clothesController from '../controllers/clothesController';

const router = new Hono();

router.get('/', clothesController.getAllClothes);
router.post('/', clothesController.createClothes);
router.get('/search', clothesController.searchClothes);
router.put('/:id', clothesController.updatedClothes)
router.put('/:id/addStock', clothesController.addStock);
router.put('/:id/reduce', clothesController.reduceStock);
router.get('/out-of-stock', clothesController.getOutOfStockClothes);
router.get('/low-stock', clothesController.getLowStockClothes);
router.delete('/:id', clothesController.deleteClothes)
export default router;
