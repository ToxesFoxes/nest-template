import { CanActivate, ExceptionFilter, Get, NestInterceptor, Post, UseFilters, UseGuards, UseInterceptors, UsePipes, applyDecorators } from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiBodyOptions, ApiOperation, ApiParam, ApiParamOptions, ApiQuery, ApiQueryOptions, ApiResponse, ApiResponseMetadata, ApiTags } from '@nestjs/swagger';
import { CustomValidationPipe } from './pipes/pipes.custom';

interface RouteResponses {
    [status: number | string]: {
        type: ApiResponseMetadata['type'];
        description?: string;
    };
}

export class EmptyObject { }


interface RouteOptions {
    /**
     * Тип запроса
     * @default get
     */
    type?: 'get' | 'post';
    /**
     * @description Путь роута относительно контроллера
     * @example /:id /:id/:name /:id/?name
     */
    path: string;
    /**
     * Краткое описание роута для документации Swagger
     * @example Получить информацию о пользователе
     */
    summary?: string;
    /**
     * Теги для документации Swagger
     * @example Пользователи
     */
    tags?: string;
    /**
     * Защита роута
     * @example [AuthGuard]
     */
    guards?: (Function | CanActivate)[];
    /**
     * Фильтры исключений
     * @example [new Exceptor()]
     * @description Необходимо добавлять в контроллере
     * @see Exceptor
     * @see https://docs.nestjs.com/exception-filters
     */
    filters?: (Function | ExceptionFilter<any>)[];
    /**
     * Интерсепторы
     * @example [new DataInterceptor()]
     * @description Необходимо добавлять в контроллере
     * @see DataInterceptor
     * @see https://docs.nestjs.com/interceptors
     */
    interceptors?: (Function | NestInterceptor<any, any>)[]
    /**
     * Тип авторизации
     */
    auth?: 'basic' | 'bearer';
    /**
     * Тип валидации
     * @default experimental
     */
    validation?: 'custom' | 'none' | boolean | 'default' | 'experimental';
    /**
     * Свойства для документации Swagger
     * @example [{ name: 'id', description: 'Идентификатор пользователя' }]
     * @see https://docs.nestjs.com/openapi/types-and-parameters
     */
    apiSettings?: {
        param?: ApiParamOptions[];
        query?: ApiQueryOptions[];
        body?: ApiBodyOptions[];
    };
}
export interface EasyRouteOptions {
    route: RouteOptions;
    responses?: RouteResponses;
}

export function EasyRoute(options: EasyRouteOptions) {
    const { route, responses } = options;

    const decorators = [];
    const apply = (...el: any[]) => decorators.push(...el);

    //#region Route config
    const { type = 'get', path, summary, tags, guards, filters, interceptors, auth, validation: validationType, apiSettings } = route;

    apply(type === 'get' ? Get(path) : Post(path));
    apply(ApiOperation({ summary }));

    if (tags) apply(ApiTags(tags));
    if (guards) apply(UseGuards(...guards));
    if (filters) apply(UseFilters(...filters));
    if (interceptors) apply(UseInterceptors(...interceptors));

    switch (auth) {
        case 'basic': apply(ApiBasicAuth()); break;
        case 'bearer': apply(ApiBearerAuth()); break;
    }

    switch (validationType) {
        case false: case 'none': case 'custom':
            break;
        case 'experimental': case 'default': default:
            apply(UsePipes(new CustomValidationPipe()));
            break;
    }
    //#endregion

    //#region Route properties
    if (apiSettings) {
        const { query, body, param } = apiSettings;
        if (query) {
            for (const queryItem of query) {
                apply(ApiQuery(queryItem));
            }
        }
        if (param) {
            for (const paramItem of param) {
                apply(ApiParam(paramItem));
            }
        }
        if (body) {
            for (const bodyItem of body) {
                apply(ApiBody(bodyItem));
            }
        }
    }
    //#endregion

    //#region Route responses
    for (const status in responses) {
        const response = responses[status];
        apply(
            ApiResponse({
                status: Number(status),
                type: response.type,
                description: response.description,
            }),
        );
    }
    //#endregion
    return applyDecorators(...decorators);
}