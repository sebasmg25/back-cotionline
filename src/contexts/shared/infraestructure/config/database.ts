import { DataSource } from 'typeorm';
import { EnvConfig } from '../env/envConfig'; // Importar para obtener variables de entorno
import { UserEntity } from '../../../user/infraestructure/persistance/typeorm/entities/user.entity';
import { BusinessEntity } from '../../../business/infraestructure/persistance/typeorm/entities/business.entity';
import { QuotationRequestEntity } from '../../../quotationRequest/infraestructure/persistance/typeorm/entities/quotationRequest.entity';
import { BranchEntity } from '../../../branch/infrastructure/persistance/typeorm/entities/branch.entity';
import { ProductEntity } from '../../../product/infraestructure/persistance/typeorm/entities/product.entity';
import { QuotationEntity } from '../../../quotation/infraestructure/persistance/typeorm/entities/quotation.entity';
import { CollaboratorEntity } from '../../../collaborator/infraestructure/persistance/typeorm/entities/collaborator.entity';
import { NotificationEntity } from '../../../notification/infraestructure/persistance/typeorm/entities/notification.entity';
import { PlanEntity } from '../../../subscription/infraestructure/persistance/typeorm/entities/plan.entity';
import { PaymentTransactionEntity } from '../../../subscription/infraestructure/persistance/typeorm/entities/paymentTransaction.entity';
// Importa tus entidades de TypeORM aquí
// import { UserEntity } from '../infrastructure/database/entities/UserEntity';

export const AppDataSource = new DataSource({
  type: 'mysql', // Cambia a 'mysql', 'sqlite', etc., según tu base de datos
  host: EnvConfig.get('DB_HOST'),
  port: Number.parseInt(EnvConfig.get('DB_PORT') || '5432', 10),
  username: EnvConfig.get('DB_USER'),
  password: EnvConfig.get('DB_PASSWORD'),
  database: EnvConfig.get('DB_NAME'),
  synchronize: EnvConfig.get('NODE_ENV') === 'development', // ¡NO USAR EN PRODUCCIÓN! Solo para desarrollo para crear tablas automáticamente
  logging: EnvConfig.get('NODE_ENV') === 'development', // Habilita logging SQL en desarrollo
  timezone: 'local', // Usa la zona horaria local del servidor para los timestamps de MySQL
  entities: [
    UserEntity,
    BusinessEntity,
    QuotationRequestEntity,
    BranchEntity,
    ProductEntity,
    QuotationEntity,
    CollaboratorEntity,
    NotificationEntity,
    PlanEntity,
    PaymentTransactionEntity,
    // UserEntity // Añade tus entidades aquí
  ],
  migrations: [], // Aquí irán tus archivos de migración
  subscribers: [],
});
