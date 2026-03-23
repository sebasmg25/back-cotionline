export interface PlanResponse {
  id: string;
  name: string;
  price: number;
  requestLimit: number;
  quotationLimit: number;
  collaboratorLimit: number;
}

export class PlanResponseDto {
  static toDto(plan: any): PlanResponse {
    return {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      requestLimit: plan.requestLimit,
      quotationLimit: plan.quotationLimit,
      collaboratorLimit: plan.collaboratorLimit,
    };
  }
}

export interface PaymentInitializationResponse {
  reference: string;
  amountInCents: number;
  currency: string;
  signature: string;
  publicKey: string;
}
