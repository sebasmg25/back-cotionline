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
      new Plan(uuidv4(), PlanName.FREE, 0, 3, 0, 0),
      new Plan(uuidv4(), PlanName.BASIC, 20000, 10, 5, 1),
      new Plan(uuidv4(), PlanName.PREMIUM, 35000, 999999, 999999, 999999),
    ];
    for (const plan of plansToCreate) {
      await this.planRepository.save(plan);
    }
  }
}
