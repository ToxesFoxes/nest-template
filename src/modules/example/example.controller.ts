import { Controller } from '@nestjs/common';
import { EasyRoute } from '../utils/utils.easyroute';
import Routes from './exports/example.routes';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Пример')
@Controller('example')
export class ExampleController {
    constructor() { }

    @EasyRoute(Routes.examplePost)
    async examplePost() {
        return { message: 'Hello: example post' }
    }
    
    @EasyRoute(Routes.exampleGet)
    async exampleGet() {
        return { message: 'Hello: example get' }
    }
    
    @EasyRoute(Routes.exampleBearer)
    async exampleBearer() {
        return { message: 'Hello: example bearer' }
    }
    
    @EasyRoute(Routes.exampleBasic)
    async exampleBasic() {
        return { message: 'Hello: example basic' }
    }
}
