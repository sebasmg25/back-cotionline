import { GetCollaboratorUseCase } from '../../../src/contexts/collaborator/useCases/getCollaborator.useCase';

describe('GetCollaboratorUseCase', () => {
  let useCase: GetCollaboratorUseCase;
  let mockCollabRepo: any;

  beforeEach(() => {
    mockCollabRepo = { findById: jest.fn() };
    useCase = new GetCollaboratorUseCase(mockCollabRepo);
  });

  it('should throw error if not found', async () => {
    mockCollabRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('inv-1', 'owner-1')).rejects.toThrow('Colaborador no encontrado.');
  });

  it('should throw error if owner verification fails', async () => {
    mockCollabRepo.findById.mockResolvedValue({ userId: 'hacker-1' });
    await expect(useCase.execute('inv-1', 'owner-1')).rejects.toThrow('No tienes permiso para ver este colaborador.');
  });

  it('should return safely mapped collaborator content', async () => {
    mockCollabRepo.findById.mockResolvedValue({ id: 'inv-1', email: 'test@mail.com', userId: 'owner-1' });
    const result = await useCase.execute('inv-1', 'owner-1');
    expect(result.email).toBe('test@mail.com');
  });
});
