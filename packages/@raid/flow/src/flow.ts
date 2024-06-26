export function flow<A extends ReadonlyArray<unknown>, B>(
  ab: (...a: A) => B,
): (...a: A) => B
export function flow<A extends ReadonlyArray<unknown>, B, C>(
  ab: (...a: A) => B,
  bc: (b: B) => C,
): (...a: A) => C
export function flow<A extends ReadonlyArray<unknown>, B, C, D>(
  ab: (...a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
): (...a: A) => D
export function flow<A extends ReadonlyArray<unknown>, B, C, D, E>(
  ab: (...a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
): (...a: A) => E
export function flow<A extends ReadonlyArray<unknown>, B, C, D, E, F>(
  ab: (...a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
): (...a: A) => F
export function flow<A extends ReadonlyArray<unknown>, B, C, D, E, F, G>(
  ab: (...a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
): (...a: A) => G
export function flow<A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H>(
  ab: (...a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
): (...a: A) => H
export function flow<A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H, I>(
  ab: (...a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: I) => I,
): (...a: A) => I
export function flow<A extends ReadonlyArray<unknown>, B, C, D, E, F, G, H, I>(
  ab: (...a: A) => B,
  bc?: (b: B) => C,
  cd?: (c: C) => D,
  de?: (d: D) => E,
  ef?: (e: E) => F,
  fg?: (f: F) => G,
  gh?: (g: G) => H,
  hi?: (h: H) => I,
) {
  // biome-ignore lint/style/noArguments: <explanation>
  switch (arguments.length) {
    case 1:
      return ab
    case 2:
      return (...a: A) => bc?.(ab(...a))
    case 3:
      return (...a: A) => cd?.(bc?.(ab(...a)) as C)
    case 4:
      return (...a: A) => de?.(cd?.(bc?.(ab(...a)) as C) as D)
    case 5:
      return (...a: A) => ef?.(de?.(cd?.(bc?.(ab(...a)) as C) as D) as E)
    case 6:
      return (...a: A) =>
        fg?.(ef?.(de?.(cd?.(bc?.(ab(...a)) as C) as D) as E) as F)
    case 7:
      return (...a: A) =>
        gh?.(fg?.(ef?.(de?.(cd?.(bc?.(ab(...a)) as C) as D) as E) as F) as G)
    case 8:
      return (...a: A) =>
        hi?.(
          gh?.(
            fg?.(ef?.(de?.(cd?.(bc?.(ab(...a)) as C) as D) as E) as F) as G,
          ) as H,
        )
  }
}
