import { ITuple } from '@/interfaces/ITuple';
import { ITupleDefinition } from '@/interfaces/ITupleDefinition';
import { Resolver } from '@/base/Resolver';
import { Result } from '@/Result';
import { Util } from '@/utils/Util';
import { OptionalResolver } from '@/base/OptionalResolver';



export class TupleResolver<T extends ITuple> extends OptionalResolver<T> {

    public type: string = 'tuple';

    /**
     * @hidden
     */
    public constructor (
        /**
         * @hidden
         */
        private definition: ITupleDefinition<T>,
        isNullable: boolean = false,
        isOptional: boolean = false,
    ) {
        super(isNullable, isOptional);
    }

    /**
     * @hidden
     */
    public nullable(): TupleResolver<T> {
        return new TupleResolver(this.definition, true, this.isOptional);
    }

    /**
     * @hidden
     */
    public optional(): TupleResolver<T> {
        return new TupleResolver(this.definition, this.isNullable, true);
    }

    /**
     * @hidden
     */
    protected resolver (input: any): Result<T> {
        const result: any = [];
        const errors: string[] = [];
        const len: number = this.definition.length;

        if (!Util.isArray(input)) {
            for (let i = 0; i < len; i++) {
                result.push(this.definition[i].resolve(undefined).result);
            }

            return new Result<T>(false, result, [`${typeof input} is not a tuple`], { rootFail: true });
        }

        const inputLen: number = input.length;

        for (let i = 0; i < inputLen; i++) {
            if (i >= len) {
                if (this.nested) {
                    errors.push(`[${i}]: out of range`);
                } else {
                    errors.push(`element at index ${i}: out of range`);
                }
                continue;
            }

            this.definition[i].nested = true;

            const resolved: Result<any> = this.definition[i].resolve(input[i]);
            
            result.push(resolved.result);
            
            if (!resolved.success) {
                if (this.nested) {
                    errors.push(`[${i}]: ${resolved.error[0]}`);
                } else {
                    errors.push(`element at index ${i}: ${resolved.error[0]}`);
                }
            }
        }

        return new Result<T>(errors.length === 0, result, errors, { rootFail: false });
    }
}
