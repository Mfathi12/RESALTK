import {Router} from "express";
import * as EventsAndNewsSchema from "./EventsAndNews.Schema.js";
import * as EventsAndNewsController from "./EventsAndNews.Controller.js";
import {Authorization} from "../../MiddleWare/Authorization.js";
import {Authentication} from "../../MiddleWare/Authentication.js";
import {validate} from "../../MiddleWare/Validation.js";
const router=Router();

router.post('/addEvent/:teamId',Authentication,Authorization("Researcher"),validate(EventsAndNewsSchema.addEventSchema),EventsAndNewsController.addEvent);
router.post('/addNews',Authentication,Authorization("admin"),validate(EventsAndNewsSchema.addNewsSchema),EventsAndNewsController.addNews);
router.get('/getAllEvents',Authentication,Authorization("Researcher"),EventsAndNewsController.getAllEvents);
router.get('/getAllNews',Authentication,Authorization("Researcher","admin","Service Provider","company"),EventsAndNewsController.getAllNews);
router.get('/:eventId',Authentication,Authorization("Researcher"),validate(EventsAndNewsSchema.getEventSchema),EventsAndNewsController.getEvent);
router.patch('/:newId',Authentication,Authorization("admin"),validate(EventsAndNewsSchema.updateNewSchema),EventsAndNewsController.updateNew);

export default router;