import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export async function validateDTO<T, V>(cls: ClassConstructor<T>, value: V) {
    const obj = plainToClass(cls, value);
    const errors = await validate(obj as object);
    const result = {
        result: true,
        errors: {},
    };
    if (errors.length) {
        errors.forEach((err) => {
            result.errors[err.property] = Object.values(err.constraints).join(', ')
        });
        if (Object.keys(result.errors).length) result.result = false;
    }
    return result;
}
