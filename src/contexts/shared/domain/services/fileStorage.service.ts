export interface FileStorageService {
  save(fileName: string, buffer: Buffer): Promise<string>;
  delete(fileName: string): Promise<void>;
  getUrl(fileName: string): string;
}
