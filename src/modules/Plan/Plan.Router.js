import {Router} from express;
const router = Router();


router.post('/addPlan',Authentication,Authorization("Reasearcher"),validate(PlanSchema.addPlanSchema),PlanController.addPlan);
export default router;
