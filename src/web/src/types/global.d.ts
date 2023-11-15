type Nullable<T> = T | null;
type Recordable<T = any> = Record<string, T>;
type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T;
};
