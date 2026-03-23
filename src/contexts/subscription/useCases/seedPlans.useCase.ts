import { Plan, PlanName } from '../domain/models/plan.model';
import { PlanRepository } from '../domain/repositories/plan.repository';
import { v4 as uuidv4 } from 'uuid';

export class SeedPlansUseCase {
  constructor(private planRepository: PlanRepository) {}
  async execute(): Promise<void> {
    const existingPLans = await this.planRepository.findAll();
    if (existingPLans.length > 0) {
      return;
    }
    const plansToCreate = [
      new Plan('c6746529-6f2a-4758-9ce4-96647a8f8ffd', PlanName.FREE, 0, 3, 0, 0),
      new Plan('c2c9636d-053c-4ba9-9941-51dd44271c8c', PlanName.BASIC, 20000, 10, 5, 1),
      new Plan('37879279-47ea-49fb-8c7e-39f48e9b6dcb', PlanName.PREMIUM, 35000, 999999, 999999, 999999),
    ];
    for (const plan of plansToCreate) {
      await this.planRepository.save(plan);
    }
  }
}
