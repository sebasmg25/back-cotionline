import { VerifyBusinessUseCase } from '../../../src/contexts/business/useCases/verifyBusiness.useCase';
import { BusinessStatus } from '../../../src/contexts/business/domain/models/business.model';

describe('VerifyBusinessUseCase', () => {
  let useCase: VerifyBusinessUseCase;
  let mockBusinessRepository: any;

  beforeEach(() => {
    mockBusinessRepository = {
      findById: jest.fn(),
      update: jest.fn()
    };
    useCase = new VerifyBusinessUseCase(mockBusinessRepository);
  });

  it('should throw an error if business not found', async () => {
    mockBusinessRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('bus-1', BusinessStatus.VERIFIED)).rejects.toThrow('Negocio no encontrado');
  });

  it('should throw an error if repository update fails', async () => {
    mockBusinessRepository.findById.mockResolvedValue({ id: 'bus-1' });
    mockBusinessRepository.update.mockResolvedValue(null);
    await expect(useCase.execute('bus-1', BusinessStatus.PENDING)).rejects.toThrow('Error al actualizar el estado del negocio.');
  });

  it('should successfully update status', async () => {
    mockBusinessRepository.findById.mockResolvedValue({ id: 'bus-1', status: BusinessStatus.PENDING });
    mockBusinessRepository.update.mockResolvedValue({ id: 'bus-1', status: BusinessStatus.VERIFIED });
    
    const result = await useCase.execute('bus-1', BusinessStatus.VERIFIED);
    expect(mockBusinessRepository.update).toHaveBeenCalledWith('bus-1', { status: BusinessStatus.VERIFIED });
    expect(result.status).toBe(BusinessStatus.VERIFIED);
  });
});
