import {Router} from "express";
import { Authentication } from "../../MiddleWare/Authentication.js";
import { validate } from "../../MiddleWare/Validation.js";
import * as ServicesController from "./Services.Controller.js";
import * as ServicesSchema from "./Services.Schema.js";
import { Authorization } from "../../MiddleWare/Authorization.js";

const router = Router();
router.post('/RE/select-provider/:requestId', Authentication, Authorization("Researcher"), ServicesController.SelectProviderByUser);
router.post('/RE/:serviceType',Authentication,Authorization("Researcher"),ServicesSchema.chooseServiceSchema, ServicesController.AddService);
router.post('/RE/:teamId/:serviceType',Authentication,Authorization("Researcher"),ServicesSchema.chooseServiceSchema, ServicesController.AddService);
router.get('/admin',Authentication,Authorization("admin"),validate(ServicesSchema.validateStatus),ServicesController.GetServicesByAdmin)
router.get('/RE/Services',Authentication,Authorization("Researcher"),ServicesController.GetUserServices)
router.get('/RE/:teamId/Services',Authentication,Authorization("Researcher"),validate(ServicesSchema.GetTeamServices), ServicesController.GetUserServices);
router.get('/:serviceId',Authentication,validate(ServicesSchema.getSpecificService), ServicesController.GetService)
router.get('/admin/providers', Authentication, Authorization("admin"),ServicesController.GetProviders);
router.patch('/admin/assign-provider/:requestId', Authentication, Authorization("admin"),validate(ServicesSchema.AssignProviderByAdmin),ServicesController.AssignProviderByAdmin);
router.post('/provider/:requestId/:providerId/price',Authentication,Authorization("Service Provider"),validate(ServicesSchema.SetProviderPrice),ServicesController.SetProviderPrice);
router.get('/RE/:serviceId/providersAssigned',Authentication,Authorization("Researcher"),validate(ServicesSchema.getprovidersAssigned),ServicesController.getprovidersAssigned)
router.get('/provider/:providerId/allRequests',Authentication,Authorization("Service Provider"),validate(ServicesSchema.GetAllProviderRequests),ServicesController.GetAllProviderRequests);
 
export default router;
    