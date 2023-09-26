import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationExcetption } from '../validation/validation.exception';

export class CustomValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        const obj = plainToClass(metadata.metatype, value);
        const errors = await validate(obj);
        const result = {
            result: true,
            message: "Всё ок, хз почему вы тут",
            errors: {},
            data: {}
        };
        if (errors.length) {
            let errs = {}
            errors.forEach((err) => {
                if (err.constraints)
                    errs[err.property] = Object.values(err.constraints).join(', ')
            });
            if (Object.keys(errs).length) {
                result.result = false;
                result.message = "Неправильный запрос";
                result.errors = {
                    code: "VALIDATION_FAILED",
                    validation: errs
                };
                throw new ValidationExcetption(result);
            }
        }
        return value;
    }
}