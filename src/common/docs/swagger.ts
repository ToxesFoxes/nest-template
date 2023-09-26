import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cyan, reset } from '@/common/console/colors';
import { ConfigService } from '@nestjs/config';
import basicAuth from 'express-basic-auth';

export class Swagger {
    public static logger = new Logger('SwaggerModule', { timestamp: true })
    public static enabled(config: ConfigService) {
        return (
            config.get<string>('NODE_ENV', 'production') === 'development' || config.get<boolean>('API_SWAGGER', false)
        );
    }
    public static async load(app: INestApplication, config: ConfigService) {
        if (this.enabled(config)) {
            const PREFIX = config.get<string>('API_PREFIX', 'api')
            const API_HOST_FULL = config.get<string>('API_HOST_FULL', 'http://localhost:5000')
            const PORT = config.get<number>('API_PORT', 5000);
            await Swagger.protect(config, app);

            const swaggerConfig = new DocumentBuilder()
                .setTitle('REST API Asista')
                .setDescription('Docs Asista')
                .setVersion('1.0.0')
                .setContact('ToxesFoxes', 'https://toxesfoxes.kz', 'toxes_foxes@outlook.com')
                .addServer(API_HOST_FULL, 'Текущий сервер')
                .addServer(`http://localhost:${PORT}`, 'Локальный сервер')
                .addBearerAuth()
                .addBasicAuth()
                .build();
            const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
            SwaggerModule.setup(`${PREFIX}/docs`, app, swaggerDocument, {
                swaggerOptions: {
                    docExpansion: 'none',
                    filter: true,
                    showRequestDuration: true,
                },
            });
        }
    }
    public static async onLoad(config: ConfigService) {
        if (this.enabled(config)) {
            const PREFIX = config.get<string>('API_PREFIX', 'api')
            const API_HOST_FULL = config.get<string>('API_HOST_FULL', 'http://localhost:5000')

            Swagger.logger.log(`${reset}📕 Docs on ${cyan}${API_HOST_FULL}/${PREFIX}/docs${reset}`);
            Swagger.logger.log(`${reset}📙 JSON on ${cyan}${API_HOST_FULL}/${PREFIX}/docs-json${reset}`);
        }
    }
    public static async protect(config: ConfigService, app: INestApplication) {
        const API_SWAGGER_PROTECT = config.get<string>('API_SWAGGER_PROTECT', 'false')
        const API_SWAGGER_LOGIN = config.get<string>('API_SWAGGER_LOGIN', 'invision')
        const API_SWAGGER_PASSWORD = config.get<string>('API_SWAGGER_PASSWORD', 'invision')
        const PREFIX = config.get<string>('API_PREFIX', 'api')
        if (API_SWAGGER_PROTECT === 'true') {
            app.use(
                [`/${PREFIX}/docs*`, `/${PREFIX}/docs-json*`],
                basicAuth({
                    challenge: true,
                    users: {
                        [API_SWAGGER_LOGIN]: API_SWAGGER_PASSWORD,
                    },
                }),
            );
            Swagger.logger.log(' 🔐 Swagger protected')
        }
    }
}

