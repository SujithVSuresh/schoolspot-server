import { Router } from "express";
import { SubscriptionController } from "../controllers/implementation/SubscriptionController";
import PlanRepository from "../repositories/implementaion/PlanRepository";
import { SubscriptionService } from "../services/implementation/SubscriptionService";
import SubscriptionRepository from "../repositories/implementaion/SubscriptionRepository";
import PaymentRepository from "../repositories/implementaion/PaymentRepository";
import express from 'express'


const subscriptionService = new SubscriptionService(PlanRepository, SubscriptionRepository, PaymentRepository)

const subscriptionController = new SubscriptionController(subscriptionService)

const subscriptionWebhookRouter = Router()


subscriptionWebhookRouter.post('/webhook', express.raw({ type: 'application/json' }), subscriptionController.stripeSubscriptionWebhookHandler.bind(subscriptionController));


export default subscriptionWebhookRouter