// src/infrastructure/env/EnvConfig.ts
import dotenv from 'dotenv';

export class EnvConfig {
  private static configLoaded = false;

  public static load(): void {
    if (!EnvConfig.configLoaded) {
      dotenv.config();
      EnvConfig.configLoaded = true;
    }
  }

  public static get(key: string): string {
    if (!EnvConfig.configLoaded) {
      console.warn(
        'Variables de entorno no cargadas. Asegúrate de llamar a EnvConfig.load() al inicio de tu aplicación.'
      );
      dotenv.config(); // Cargar si no se ha cargado previamente (fallback)
      EnvConfig.configLoaded = true;
    }
    const value = process.env[key];
    if (value === undefined) {
      throw new Error(`La variable de entorno ${key} no está definida.`);
    }
    return value;
  }
}
