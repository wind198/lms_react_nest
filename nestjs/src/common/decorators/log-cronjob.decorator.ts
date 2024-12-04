import { Logger } from '@nestjs/common';
export function LogCronJob() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // if (NODE_ENV !== 'development') {
      //   return await originalMethod.apply(this, args);
      // }
      Logger.log(`Cron job ${propertyKey} begin`);
      const start = Date.now();
      const result = await originalMethod.apply(this, args);
      const end = Date.now();
      Logger.log(`Cron job ${propertyKey} completed after: ${end - start}ms`);
      return result;
    };

    Reflect.getMetadataKeys(originalMethod).forEach((key) => {
      const metadata = Reflect.getMetadata(key, originalMethod);
      Reflect.defineMetadata(key, metadata, descriptor.value);
    });

    return descriptor;
  };
}
