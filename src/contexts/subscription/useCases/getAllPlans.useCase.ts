import { PlanRepository } from '../domain/repositories/plan.repository';
import {
  PlanResponse,
  PlanResponseDto,
} from '../interfaces/dtos/subscription.dto';

export class GetAllPlansUseCase {
  constructor(private planRepository: PlanRepository) {}

  async execute(): Promise<PlanResponse[]> {
    const plans = await this.planRepository.findAll();

    return plans
      .sort((a, b) => a.price - b.price)
      .map((plan) => PlanResponseDto.toDto(plan));
  }
}
