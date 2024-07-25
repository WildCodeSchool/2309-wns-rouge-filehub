import { Resolver, Mutation, Ctx, Authorized } from "type-graphql";
import { stripe } from "../stripe";
import { ContextType } from "../auth";

@Resolver()
export class PaymentResolver {
  @Authorized()
  @Mutation(() => String)
  async createCheckoutSession(@Ctx() context: ContextType): Promise<String> {
    const stripeCustomerId = context?.user?.stripeCustomerId;
    try {
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: "subscription",
        payment_method_types: ["card", "link"],
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        success_url: `${process.env.FRONT_ADRESS}/userProfilePage`,
        cancel_url: `${process.env.FRONT_ADRESS}/userProfilePage`,
      });
      if (!session.url) {
        throw new Error("Failed to create checkout session");
      }
      return session.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw new Error("Error creating checkout session");
    }
  }

  @Authorized()
  @Mutation(() => String)
  async createSettingSession(@Ctx() context: ContextType): Promise<String> {
    const stripeCustomerId = context?.user?.stripeCustomerId;
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId ?? "",
        return_url: `${process.env.FRONT_ADRESS}/userProfilePage`,
      });
      if (!session.url) {
        throw new Error("Failed to create setting session");
      }
      return session.url;
    } catch (error) {
      console.error("Error creating setting session:", error);
      throw new Error("Error creating setting session");
    }
  }
}
