import { GetCollaboratorsByUserIdUseCase } from '../../../src/contexts/collaborator/useCases/getCollaboratorsByUserId.useCase';
import { InvitationStatus } from '../../../src/contexts/collaborator/domain/models/collaborator.model';

describe('GetCollaboratorsByUserIdUseCase', () => {
  let useCase: GetCollaboratorsByUserIdUseCase;
  let mockCollabRepo: any;

  beforeEach(() => {
    mockCollabRepo = { findCollaboratorsByUserId: jest.fn() };
    useCase = new GetCollaboratorsByUserIdUseCase(mockCollabRepo);
  });

  it('should filter only PENDING and REJECTED invitations belonging to the owner', async () => {
    const mixedCollaborators = [
      { id: 'inv-1', invitationStatus: InvitationStatus.PENDING },
      { id: 'inv-2', invitationStatus: InvitationStatus.ACCEPTED },
      { id: 'inv-3', invitationStatus: InvitationStatus.REJECTED }
    ];

    mockCollabRepo.findCollaboratorsByUserId.mockResolvedValue(mixedCollaborators);

    const result = await useCase.execute('owner-1');

    expect(mockCollabRepo.findCollaboratorsByUserId).toHaveBeenCalledWith('owner-1');
    expect(result.length).toBe(2);
    expect(result[0].invitationStatus).toBe(InvitationStatus.PENDING);
    expect(result[1].invitationStatus).toBe(InvitationStatus.REJECTED);
  });
});
