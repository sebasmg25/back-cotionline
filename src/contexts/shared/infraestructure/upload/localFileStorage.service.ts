import fs from 'fs';
import path from 'path';
import { FileStorageService } from '../../domain/services/fileStorage.service';
import { EnvConfig } from '../env/envConfig';

export class LocalFileStorageService implements FileStorageService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async save(fileName: string, buffer: Buffer): Promise<string> {
    const filePath = path.join(this.uploadPath, fileName);
    await fs.promises.writeFile(filePath, buffer);
    return fileName;
  }

  async delete(fileName: string): Promise<void> {
    const filePath = path.join(this.uploadPath, fileName);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  getUrl(fileName: string): string {
    const port = EnvConfig.get('PORT') || 3000;
    const host = EnvConfig.get('HOST') || 'localhost';
    return `https://${host}:${port}/uploads/${fileName}`.replaceAll('\\', '/');
  }
}
