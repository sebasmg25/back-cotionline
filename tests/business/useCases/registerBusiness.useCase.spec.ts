import { RegisterBusinessUseCase } from '../../../src/contexts/business/useCases/registerBusiness.useCase';
import { Business, BusinessStatus } from '../../../src/contexts/business/domain/models/business.model';

describe('RegisterBusinessUseCase', () => {
  let useCase: RegisterBusinessUseCase;
  let mockBusinessRepository: any;

  beforeEach(() => {
    mockBusinessRepository = {
      findByNit: jest.fn(),
      save: jest.fn()
    };
    useCase = new RegisterBusinessUseCase(mockBusinessRepository);
  });

  const validData = {
    nit: '123456789',
    name: 'Tech Store',
    description: 'A great store',
    address: 'Cl 123',
    rutUrl: 'http://rut.com',
    chamberOfCommerceUrl: 'http://cc.com'
  };

  it('should throw an error if NIT already exists', async () => {
    mockBusinessRepository.findByNit.mockResolvedValue({ id: 'existing-id' });
    await expect(useCase.execute(validData as any, 'user-1'))
      .rejects.toThrow('Ya existe un negocio registrado con este nit');
  });

  it('should save and return a new business', async () => {
    mockBusinessRepository.findByNit.mockResolvedValue(null);
    
    const savedBusiness = new Business(
      validData.nit, validData.name, validData.description, validData.address, 
      'user-1', BusinessStatus.PENDING, validData.rutUrl, validData.chamberOfCommerceUrl
    );
    Object.assign(savedBusiness, { id: 'business-123' });
    
    mockBusinessRepository.save.mockResolvedValue(savedBusiness);

    const result = await useCase.execute(validData as any, 'user-1');

    expect(mockBusinessRepository.save).toHaveBeenCalledTimes(1);
    expect(result.id).toBe('business-123');
    expect(result.status).toBe(BusinessStatus.PENDING);
    expect(result.userId).toBe('user-1');
  });
});
