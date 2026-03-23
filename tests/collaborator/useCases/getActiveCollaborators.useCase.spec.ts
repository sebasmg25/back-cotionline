import { GetActiveCollaboratorsUseCase } from '../../../src/contexts/collaborator/useCases/getActiveCollaborators.useCase';

describe('GetActiveCollaboratorsUseCase', () => {
  let useCase: GetActiveCollaboratorsUseCase;
  let mockUserRepo: any;

  beforeEach(() => {
    mockUserRepo = { findCollaboratorsByOwnerId: jest.fn() };
    useCase = new GetActiveCollaboratorsUseCase(mockUserRepo);
  });

  it('should securely fetch all active collaborators stripping their passwords', async () => {
    const mockUsers = [
      { id: '1', password: 'hash1', name: 'John' },
      { id: '2', password: 'hash2', name: 'Jane' }
    ];
    mockUserRepo.findCollaboratorsByOwnerId.mockResolvedValue(mockUsers);

    const results = await useCase.execute('boss-1');

    expect(mockUserRepo.findCollaboratorsByOwnerId).toHaveBeenCalledWith('boss-1');
    expect(results.length).toBe(2);
    expect((results[0] as any).password).toBeUndefined();
    expect(results[0].name).toBe('John');
  });
});
