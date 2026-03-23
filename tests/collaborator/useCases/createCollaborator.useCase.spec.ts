import { CreateCollaboratorUseCase } from '../../../src/contexts/collaborator/useCases/createCollaborator.useCase';

describe('CreateCollaboratorUseCase', () => {
  let useCase: CreateCollaboratorUseCase;
  let mockCollabRepo: any, mockEmail: any, mockUserRepo: any, mockPlanRepo: any;

  beforeEach(() => {
    mockCollabRepo = { countByUserId: jest.fn(), findByEmail: jest.fn(), save: jest.fn() };
    mockEmail = { sendInvitationEmail: jest.fn() };
    mockUserRepo = { findById: jest.fn() };
    mockPlanRepo = { findById: jest.fn() };
    useCase = new CreateCollaboratorUseCase(mockCollabRepo, mockEmail, mockUserRepo, mockPlanRepo);
  });

  it('should throw if owner is not found', async () => {
    mockUserRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute({ email: 'test@mail.com' }, 'user-1')).rejects.toThrow('Usuario (dueño) no encontrado');
  });

  it('should throw if owner has no planId', async () => {
    mockUserRepo.findById.mockResolvedValue({ id: 'user-1' });
    await expect(useCase.execute({ email: 'test@mail.com' }, 'user-1')).rejects.toThrow('El usuario no tiene un plan asignado');
  });

  it('should throw if plan is not found', async () => {
    mockUserRepo.findById.mockResolvedValue({ id: 'user-1', planId: 'plan-1' });
    mockPlanRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute({ email: 'test@mail.com' }, 'user-1')).rejects.toThrow('No se pudieron determinar los limites del plan');
  });

  it('should throw if limit reached', async () => {
    mockUserRepo.findById.mockResolvedValue({ id: 'user-1', planId: 'plan-1' });
    mockPlanRepo.findById.mockResolvedValue({ collaboratorLimit: 3 });
    mockCollabRepo.countByUserId.mockResolvedValue(3);

    await expect(useCase.execute({ email: 'test@mail.com' }, 'user-1')).rejects.toThrow('Has alcanzado el limite de colaboradores para tu plan');
  });

  it('should successfully create and send email', async () => {
    mockUserRepo.findById.mockResolvedValue({ id: 'user-1', planId: 'plan-1' });
    mockPlanRepo.findById.mockResolvedValue({ collaboratorLimit: 3 });
    mockCollabRepo.countByUserId.mockResolvedValue(1);
    mockCollabRepo.findByEmail.mockResolvedValue(null);
    
    mockCollabRepo.save.mockResolvedValue({ id: 'col-1', email: 'test@mail.com' });

    const result = await useCase.execute({ email: 'test@mail.com' }, 'user-1');
    expect(mockCollabRepo.save).toHaveBeenCalled();
    expect(mockEmail.sendInvitationEmail).toHaveBeenCalledWith('test@mail.com', 'col-1');
    expect(result.id).toBe('col-1');
  });
});
