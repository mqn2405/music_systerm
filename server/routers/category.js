const express =  require('express');
const categoryController = require('../controllers/category');
const router = express.Router();

router.get('/', categoryController.getAllCategory);
router.post('/', categoryController.createCategoty);
router.put('/:categoryId', categoryController.updateCategoty);
router.delete('/:categoryId', categoryController.deleteCategoty);
router.get("/song/popular", categoryController.getCategorySong);
router.get('/:categoryId', categoryController.getCategoryDetail);

module.exports = router;