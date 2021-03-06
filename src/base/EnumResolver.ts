import { IEnum } from '@/interfaces/IEnum';
import { Result } from '@/Result';
import { Util } from '@/utils/Util';
import { OptionalResolver } from '@/base/OptionalResolver';



export class EnumResolver<T> extends OptionalResolver<T> {

    public type: string = 'enum';

    /**
     * @hidden
     */
    public constructor (
        /**
         * @hidden
         */
        private definition: (string | number)[] | IEnum,
        isNullable: boolean = false,
        isOptional: boolean = false,
    ) {
        super(isNullable, isOptional);
    }

    /**
     * @hidden
     */
    public nullable(): EnumResolver<T> {
        return new EnumResolver(this.definition, true, this.isOptional);
    }

    /**
     * @hidden
     */
    public optional(): EnumResolver<T> {
        return new EnumResolver(this.definition, this.isNullable, true);
    }

    /**
     * @hidden
     */
    protected resolver (input: any): Result<T> {
        const errors: string[] = [];
        let result: string | number = 0;

        // TODO: split this array into separate functions
        if (Util.isArray(this.definition)) {
            if ((<(string | number)[]> this.definition).indexOf(input) > -1) {
                result = input;
            } else {
                if (Util.isString(input)) {
                    errors.push(`"${input}" string is not this enum's property`);
                } else if (Util.isNumber(input)) {
                    errors.push(`number of ${input} is not this enum's property`);
                } else {
                    errors.push(`${typeof input} is not this enum's property`);
                }
                result = this.definition[0];
            }
        } else if (Util.isObject(this.definition)) {
            if (Object.keys(this.definition).map(e => this.definition[e]).indexOf(input) > -1) {
                result = input;
            } else {
                if (Util.isString(input)) {
                    errors.push(`"${input}" string is not this enum's property`);
                } else if (Util.isNumber(input)) {
                    errors.push(`number of ${input} is not this enum's property`);
                } else {
                    errors.push(`${typeof input} is not this enum's property`);
                }
                result = Util.isDef(this.definition[0]) ? 0 : this.definition[Object.keys(this.definition)[0]];
            }
        } else {
            errors.push('provided enum definition is not valid');
        }

        return new Result<T>(errors.length === 0, <any> result, errors);
    }
}
