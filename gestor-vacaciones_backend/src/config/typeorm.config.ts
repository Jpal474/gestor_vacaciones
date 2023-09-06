/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';

export default class TypeOrmConfig {
    static getOrmConfig(configService : ConfigService): TypeOrmModuleOptions{  
        return {
            type: 'postgres',
            host: process.env.HOST,
            port: parseInt(process.env.PG_PORT,10),
            username: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DBNAME,
            autoLoadEntities: true,
            synchronize: true,
            entities: ['**/src/entity/*{.ts,.js}'],
        }
    }
}


export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule.forRoot({ isGlobal:true})],
    useFactory: async (configService: ConfigService): Promise <TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
};
