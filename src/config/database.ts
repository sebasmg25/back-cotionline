import { DataSource } from 'typeorm';
import { EnvConfig } from '../infraestructure/env/EnvConfig'; // Importar para obtener variables de entorno

// Importa tus entidades de TypeORM aquí
// import { UserEntity } from '../infrastructure/database/entities/UserEntity';

export const AppDataSource = new DataSource({
  type: 'mysql', // Cambia a 'mysql', 'sqlite', etc., según tu base de datos
  host: EnvConfig.get('DB_HOST'),
  port: parseInt(EnvConfig.get('DB_PORT') || '5432', 10),
  username: EnvConfig.get('DB_USER'),
  password: EnvConfig.get('DB_PASSWORD'),
  database: EnvConfig.get('DB_NAME'),
  synchronize: EnvConfig.get('NODE_ENV') === 'development', // ¡NO USAR EN PRODUCCIÓN! Solo para desarrollo para crear tablas automáticamente
  logging: EnvConfig.get('NODE_ENV') === 'development', // Habilita logging SQL en desarrollo
  entities: [
    // UserEntity // Añade tus entidades aquí
  ],
  migrations: [], // Aquí irán tus archivos de migración
  subscribers: [],
});
