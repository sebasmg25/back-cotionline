import { DeleteCollaboratorUseCase } from '../../../src/contexts/collaborator/useCases/deleteCollaborator.useCase';

describe('DeleteCollaboratorUseCase', () => {
  let useCase: DeleteCollaboratorUseCase;
  let mockCollabRepo: any;

  beforeEach(() => {
    mockCollabRepo = { findById: jest.fn(), delete: jest.fn() };
    useCase = new DeleteCollaboratorUseCase(mockCollabRepo);
  });

  it('should throw error if not found', async () => {
    mockCollabRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('inv-1', 'owner-1')).rejects.toThrow('Colaborador no encontrado.');
  });

  it('should throw error if not owner', async () => {
    mockCollabRepo.findById.mockResolvedValue({ userId: 'hacker-1' });
    await expect(useCase.execute('inv-1', 'owner-1')).rejects.toThrow('No tienes permiso para eliminar este colaborador.');
  });

  it('should successfully delete and map DTO', async () => {
    const existing = { id: 'inv-1', email: 't@mail.com', userId: 'owner-1' };
    mockCollabRepo.findById.mockResolvedValue(existing);

    const result = await useCase.execute('inv-1', 'owner-1');

    expect(mockCollabRepo.delete).toHaveBeenCalledWith('inv-1');
    expect(result.id).toBe('inv-1');
    expect(result.email).toBe('t@mail.com');
  });
});
