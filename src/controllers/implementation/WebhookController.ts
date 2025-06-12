import { IInvoiceService } from "../../services/interface/IInvoiceService";
import { IWebhookController } from "../interface/IWebhookController";
import { NextFunction, Request, Response } from "express";
import HttpStatus from "../../constants/StatusConstants";
import stripe from "../../config/stripe";
import { ISubscriptionService } from "../../services/interface/ISubscriptionService";
import { CustomError } from "../../utils/CustomError";

export class WebhookController implements IWebhookController {
  constructor(
    private _invoiceService: IInvoiceService,
    private _subscriptionService: ISubscriptionService
  ) {}

  async stripeWebhookHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const sig = req.headers["stripe-signature"]!;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

      const eventObject = event.data.object;

      if (
        "metadata" in eventObject &&
        typeof eventObject.metadata === "object"
      ) {
        const metadata = eventObject.metadata as Record<string, string>;
        const type = metadata?.type;

        let response;

        if (type === "fee") {
          response = await this._invoiceService.handleStripeEvent(event);
        } else if (type === "subscription") {
          response = await this._subscriptionService.handleStripeEvent(event);
        } else {
          throw new CustomError("Bad request", HttpStatus.BAD_REQUEST);
        }

        res.status(HttpStatus.OK).json({ result: response });
      }

      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Missing metadata in Stripe event" });
    } catch (err) {
      console.error("Webhook error:", err);
      next(err);
    }
  }
}
