import { DateResolver, Result } from '..';



describe('Date Resolver', () => {
    
    describe('correct input', () => {
        let result: Result<Date>;
        let result2: Result<Date>;
        let result3: Result<Date>;

        beforeEach(() => {
            result = DateResolver().resolve('2018-04-14 21:45 +200');
            result2 = DateResolver().resolve(1523742351657);
            result3 = DateResolver().resolve(new Date('2018-04-12 15:24 +200'));
        });

        it('should return success as true', () => {
            expect(result.success).toBe(true);
            expect(result2.success).toBe(true);
            expect(result3.success).toBe(true);
        });

        it('should return result equal to input', () => {
            expect(result.result.getTime()).toBe(1523735100000);
            expect(result2.result.getTime()).toBe(1523742351657);
            expect(result3.result.getTime()).toBe(1523539440000);
        });

        it('should not return error', () => {
            expect(result.error.length).toBe(0);
            expect(result2.error.length).toBe(0);
            expect(result3.error.length).toBe(0);
        });
    });

    describe('incorrect input', () => {
        let result: Result<Date>;
        let result2: Result<Date>;
        let result3: Result<Date>;

        beforeEach(() => {
            result = DateResolver().resolve(undefined);
            result2 = DateResolver().resolve(null);
            result3 = DateResolver().resolve('im a date');
        });

        it('should return success as false', () => {
            expect(result.success).toBe(false);
            expect(result2.success).toBe(false);
            expect(result3.success).toBe(false);
        });

        it('should return safe value', () => {
            expect(result.result.getTime()).toBe(0);
            expect(result2.result.getTime()).toBe(0);
            expect(result3.result.getTime()).toBe(0);
        });

        it('should return 1 error', () => {
            expect(result.error.length).toBe(1);
            expect(result2.error.length).toBe(1);
            expect(result3.error.length).toBe(1);
        });

        it('should return proper error description', () => {
            expect(result.error[0]).toBe('undefined is not a valid date');
            expect(result2.error[0]).toBe('object is not a valid date');
            expect(result3.error[0]).toBe('this string is not a valid date');
        });
    });

    describe('nullable value', () => {        
        describe('correct value', () => {
            let result: Result<Date>;

            beforeEach(() => {
                result = DateResolver().nullable().resolve(new Date('2018-04-12 15:24'));
            });

            it('should return success as true', () => {
                expect(result.success).toBe(true);
            });

            it('should return result equal to input', () => {
                expect(result.result).toEqual(new Date('2018-04-12 15:24'));
            });

            it('should not return error', () => {
                expect(result.error.length).toBe(0);
            });
        });

        describe('null value', () => {
            let result: Result<Date>;

            beforeEach(() => {
                result = DateResolver().nullable().resolve(null);
            });

            it('should return success as true', () => {
                expect(result.success).toBe(true);
            });

            it('should return result equal to input', () => {
                expect(result.result).toBe(null);
            });

            it('should not return error', () => {
                expect(result.error.length).toBe(0);
            });
        });

        describe('incorrect value', () => {
            let result: Result<Date>;

            beforeEach(() => {
                result = DateResolver().nullable().resolve(undefined);
            });

            it('should return success as true', () => {
                expect(result.success).toBe(false);
            });

            it('should return null as result', () => {
                expect(result.result).toBe(null);
            });

            it('should return 1 error', () => {
                expect(result.error.length).toBe(1);
            });

            it('should return proper error description', () => {
                expect(result.error[0]).toBe('undefined is not a valid date');
            });
        });
    });

    describe('optional value', () => {        
        describe('correct value', () => {
            let result: Result<Date>;

            beforeEach(() => {
                result = DateResolver().optional().resolve(new Date('2018-04-12 15:24'));
            });

            it('should return success as true', () => {
                expect(result.success).toBe(true);
            });

            it('should return result equal to input', () => {
                expect(result.result).toEqual(new Date('2018-04-12 15:24'));
            });

            it('should not return error', () => {
                expect(result.error.length).toBe(0);
            });
        });

        describe('null value', () => {
            let result: Result<Date>;

            beforeEach(() => {
                result = DateResolver().optional().resolve(null);
            });

            it('should return success as false', () => {
                expect(result.success).toBe(false);
            });

            it('should return result equal to input', () => {
                expect(result.result).toBe(undefined);
            });

            it('should return 1 error', () => {
                expect(result.error.length).toBe(1);
            });
        });

        describe('undefined value', () => {
            let result: Result<Date>;

            beforeEach(() => {
                result = DateResolver().optional().resolve(undefined);
            });

            it('should return success as true', () => {
                expect(result.success).toBe(true);
            });

            it('should return result equal to input', () => {
                expect(result.result).toBe(undefined);
            });

            it('should not return error', () => {
                expect(result.error.length).toBe(0);
            });
        });

        describe('incorrect value', () => {
            let result: Result<Date>;

            beforeEach(() => {
                result = DateResolver().optional().resolve('im a string');
            });

            it('should return success as true', () => {
                expect(result.success).toBe(false);
            });

            it('should return undefined as result', () => {
                expect(result.result).toBe(undefined);
            });

            it('should return error', () => {
                expect(result.error.length).toBe(1);
            });

            it('should return proper error description', () => {
                expect(result.error[0]).toBe('this string is not a valid date');
            });
        });
    });

    describe('immutable', () => {
        describe('nullable', () => {
            let resolver1: DateResolver;
            let resolver2: DateResolver;

            beforeEach(() => {
                resolver1 = DateResolver();
                resolver2 = resolver1.nullable();
            });

            it('should return new instance of resolver', () => {
                expect(resolver1).not.toBe(resolver2);
            });

            it('should set nullable option in new returned instance instead of actual one', () => {
                expect(+resolver1.resolve(null).result).toEqual(+new Date(0));
                expect(resolver2.resolve(null).result).toBeNull();
            });

            it('should pass actual optional option state to new instance when nullable option is being set', () => {
                resolver1 = DateResolver().optional();
                resolver2 = resolver1.nullable();

                expect(resolver1.resolve(undefined).success).toBe(true);
                expect(resolver2.resolve(undefined).success).toBe(true);
            });
        });

        describe('optional', () => {
            let resolver1: DateResolver;
            let resolver2: DateResolver;

            beforeEach(() => {
                resolver1 = DateResolver();
                resolver2 = resolver1.optional();
            });

            it('should return new instance of resolver', () => {
                expect(resolver1).not.toBe(resolver2);
            });

            it('should set optional option in new returned instance instead of actual one', () => {
                expect(+resolver1.resolve(undefined).result).toEqual(+new Date(0));
                expect(resolver2.resolve(undefined).result).toBeUndefined();
            });

            it('should pass actual nullable option state to new instance when optional option is being set', () => {
                resolver1 = DateResolver().nullable();
                resolver2 = resolver1.optional();

                expect(resolver1.resolve(null).result).toBeNull();
                expect(resolver2.resolve(null).result).toBeNull();
            });
        });
    });
});
