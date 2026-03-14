import { RejectInvitationUseCase } from '../../../src/contexts/collaborator/useCases/rejectInvitation.useCase';
import { InvitationStatus } from '../../../src/contexts/collaborator/domain/models/collaborator.model';

describe('RejectInvitationUseCase', () => {
  let useCase: RejectInvitationUseCase;
  let mockCollabRepo: any;
  let mockNotification: any;

  beforeEach(() => {
    mockCollabRepo = { findById: jest.fn(), update: jest.fn() };
    mockNotification = { execute: jest.fn() };
    useCase = new RejectInvitationUseCase(mockCollabRepo, mockNotification);
  });

  it('should cleanly reject pending invitations and notify', async () => {
    const baseCollab = { id: 'inv-1', userId: 'owner-1', email: 'test@mail.com', invitationStatus: InvitationStatus.PENDING };
    mockCollabRepo.findById.mockResolvedValue(baseCollab);
    mockCollabRepo.update.mockResolvedValue({ ...baseCollab, invitationStatus: InvitationStatus.REJECTED });

    const result = await useCase.execute('inv-1');
    
    expect(mockCollabRepo.update).toHaveBeenCalledWith('inv-1', { invitationStatus: InvitationStatus.REJECTED });
    expect(mockNotification.execute).toHaveBeenCalled();
    expect(result.invitationStatus).toBe(InvitationStatus.REJECTED);
  });

  it('should throw if invitation already accepted', async () => {
    mockCollabRepo.findById.mockResolvedValue({ id: 'inv-1', invitationStatus: InvitationStatus.ACCEPTED });
    await expect(useCase.execute('inv-1')).rejects.toThrow('Esta invitación ya ha sido aceptada anteriormente');
  });
});
