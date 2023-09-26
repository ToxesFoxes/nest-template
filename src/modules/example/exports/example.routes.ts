import { BearerExampleAuthGuard, BasicExampleAuthGuard } from '@/modules/auth/auth.guard';
import { EasyRouteOptions } from '@/modules/utils/utils.easyroute';

const examplePost: EasyRouteOptions = {
    route: {
        path: '/post', type: 'post'
    },
}

const exampleGet: EasyRouteOptions = {
    route: {
        path: '/get', type: 'get'
    },
}

const exampleBearer: EasyRouteOptions = {
    route: {
        path: '/bearer', type: 'get', auth: 'bearer', guards: [BearerExampleAuthGuard]
    },
}

const exampleBasic: EasyRouteOptions = {
    route: {
        path: '/basic', type: 'get', auth: 'basic', guards: [BasicExampleAuthGuard]
    },
}

export default {
    examplePost,
    exampleGet,
    exampleBearer,
    exampleBasic,
}