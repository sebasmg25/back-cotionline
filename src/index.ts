import 'reflect-metadata'; // Importante para TypeORM
import dotenv from 'dotenv';
import { App } from './app';
import { AppDataSource } from './config/database'; // Importar la configuración de la DB
import { EnvConfig } from './infraestructure/env/EnvConfig'; // Importar la configuración de entorno

dotenv.config(); // Cargar variables de entorno

async function bootstrap() {
  try {
    EnvConfig.load(); // Cargar configuración de entorno

    await AppDataSource.initialize();
    console.log('Base de datos conectada correctamente!');

    const app = new App().getApp();
    const port = EnvConfig.get('PORT') || 3000;

    app.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`);
      console.log(`Accede a http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();
