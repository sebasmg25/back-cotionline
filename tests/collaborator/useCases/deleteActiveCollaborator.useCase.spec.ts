import { DeleteActiveCollaboratorUseCase } from '../../../src/contexts/collaborator/useCases/deleteActiveCollaborator.useCase';
import { UserRole } from '../../../src/contexts/user/domain/models/user.model';

describe('DeleteActiveCollaboratorUseCase', () => {
  let useCase: DeleteActiveCollaboratorUseCase;
  let mockUserRepo: any;
  let mockCollabRepo: any;

  beforeEach(() => {
    mockUserRepo = { findById: jest.fn(), delete: jest.fn() };
    mockCollabRepo = { findByEmail: jest.fn(), delete: jest.fn() };
    useCase = new DeleteActiveCollaboratorUseCase(mockUserRepo, mockCollabRepo);
  });

  it('should throw error if user not found', async () => {
    mockUserRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('user-collab', 'owner-1')).rejects.toThrow('El colaborador no existe.');
  });

  it('should throw error if user is not a collaborating role or belongs to another owner', async () => {
    mockUserRepo.findById.mockResolvedValue({ role: UserRole.OWNER, ownerId: 'owner-1' });
    await expect(useCase.execute('user-collab', 'owner-1')).rejects.toThrow('No tienes permisos para eliminar este colaborador o el usuario no es de tu propiedad.');

    mockUserRepo.findById.mockResolvedValue({ role: UserRole.COLLABORATOR, ownerId: 'other-boss' });
    await expect(useCase.execute('user-collab', 'owner-1')).rejects.toThrow('No tienes permisos para eliminar este colaborador o el usuario no es de tu propiedad.');
  });

  it('should successfully delete both user and invitation footprint via repositories', async () => {
    mockUserRepo.findById.mockResolvedValue({ role: UserRole.COLLABORATOR, ownerId: 'owner-1', email: 'test@mail.com' });
    mockCollabRepo.findByEmail.mockResolvedValue({ id: 'invitation-id' });
    
    mockUserRepo.delete.mockResolvedValue(true);

    await useCase.execute('user-collab', 'owner-1');

    expect(mockCollabRepo.delete).toHaveBeenCalledWith('invitation-id');
    expect(mockUserRepo.delete).toHaveBeenCalledWith('user-collab');
  });
});
