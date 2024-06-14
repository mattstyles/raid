export type IsUndefined<T> = [T] extends [undefined] ? true : false
export type IfUndefined<T, A = true, B = false> = IsUndefined<T> extends true
  ? A
  : B

export type IsVoid<T> = IfUndefined<T, false, T extends void ? true : false>
export type IfVoid<T, A = true, B = false> = IsVoid<T> extends true ? A : B

export type IsError<T> = [T] extends [Error] ? true : false
export type IfError<T, A = true, B = false> = IsError<T> extends true ? A : B
export type NonError<T> = IfError<T, unknown, T>
