import { Util } from '@/utils/Util';
import { ResolverFunction } from '@/ResolverFunction';
import { Result } from '@/Result';


/**
 * Base resolver class
 */
export class Resolver<T> {

    /**
     * default value
     */
    public defaultValue: T;
    /**
     * whether data is nullable
     */
    public isNullable: boolean = false;



    /**
     * 
     * @param type Type of data resolver handles
     * @param resolver Function that resolves given data
     */
    constructor (
        public readonly type: string,
        /**
         * @hidden
         */
        private resolver: ResolverFunction<T>
    ) {}

    /**
     * Resolves given data
     * @param input Data to be resolved
     */
    public resolve(input: any): Result<T> {
        let resolved = this.resolver(input);
        if (!resolved.success) {
            if (this.isNullable === true && input === null) {
                return new Result<T>(true, null);
            } else if (Util.isDefAndNotNull(this.defaultValue)) {
                resolved.result = this.resolver(this.defaultValue).result;
            } else if (this.isNullable === true) {
                resolved.result = null;
            }
        } else if (!Util.isDef(resolved.result) && this.isNullable === true) {
            resolved.result = null;
        }
        return resolved;
    }

    /**
     * @hidden
     */
    private _clone(): Resolver<T> {
        return new Resolver(this.type, this.resolver);
    }

    /**
     * Sets default value which will be returned in case of fail validation
     * @param val default value
     */
    public defaultsTo(val: T): Resolver<T> {
        let newResolver: Resolver<T> = this._clone(); 
        newResolver.defaultValue = val;
        newResolver.isNullable = this.isNullable;
        return newResolver;
    }

    /**
     * Whether data can be nullable. If yes, resolver returns success when given data is null or returns null when given data is not validated properly
     */
    public nullable(): Resolver<T> {
        let newResolver: Resolver<T> = this._clone();
        newResolver.defaultValue = this.defaultValue;
        newResolver.isNullable = true;
        return newResolver;
    }
}