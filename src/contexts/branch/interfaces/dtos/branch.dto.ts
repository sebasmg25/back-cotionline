export interface CreateBranchRequest {
  name: string;
  address: string;
  city: string;
  businessId: string;
}

export interface UpdateBranchRequest {
  name?: string;
  address?: string;
  city?: string;
}

export interface BranchResponse {
  id: string;
  name: string;
  address: string;
  city: string;
  businessId: string;
}
