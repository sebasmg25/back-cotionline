import {
  Collaborator,
  InvitationStatus,
} from '../domain/models/collaborator.model';
import { CollaboratorRepository } from '../domain/repositories/collaborator.repository';
import {
  CollaboratorResponse,
  CreateCollaboratorRequest,
} from '../interfaces/dtos/collaborator.dto';
import { EmailService } from '../../shared/infraestructure/email/nodemailer.service';
import { UserRepository } from '../../user/domain/repositories/user.repository';
import { PlanRepository } from '../../subscription/domain/repositories/plan.repository';

export class CreateCollaboratorUseCase {
  constructor(
    private collaboratorRepository: CollaboratorRepository,
    private emailService: EmailService,
    private userRepository: UserRepository,
    private planRepository: PlanRepository,
  ) {}

  async execute(
    data: CreateCollaboratorRequest,
    userIdSession: string,
  ): Promise<CollaboratorResponse> {
    // 1. Validar al dueño y su plan
    const owner = await this.userRepository.findById(userIdSession);
    if (!owner) throw new Error('Usuario (dueño) no encontrado');
    if (!owner.planId) throw new Error('El usuario no tiene un plan asignado');

    const plan = await this.planRepository.findById(owner.planId);
    if (!plan)
      throw new Error('No se pudieron determinar los limites del plan');

    // 2. Validar límite de colaboradores del plan
    const currentCount =
      await this.collaboratorRepository.countByUserId(userIdSession);
    if (currentCount >= plan.collaboratorLimit) {
      throw new Error('Has alcanzado el limite de colaboradores para tu plan');
    }

    // 3. Validar si ya existe el correo (No duplicados)
    const existingCollaborator = await this.collaboratorRepository.findByEmail(
      data.email,
    );
    if (existingCollaborator)
      throw new Error('Ya existe un colaborador con este correo.');

    // 4. Crear e invitar
    const newCollaborator = new Collaborator(
      data.email,
      InvitationStatus.PENDING,
      userIdSession,
      new Date(),
    );
    const saved = await this.collaboratorRepository.save(newCollaborator);

    if (saved.id) {
      await this.emailService.sendInvitationEmail(saved.email, saved.id);
    }

    return {
      id: saved.id!,
      email: saved.email,
      invitationStatus: saved.invitationStatus,
      createdAt: saved.createdAt,
      userId: saved.userId,
    };
  }
}
