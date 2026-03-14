import { Plan } from '../models/plan.model';

export interface PlanRepository {
  findAll(): Promise<Plan[]>;
  findById(id: string): Promise<Plan | null>;
  findByName(name: string): Promise<Plan | null>;
  save(plan: Plan): Promise<Plan>;
}
