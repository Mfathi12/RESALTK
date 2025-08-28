import {Router} from "express";
import { Authentication } from "../../MiddleWare/Authentication.js";
import { validate } from "../../MiddleWare/Validation.js";
import * as ServicesController from "./Services.Controller.js";
import * as ServicesSchema from "./Services.Schema.js";
import { Authorization } from "../../MiddleWare/Authorization.js";

const router = Router();

router.post('/RE/:userId/:serviceType',Authentication,ServicesSchema.chooseServiceSchema, ServicesController.AddService);
router.get('/admin',Authentication,Authorization("admin"),ServicesController.GetAllServices)
router.get('/:serviceId',Authentication,ServicesController.GetService)
router.get('/user/:userId/services',Authentication,Authorization("Researcher"),validate(ServicesSchema.GetUserServices),ServicesController.GetUserServices)
router.patch('/admin/assign-provider/:requestId', Authentication, Authorization("admin"),validate(ServicesSchema.AssignProviderByAdmin),ServicesController.AssignProviderByAdmin);
router.get('/admin/:serviceId/specific-providers', Authentication, Authorization("admin"),validate(ServicesSchema.GetSpecificProviders),ServicesController.GetSpecificProviders);
router.post('/provider/:serviceId/:providerId/price',Authentication,Authorization("Service Provider"),validate(ServicesSchema.SetProviderPrice),ServicesController.SetProviderPrice);
router.get('/admin/:requestId/providersAssigned',Authentication,Authorization("admin"),validate(ServicesSchema.GetSpecificProviders),ServicesController.getprovidersAssigned)
router.post('/RE/:userId/select-provider/:requestId', Authentication, Authorization("Researcher"),validate(ServicesSchema.SelectProviderByUser),ServicesController.SelectProviderByUser);
router.get('/provider/:providerId/allRequests',Authentication,Authorization("Service Provider"),validate(ServicesSchema.GetAllProviderRequests),ServicesController.GetAllProviderRequests);
export default router;
