import { UpdateCollaboratorUseCase } from '../../../src/contexts/collaborator/useCases/updateCollaborator.useCase';

describe('UpdateCollaboratorUseCase', () => {
  let useCase: UpdateCollaboratorUseCase;
  let mockCollabRepo: any;

  beforeEach(() => {
    mockCollabRepo = { findById: jest.fn(), update: jest.fn() };
    useCase = new UpdateCollaboratorUseCase(mockCollabRepo);
  });

  const existingCollab = { id: 'inv-1', email: 'old@mail.com', userId: 'owner-1' };

  it('should throw if not found or unauthorized', async () => {
    mockCollabRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute('inv-1', 'owner-1')).rejects.toThrow('El colaborador que intentas actualizar no existe');

    mockCollabRepo.findById.mockResolvedValue({ ...existingCollab, userId: 'other-boss' });
    await expect(useCase.execute('inv-1', 'owner-1')).rejects.toThrow('No tienes permiso para modificar este colaborador.');
  });

  it('should throw if identical data passed', async () => {
    mockCollabRepo.findById.mockResolvedValue(existingCollab);
    await expect(useCase.execute('inv-1', 'owner-1', 'old@mail.com')).rejects.toThrow('No se detectaron cambios en los campos enviados.');
  });

  it('should apply valid update', async () => {
    mockCollabRepo.findById.mockResolvedValue(existingCollab);
    mockCollabRepo.update.mockResolvedValue({ ...existingCollab, email: 'new@mail.com' });

    const result = await useCase.execute('inv-1', 'owner-1', 'new@mail.com');

    expect(mockCollabRepo.update).toHaveBeenCalledWith('inv-1', { email: 'new@mail.com' });
    expect(result.email).toBe('new@mail.com');
  });
});
