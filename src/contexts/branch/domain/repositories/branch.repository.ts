import { Branch } from "../models/branch.model";

export interface BranchRepository {
    save(branch: Branch): Promise<Branch>
    findByName(name: string): Promise<Branch | null>;
    findById(id: string): Promise<Branch | null>;
    delete(id: string): Promise<void>;
}