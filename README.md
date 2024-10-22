# Codenamize (Typescript)

**Generate consistent easier-to-remember codenames from strings, numbers, or other seed inputs.**

## Overview

**Codenamize** is a TypeScript library for generating deterministic, alternative codenames for a given seed input. Using codenames in place of awkward identifiers, such as UUIDs, hashes, network addresses etc, helps human users to recall and quickly identify strings.

This is a Typescript port of the JavaScript adaption [codenamize-js](https://github.com/stemail23/codenamize-js) library of the original Python [codenamize](https://github.com/jjmontesl/codenamize) library, with extra extended capability!

## Installation

Install from the [npm repository](https://www.npmjs.com/package/tadesf/codenamize-ts).

```bash
npm install codenamize-ts
yarn add codenamize-ts
bun install codenamize-ts
```

## Usage

### Importing

```typescript
import { codenamize } from 'codenamize-ts';
```

### Generating codenames

#### seed value

Output is deterministically based on the input seed. Numbers are converted to the equivalent string value.

The codenamize argument can be either a simple string or number argument…

```javascript
codenamize(1);
// 'poor-foundation'

codenamize('1');
// 'poor-foundation'

codenamize('11:22:33:44:55:66');
// 'frantic-shape'
```

… or an `options` object argument.

```typescript
codenamize({ seed: '1' });
// 'poor-foundation'

codenamize({ seed: '11:22:33:44:55:66' });
// 'frantic-shape'
```

#### classic mode

Classic mode uses `options.adjectiveCount` to determine the composition of the codename output, which will be made up of the specified number of adjectives, followed by a noun. Note that prepending more adjectives retains the existing codename words.

```typescript
codenamize({ seed: '11:22:33:44:55:66', adjectiveCount: 2 });
// 'ruddy-frantic-shape'

codenamize({ seed: '11:22:33:44:55:66', adjectiveCount: 3 });
// 'vague-ruddy-frantic-shape'
```

#### particles mode

Instead of `options.adjectiveCount`, the `options.particles` argument can alternatively be used to specify a more precise composition for the produced codename. The argument is an array of word categories which will be appended together to produce the output codename.

```typescript
codenamize({ seed: '11:22:33:44:55:66', particles: ['adjective', 'noun'] });
// 'frantic-shape'

codenamize({ seed: '11:22:33:44:55:66', particles: ['noun', 'adjective', 'noun'] });
// 'worry-frantic-shape'
```

#### other options

These options can be used in either classic, or particles mode.

`options.maxItemChars` specifies the maximum length of each codename word.

```typescript
codenamize({ seed: '11:22:33:44:55:66', adjectiveCount: 2, maxItemChars: 3 });
// 'hot-shy-age'

codenamize({ seed: '11:22:33:44:55:66', adjectiveCount: 2, maxItemChars: 4 });
// 'even-cute-face'
```

`options.capitalize` determines whether each word in the codename will be capitalized.

```typescript
codenamize({ seed: '11:22:33:44:55:66', capitalize: true });
// 'Frantic-Shape'
```

`options.separator` specifies the character(s) used to combine the parts of the codename.

```typescript
codenamize({ seed: '11:22:33:44:55:66', separator: ':' });
// 'frantic:shape'
```

### Extending the codename vocabulary

Straight out of the box, **Codenamize** emulates the behaviour of the original [Python library](https://github.com/jjmontesl/codenamize), and contains the same noun and adjective lists. Generated codenames with either library should be identical for a given  input.

**Codenamize** can be extended with extra word lists with the `use` function. The `use` function takes a single object argument with keys representing each category of word, and values being arrays of words corresponding to the category.

```javascript
codenamize.use({ color: [ 'red', 'green', 'blue' ], animal: [ 'pig', 'dog', 'cat' ] });

codenamize({ seed: '11:22:33:44:55:66', particles: ['color', 'animal'] });
// 'blue-pig'
```

Note that in a real situation, a much more extensive list of words would likely be provide for each catagory of word.

## Other versions

* [Codenamize-js](https://github.com/stemail23/codenamize-js) – JavaScript (the base for this library)
* [Codenamize](https://github.com/jjmontesl/codenamize) - Python (the original!)
* [Concode](https://github.com/DannyBen/concode) - Ruby
