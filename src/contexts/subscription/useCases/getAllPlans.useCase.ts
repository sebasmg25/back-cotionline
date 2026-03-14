import { PlanRepository } from '../domain/repositories/plan.repository';
import {
  PlanResponse,
  PlanResponseDto,
} from '../interfaces/dtos/subscription.dto';

export class GetAllPlansUseCase {
  constructor(private planRepository: PlanRepository) {}

  async execute(): Promise<PlanResponse[]> {
    const plans = await this.planRepository.findAll();

    // Ordenamos por precio y mapeamos a DTO inmediatamente para proteger la entidad
    return plans
      .sort((a, b) => a.price - b.price)
      .map((plan) => PlanResponseDto.toDto(plan));
  }
}
