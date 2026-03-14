import { GetBusinessUseCase } from '../../../src/contexts/business/useCases/getBusiness.useCase';

describe('GetBusinessUseCase', () => {
  let useCase: GetBusinessUseCase;
  let mockBusinessRepository: any;

  beforeEach(() => {
    mockBusinessRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn()
    };
    useCase = new GetBusinessUseCase(mockBusinessRepository);
  });

  const validSession = { id: 'owner-id', role: 'OWNER' };
  const collabSession = { id: 'collab-id', role: 'COLLABORATOR', ownerId: 'boss-id' };

  it('should fetch business by explicit ID and validate owner', async () => {
    const mockBusiness = { id: 'bus-1', userId: 'owner-id', name: 'Store' };
    mockBusinessRepository.findById.mockResolvedValue(mockBusiness);

    const result = await useCase.execute('bus-1', validSession);
    expect(mockBusinessRepository.findById).toHaveBeenCalledWith('bus-1');
    expect(result.name).toBe('Store');
  });

  it('should fetch business by implicit owner session', async () => {
    const mockBusiness = { id: 'bus-2', userId: 'boss-id', name: 'Boss Store' };
    mockBusinessRepository.findByUserId.mockResolvedValue(mockBusiness);

    const result = await useCase.execute(undefined, collabSession);
    expect(mockBusinessRepository.findByUserId).toHaveBeenCalledWith('boss-id');
    expect(result.name).toBe('Boss Store');
  });

  it('should throw an error if business is not found', async () => {
    mockBusinessRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('bus-1', validSession)).rejects.toThrow('Negocio no encontrado.');
  });

  it('should throw an error if the user does not own the business', async () => {
    const mockBusiness = { id: 'bus-1', userId: 'hacker-id' };
    mockBusinessRepository.findById.mockResolvedValue(mockBusiness);
    await expect(useCase.execute('bus-1', validSession)).rejects.toThrow('No tienes permiso para acceder a este negocio.');
  });
});
