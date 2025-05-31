import { Request, Response, NextFunction } from "express";
import { ISubscriptionService } from "../../services/interface/ISubscriptionService";
import { ISubscriptionController } from "../interface/ISubscriptionController";
import { CreatePlanDTO, UpdatePlanDTO } from "../../dto/SubscriptionDTO";
import HttpStatus from "../../constants/StatusConstants";
import { CustomRequest } from "../../types/types";
import { PayloadType } from "../../types/types";
import stripe from "../../config/stripe";

export class SubscriptionController implements ISubscriptionController {
  constructor(private _subscriptionService: ISubscriptionService) {}

  async createPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;

      const planData: CreatePlanDTO = {
        name: data.name,
        durationInDays: data.durationInDays,
        price: data.price,
      };

      const response = await this._subscriptionService.createPlan(planData);

      res.status(HttpStatus.CREATED).json(response);
    } catch (err) {
      next(err);
    }
  }

  async updatePlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;
      const { planId } = req.params;

      const planData: UpdatePlanDTO = {
        name: data.name,
        durationInDays: data.durationInDays,
        price: data.price,
      };

      const response = await this._subscriptionService.updatePlan(
        planId,
        planData
      );

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async deletePlan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { planId } = req.params;

      const response = await this._subscriptionService.deletePlan(planId);

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async findPlans(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = await this._subscriptionService.findPlans();

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async findPlanById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const {planId} = req.params
      const response = await this._subscriptionService.findPlanById(planId)

      res.status(HttpStatus.OK).json(response)
    }catch(err){
      next(err)
    }
  }

  async findSubscriptionsBySchoolId(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { schoolId } = req.user as PayloadType;

      const response =
        await this._subscriptionService.findSubscriptionsBySchoolId(schoolId);

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async createSubscriptionSession(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("createSubscriptionSession");
      const { schoolId, userId } = req.user as PayloadType;

      const { planId, amount } = req.body;

      console.log("createSubscriptionSession", planId, amount);
      const response =
        await this._subscriptionService.createSubscriptionSession(
          planId,
          amount,
          schoolId,
          userId
        );

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async stripeSubscriptionWebhookHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const sig = req.headers["stripe-signature"]!;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

      const response = this._subscriptionService.handleStripeEvent(event);

      res.status(HttpStatus.OK).json({ invoiceId: response });
    } catch (err) {
      next(err);
    }
  }
}
