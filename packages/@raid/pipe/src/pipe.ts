export function pipe<A, B>(value: A, ab: (a: A) => B): B
export function pipe<A, B, C>(value: A, ab: (a: A) => B, bc: (b: B) => C): C
export function pipe<A, B, C, D>(
  value: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
): D
export function pipe<A, B, C, D, E>(
  value: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
): E
export function pipe<A, B, C, D, E, F>(
  value: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
): F
export function pipe<A, B, C, D, E, F, G>(
  value: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
): G
export function pipe<A, B, C, D, E, F, G, H>(
  value: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
): H
export function pipe<A, B, C, D, E, F, G, H, I>(
  value: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
): I
export function pipe<A, B, C, D, E, F, G, H, I>(
  value: A,
  ab: (a: A) => B,
  bc?: (b: B) => C,
  cd?: (c: C) => D,
  de?: (d: D) => E,
  ef?: (e: E) => F,
  fg?: (f: F) => G,
  gh?: (g: G) => H,
  hi?: (h: H) => I,
) {
  // biome-ignore lint/style/noArguments: used to determine type
  switch (arguments.length) {
    case 2:
      return ab(value)
    case 3:
      return bc?.(ab(value))
    case 4:
      return cd?.(bc?.(ab(value)) as C)
    case 5:
      return de?.(cd?.(bc?.(ab(value)) as C) as D)
    case 6:
      return ef?.(de?.(cd?.(bc?.(ab(value)) as C) as D) as E)
    case 7:
      return fg?.(ef?.(de?.(cd?.(bc?.(ab(value)) as C) as D) as E) as F)
    case 8:
      return gh?.(
        fg?.(ef?.(de?.(cd?.(bc?.(ab(value)) as C) as D) as E) as F) as G,
      )
    case 9:
      return hi?.(
        gh?.(
          fg?.(ef?.(de?.(cd?.(bc?.(ab(value)) as C) as D) as E) as F) as G,
        ) as H,
      )
    default:
      return value
  }
}
