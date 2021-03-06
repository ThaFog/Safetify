import { Resolver } from '@/base/Resolver';
import { PrimitiveResolver } from '@/base/PrimitiveResolver';
import { IPrimitive } from './IPrimitive';



/*
 * https://stackoverflow.com/questions/51161559/typescript-array-type-transform-with-keyof-like-method
 * Fixed and optimized
 */
export type ITupleDefinition<T extends IPrimitive[]> = { [U in keyof T]:
    U extends 'length' ? T[U] :
    T[U] extends IPrimitive ? PrimitiveResolver<T[U]> : undefined;
};
