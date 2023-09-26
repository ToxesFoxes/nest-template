import { applyDecorators } from '@nestjs/common';
import {
    ArrayMaxSize as CV_ArrayMaxSize,
    ArrayMinSize as CV_ArrayMinSize,
    IsArray as CV_IsArray,
    IsBoolean as CV_IsBoolean,
    IsNotEmpty as CV_IsNotEmpty,
    IsNumber as CV_IsNumber,
    IsUUID as CV_IsUUID,
    IsNumberOptions,
    IsObject as CV_IsObject,
    IsOptional as CV_IsOptional,
    IsString as CV_IsString,
    IsDateString as CV_IsDateString,
    ValidationOptions,
    UUIDVersion
} from 'class-validator';
import ValidatorJS from 'validator';

export function IsOptional(validationOptions?: ValidationOptions) {
    return applyDecorators(
        CV_IsOptional({
            message: 'Значение опционально',
            ...validationOptions
        })
    );
}

export function IsString(validationOptions?: ValidationOptions) {
    return applyDecorators(
        CV_IsString({
            message: 'Значение должно быть строкой',
            ...validationOptions
        })
    );
}

export function IsNumber(options?: IsNumberOptions, validationOptions?: ValidationOptions) {
    return applyDecorators(
        CV_IsNumber(
            options, {
            message: 'Значение должно быть числом',
            ...validationOptions
        }
        )
    );
}

export function IsNotEmpty(validationOptions?: ValidationOptions) {
    return applyDecorators(
        CV_IsNotEmpty({
            message: 'Значение не должно быть пустым',
            ...validationOptions
        })
    );
}

export function IsBoolean(validationOptions?: ValidationOptions) {
    return applyDecorators(
        CV_IsBoolean({
            message: 'Значение должно быть булевым',
            ...validationOptions
        })
    );
}

export function IsArray(validationOptions?: ValidationOptions) {
    return applyDecorators(
        CV_IsArray({
            message: 'Значение должно быть массивом',
            ...validationOptions
        })
    );
}

export function IsObject(validationOptions?: ValidationOptions) {
    return applyDecorators(
        CV_IsObject({
            message: 'Значение должно быть объектом',
            ...validationOptions
        })
    );
}

export function IsUUID(version: UUIDVersion = '4', validationOptions?: ValidationOptions) {
    return applyDecorators(
        CV_IsUUID(version, {
            message: 'Значение должно быть валидным UUID v4',
            ...validationOptions
        })
    );
}

export function ArrayMinSize(min: number, validationOptions?: ValidationOptions) {
    return applyDecorators(
        CV_ArrayMinSize(min, {
            message: `Минимальное количество элементов - ${min}`,
            ...validationOptions
        }),
    );
}

export function ArrayMaxSize(max: number, validationOptions?: ValidationOptions) {
    return applyDecorators(
        CV_ArrayMaxSize(max, {
            message: `Максимальное количество элементов - ${max}`,
            ...validationOptions
        }),
    );
}

export function ArrayMinMaxSize(min: number = 0, max: number = 50, validationOptionsMin?: ValidationOptions, validationOptionsMax?: ValidationOptions) {
    return applyDecorators(
        ArrayMinSize(min, validationOptionsMin), ArrayMaxSize(max, validationOptionsMax)
    );
}

export function IsDateString(options?: ValidatorJS.IsISO8601Options, validationOptions?: ValidationOptions) {
    return applyDecorators(
        CV_IsDateString(options, {
            message: 'Значение должно быть валидной датой',
            ...validationOptions
        })
    );
}
