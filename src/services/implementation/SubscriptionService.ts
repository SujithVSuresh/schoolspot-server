import {
  CreatePlanDTO,
  CreateSubscriptionDTO,
  PlanResponseDTO,
  SubscriptionListResponseDTO,
  SubscriptionResponseDTO,
  UpdatePlanDTO,
} from "../../dto/SubscriptionDTO";
import { IPlanRepository } from "../../repositories/interface/IPlanRespository";
import { ISubscriptionRepository } from "../../repositories/interface/ISubscriptionRepository";
import { ISubscriptionService } from "../interface/ISubscriptionService";
import { checkSubscription } from "../../utils/CheckSubscription";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import Stripe from "stripe";
import stripe from "../../config/stripe";
import { IPaymentRepository } from "../../repositories/interface/IPaymentRepository";

export class SubscriptionService implements ISubscriptionService {
  constructor(
    private _planRepository: IPlanRepository,
    private _subscriptionRepository: ISubscriptionRepository,
    private _paymentRepository: IPaymentRepository
  ) {}

  async createPlan(data: CreatePlanDTO): Promise<PlanResponseDTO> {
    const response = await this._planRepository.createPlan(data);

    return {
      _id: String(response._id),
      name: response.name,
      durationInDays: response.durationInDays,
      price: response.price,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  async updatePlan(
    id: string,
    data: UpdatePlanDTO
  ): Promise<PlanResponseDTO | null> {
    const response = await this._planRepository.updatePlan(id, data);

    if (!response) {
      throw new CustomError(Messages.PLAN_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return {
      _id: String(response._id),
      name: response.name,
      durationInDays: response.durationInDays,
      price: response.price,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }

  async findPlans(): Promise<PlanResponseDTO[]> {
    const response = await this._planRepository.findAllPlans();

    return response.map((plan) => ({
      _id: String(plan._id),
      name: plan.name,
      durationInDays: plan.durationInDays,
      price: plan.price,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    }));
  }

  async deletePlan(id: string): Promise<{ _id: string }> {
    const response = await this._planRepository.deletePlan(id);

    if (!response) {
      throw new CustomError(Messages.PLAN_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return {
      _id: id,
    };
  }

  async createSubscription(
    data: CreateSubscriptionDTO
  ): Promise<SubscriptionResponseDTO> {
    const response = await this._subscriptionRepository.createSubscription(
      data
    );

    return {
      _id: String(response._id),
      userId: String(response.userId),
      schoolId: String(response.schoolId),
      planId: String(response.planId),
      planPrice: response.planPrice,
      startDate: response.startDate,
      endDate: response.endDate,
      status: response.status,
      createdAt: response.createdAt as Date,
      updatedAt: response.updatedAt as Date,
    };
  }

  async handleSubscription(schoolId: string): Promise<boolean> {
    const subscription = await this._subscriptionRepository.findSubscription({
      schoolId,
      status: "active",
    });



    const isActive = checkSubscription(String(subscription?.endDate));

    if (isActive) {
      return true;
    }

    const pendingSubscription =
      await this._subscriptionRepository.findSubscription({
        schoolId,
        status: "queued",
      });

    if (pendingSubscription) {
      await this._subscriptionRepository.updateSubscription(
        String(pendingSubscription._id),
        { status: "active" }
      );
           await this._subscriptionRepository.updateSubscription(
        String(subscription?._id),
        { status: "expired" }
      );
      return true;
    }

    return false;
  }

  async findSubscriptionsBySchoolId(
    schoolId: string
  ): Promise<SubscriptionListResponseDTO[]> {
    const response =
      await this._subscriptionRepository.findSubscriptionsBySchoolId(schoolId);

    return response.map((subscription) => ({
      _id: String(subscription._id),
      planId: String(subscription.planId),
      planPrice: subscription.planPrice,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      status: subscription.status,
      updatedAt: subscription.updatedAt as Date,
      createdAt: subscription.createdAt as Date,
    }));
  }

  async createSubscriptionSession(
    planId: string,
    amount: number,
    schoolId: string,
    userId: string
  ): Promise<Stripe.Checkout.Session> {
    const subscription = await this._subscriptionRepository.findSubscription({
      schoolId,
      status: "queued"
    });
    if (subscription) {
      throw new CustomError(
        Messages.SUBSCRIPTION_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST
      );
    }

    const plan = await this._planRepository.findPlanById(planId);

    if(!plan){
        throw new CustomError(Messages.PLAN_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    console.log("createSubscriptionSession123123123", planId, amount);

    const createSubscription = await this._subscriptionRepository.createSubscription({
        userId: userId,
        schoolId: schoolId,
        planId,
        planPrice: amount,
        startDate: new Date(),
        endDate: new Date(Date.now() + plan?.durationInDays * 24 * 60 * 60 * 1000),
        status: "pending"
    })

     console.log("createSubscriptionSession123123123777777777777", createSubscription);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: String(createSubscription._id) },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          subscriptionId: String(createSubscription._id)
        },
      },
      mode: "payment",
      success_url: "http://localhost:5173/profile/subscription",
      cancel_url: "http://localhost:5173/profile/subscription",
    });


    return session;
  }

  async handleStripeEvent(event: Stripe.Event): Promise<string> {
    let paymentId;
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id,
          {
            limit: 1,
          }
        );

        const subscriptionId = lineItems.data[0]?.description;

        const subscription = await this._subscriptionRepository.findSubscriptionById(subscriptionId as string)


        if (!subscription) {
          throw new CustomError(
            Messages.SUBSCRIPTION_NOT_FOUND,
            HttpStatus.NOT_FOUND
          );
        }

        const payment = await this._paymentRepository.createPayment({
          user: subscription.userId,
          paymentFor: "Subscription",
          relatedId: subscription._id ? subscription._id : "",
          amountPaid: session.amount_total as number,
          paymentMethod: "Card",
          transactionId: session.id,
          paymentDate: new Date(),
          status: "Success",
        });

        const checkSubscription = await this._subscriptionRepository.findSubscription({
            schoolId: String(subscription.schoolId),
            status: "active",
        })


        await this._subscriptionRepository.updateSubscription(
            String(subscription._id),
            {
                status: checkSubscription?.status == "active" ? "queued" : "active"
            }
        )

        paymentId = payment._id;
        break;
      }
      case "checkout.session.async_payment_failed":
      case "checkout.session.expired":
      case "payment_intent.payment_failed": {
        const session = event.data.object as
          | Stripe.Checkout.Session
          | Stripe.PaymentIntent;
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const subscriptionId = paymentIntent.metadata.subscriptionId;

        const subscription = await this._subscriptionRepository.findSubscriptionById(
          subscriptionId as string
        );

        if (!subscription) {
          throw new CustomError(
            Messages.INVOICE_NOT_FOUND,
            HttpStatus.NOT_FOUND
          );
        }

        const payment = await this._paymentRepository.createPayment({
          user: subscription.userId,
          paymentFor: "Subscription",
          relatedId: subscription._id ? subscription._id : "",
          amountPaid: subscription.planPrice,
          paymentMethod: "Card",
          transactionId: session.id,
          paymentDate: new Date(),
          status: "Failed",
        });
        paymentId = payment._id;

        await this._subscriptionRepository.deleteSubscription(subscription._id as string);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return "completed";
  }
}
