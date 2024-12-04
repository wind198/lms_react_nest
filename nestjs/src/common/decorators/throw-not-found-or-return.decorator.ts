import { NotFoundException } from '@nestjs/common';

export function ThrowNotFoundOrReturn(item?: string, message?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    const msg = (message ?? item) ? `${item} not found` : 'Not found';

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      if (Array.isArray(result) && !result.length) {
        throw new NotFoundException(msg);
      }
      if (result === null || result === undefined) {
        throw new NotFoundException(msg);
      }
      return result;
    };
    // Retain all existing metadata
    Reflect.getMetadataKeys(originalMethod).forEach((key) => {
      const metadata = Reflect.getMetadata(key, originalMethod);
      Reflect.defineMetadata(key, metadata, descriptor.value);
    });

    return descriptor;
  };
}
