import { test } from "@jest/globals";

// FUZZERS

const $generate = Symbol("Fuzzer/generate");

export class Fuzzer<T> {
  /** Given a PRNG seed between 0 and 1, generate a value. */
  private generator: (prng: number) => T;

  // CONSTRUCTORS

  private constructor(func: (prng: number) => T) {
    this.generator = func;
  }

  /** Generate an integer.
   *
   * This does not include NaN, Infinity, or -Infinity.
   */
  public static int: Fuzzer<number> = new Fuzzer(prng => {
    // Favor smaller values
    const weightedPrng = prng ** 30;

    if (prng < 0.5) {
      return Math.ceil(weightedPrng * Number.MIN_SAFE_INTEGER);
    }
    else {
      return Math.floor(weightedPrng * Number.MAX_SAFE_INTEGER);
    }
  });

  /** Generate an integer between two values, inclusive. */
  public static intRange(min: number, max: number): Fuzzer<number> {
    return new Fuzzer(prng => Math.floor(prng * (max + 1 - min) + min));
  }

  /** Generate a float.
   *
   * This does not include NaN, Infinity, or -Infinity.
   */
  public static float: Fuzzer<number> = new Fuzzer(
    prng => Fuzzer.int[$generate]() + prng,
  );

  /** Generate a random string of ASCII characters.
   *
   * Favors smaller strings.
   */
  public static string: Fuzzer<string> = new Fuzzer(prng => {
    const length = Math.floor(100 * prng);

    return Array(length).fill(null).map(() => {
      const char = Fuzzer.intRange(32, 126)[$generate](); // printable ASCII

      return String.fromCharCode(char);
    }).join("");
  });

  /** "Generate" a constant value.
   *
   * Useful when defining larger fuzzers and you need hardcoded values.
   */
  public static constant<T>(value: T): Fuzzer<T> {
    return new Fuzzer(_prng => value);
  }

  /** Given a fuzzer of some type, generate an array full of that type.
   *
   * The generated array can be large, small, even empty!
   */
  public static array<T>(fuzzer: Fuzzer<T>): Fuzzer<Array<T>> {
    return new Fuzzer(prng => {
      // Favor smaller arrays
      const length = Math.floor(100 * (prng ** 30));

      return Array(length).fill(null).map(() => fuzzer[$generate]());
    });
  }

  // STATIC METHODS

  /** Transforms the result of a fuzzer. */
  public static map<A, B>(fuzzer: Fuzzer<A>, func: (value: A) => B): Fuzzer<B> {
    return new Fuzzer(_prng => func(fuzzer[$generate]()));
  }

  /** Transforms the results of two fuzzers. */
  public static map2<A, B, C>(
    func: (first: A, second: B) => C,
    fuzzerA: Fuzzer<A>,
    fuzzerB: Fuzzer<B>,
  ): Fuzzer<C> {
    return new Fuzzer(_prng => func(
      fuzzerA[$generate](),
      fuzzerB[$generate](),
    ));
  }

  /** Transforms the results of three fuzzers. */
  public static map3<A, B, C, D>(
    func: (first: A, second: B, third: C) => D,
    fuzzerA: Fuzzer<A>,
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
  ): Fuzzer<D> {
    return new Fuzzer(_prng => func(
      fuzzerA[$generate](),
      fuzzerB[$generate](),
      fuzzerC[$generate](),
    ));
  }

  /** Transforms the results of four fuzzers. */
  public static map4<A, B, C, D, E>(
    func: (first: A, second: B, third: C, fourth: D) => E,
    fuzzerA: Fuzzer<A>,
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
    fuzzerD: Fuzzer<D>,
  ): Fuzzer<E> {
    return new Fuzzer(_prng => func(
      fuzzerA[$generate](),
      fuzzerB[$generate](),
      fuzzerC[$generate](),
      fuzzerD[$generate](),
    ));
  }

  /** Transforms the results of five fuzzers. */
  public static map5<A, B, C, D, E, F>(
    func: (first: A, second: B, third: C, fourth: D, fifth: E) => F,
    fuzzerA: Fuzzer<A>,
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
    fuzzerD: Fuzzer<D>,
    fuzzerE: Fuzzer<E>,
  ): Fuzzer<F> {
    return new Fuzzer(_prng => func(
      fuzzerA[$generate](),
      fuzzerB[$generate](),
      fuzzerC[$generate](),
      fuzzerD[$generate](),
      fuzzerE[$generate](),
    ));
  }

  /** Transforms the results of six fuzzers. */
  public static map6<A, B, C, D, E, F, G>(
    func: (first: A, second: B, third: C, fourth: D, fifth: E, sixth: F) => G,
    fuzzerA: Fuzzer<A>,
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
    fuzzerD: Fuzzer<D>,
    fuzzerE: Fuzzer<E>,
    fuzzerF: Fuzzer<F>,
  ): Fuzzer<G> {
    return new Fuzzer(_prng => func(
      fuzzerA[$generate](),
      fuzzerB[$generate](),
      fuzzerC[$generate](),
      fuzzerD[$generate](),
      fuzzerE[$generate](),
      fuzzerF[$generate](),
    ));
  }

  /** Transforms the results of seven fuzzers. */
  public static map7<A, B, C, D, E, F, G, H>(
    func: (
      first: A,
      second: B,
      third: C,
      fourth: D,
      fifth: E,
      sixth: F,
      seventh: G,
    ) => H,
    fuzzerA: Fuzzer<A>,
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
    fuzzerD: Fuzzer<D>,
    fuzzerE: Fuzzer<E>,
    fuzzerF: Fuzzer<F>,
    fuzzerG: Fuzzer<G>,
  ): Fuzzer<H> {
    return new Fuzzer(_prng => func(
      fuzzerA[$generate](),
      fuzzerB[$generate](),
      fuzzerC[$generate](),
      fuzzerD[$generate](),
      fuzzerE[$generate](),
      fuzzerF[$generate](),
      fuzzerG[$generate](),
    ));
  }

  /** Transforms the results of eight fuzzers. */
  public static map8<A, B, C, D, E, F, G, H, I>(
    func: (
      first: A,
      second: B,
      third: C,
      fourth: D,
      fifth: E,
      sixth: F,
      seventh: G,
      eighth: H,
    ) => I,
    fuzzerA: Fuzzer<A>,
    fuzzerB: Fuzzer<B>,
    fuzzerC: Fuzzer<C>,
    fuzzerD: Fuzzer<D>,
    fuzzerE: Fuzzer<E>,
    fuzzerF: Fuzzer<F>,
    fuzzerG: Fuzzer<G>,
    fuzzerH: Fuzzer<H>,
  ): Fuzzer<I> {
    return new Fuzzer(_prng => func(
      fuzzerA[$generate](),
      fuzzerB[$generate](),
      fuzzerC[$generate](),
      fuzzerD[$generate](),
      fuzzerE[$generate](),
      fuzzerF[$generate](),
      fuzzerG[$generate](),
      fuzzerH[$generate](),
    ));
  }

  /** Create a new fuzzer based on the results of the last fuzzer. */
  public static andThen<A, B>(
    fuzzer: Fuzzer<A>,
    callback: (value: A) => Fuzzer<B>,
  ): Fuzzer<B> {
    return callback(fuzzer[$generate]());
  }

  // INSTANCE METHODS

  /** Transforms the result of this fuzzer. */
  public map<B>(func: (value: T) => B): Fuzzer<B> {
    return Fuzzer.map(this, func);
  }

  /** Create a new fuzzer based on the results of this fuzzer. */
  public andThen<B>(callback: (value: T) => Fuzzer<B>): Fuzzer<B> {
    return Fuzzer.andThen(this, callback);
  }

  /** Generate the value described by this fuzzer. */
  public [$generate](): T {
    return this.generator(Math.random());
  }
}

// TESTS

const TEST_PASSES = 100;

/** Use a fuzzer to generate a value for use in a test. */
export function fuzz<A>(
  fuzzer: Fuzzer<A>,
  desc: string,
  func: (value: A) => void,
): void {
  test(desc, () => {
    for (let i = 0; i < TEST_PASSES; i += 1) {
      func(fuzzer[$generate]());
    }
  });
}

/** Use two fuzzers to generate two values for use in a test. */
export function fuzz2<A, B>(
  fuzzerA: Fuzzer<A>,
  fuzzerB: Fuzzer<B>,
  desc: string,
  func: (first: A, second: B) => void,
): void {
  test(desc, () => {
    for (let i = 0; i < TEST_PASSES; i += 1) {
      func(fuzzerA[$generate](), fuzzerB[$generate]());
    }
  });
}

/** Use three fuzzers to generate three values for use in a test. */
export function fuzz3<A, B, C>(
  fuzzerA: Fuzzer<A>,
  fuzzerB: Fuzzer<B>,
  fuzzerC: Fuzzer<C>,
  desc: string,
  func: (first: A, second: B, third: C) => void,
): void {
  test(desc, () => {
    for (let i = 0; i < TEST_PASSES; i += 1) {
      func(fuzzerA[$generate](), fuzzerB[$generate](), fuzzerC[$generate]());
    }
  });
}

/** Use a fuzzer to generate a value for use in a verbose test.
 *
 * This is like `fuzz()`, except the generated value is displayed, too.
 */
export function fuzzExplained<A>(
  fuzzer: Fuzzer<A>,
  desc: string,
  func: (value: A) => void,
): void {
  for (let i = 0; i < TEST_PASSES; i += 1) {
    const a = fuzzer[$generate]();

    test(`${desc}\nValue #1: ${a}`, () => {
      func(a);
    });
  }
}

/** Use two fuzzers to generate two values for use in a verbose test.
 *
 * This is like `fuzz2()`, except the generated values are displayed, too.
 */
export function fuzz2Explained<A, B>(
  fuzzerA: Fuzzer<A>,
  fuzzerB: Fuzzer<B>,
  desc: string,
  func: (first: A, second: B) => void,
): void {
  for (let i = 0; i < TEST_PASSES; i += 1) {
    const a = fuzzerA[$generate]();
    const b = fuzzerB[$generate]();

    test(`${desc}\nValue #1: ${a}\nValue #2: ${b}`, () => {
      func(a, b);
    });
  }
}

/** Use three fuzzers to generate three values for use in a verbose test.
 *
 * This is like `fuzz3()`, except the generated values are displayed, too.
 */
export function fuzz3Explained<A, B, C>(
  fuzzerA: Fuzzer<A>,
  fuzzerB: Fuzzer<B>,
  fuzzerC: Fuzzer<C>,
  desc: string,
  func: (first: A, second: B, third: C) => void,
): void {
  for (let i = 0; i < TEST_PASSES; i += 1) {
    const a = fuzzerA[$generate]();
    const b = fuzzerB[$generate]();
    const c = fuzzerC[$generate]();

    test(`${desc}\nValue #1: ${a}\nValue #2: ${b}\nValue #3: ${c}`, () => {
      func(a, b, c);
    });
  }
}
