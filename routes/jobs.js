const router = require('express').Router();
const jobsController = require('../controllers/jobs');
const verifyAuthMiddleware = require('../middleware/verify-auth');

router.use(verifyAuthMiddleware);

router.route('/').get(jobsController.getAllJobs).post(jobsController.createJob);
router
  .route('/:jobId')
  .get(jobsController.getJob)
  .patch(jobsController.updateJob)
  .delete(jobsController.deleteJob);

module.exports = router;
