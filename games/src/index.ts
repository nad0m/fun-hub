//index.ts

// for some reason the compiler doesnt like named exports like:
// (export { TheMind, TheMindPlayer, TheMindState } from './the-mind')
// please use generic export *

export * from './types'
export * from './the-mind'
export * from './tic-tac-toe'
export * from './love-letter'
export * from './connect-four'
export * from './connect-four-sp';
