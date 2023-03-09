const express = require("express");
const reviewController = require("../controllers/review");
const router = express.Router();

router.get('/:songId', reviewController.getReviewBySongId);
router.post('/', reviewController.createNewReview)
router.post('/children', reviewController.createReviewChildren)
router.delete('/children/:childrenId', reviewController.deleteReviewChildren)
router.put('/children/:childrenId/status', reviewController.updateReviewChildrenStatus)
router.put('/children/:reviewId', reviewController.updateUserReviewChildren)
router.put('/:reviewId/status', reviewController.changeReviewStatus)
router.delete('/:reviewId', reviewController.deleteReviewData)
router.put('/:reviewId', reviewController.updateUserReview)
router.get('/', reviewController.getAllReview)

module.exports = router;