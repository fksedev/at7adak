/**
 * otplib-preset-default
 *
 * Provides fully initialised classes that are targeted
 * at the node environment. This is meant for getting started
 * quickly.
 *
 * If you want to use your own Base32 and/or crypto plugin, it
 * would be better to create a new file in your project and initialise
 * the core classes manually.
 *
 * Uses:
 *
 * - Base32: 'plugin-thirty-two'
 * - Crypto: 'plugin-crypto'
 */
import { createDigest, createRandomBytes } from './crypto';
import { keyDecoder, keyEncoder } from './thirty-two';
import {
  Authenticator,
  type AuthenticatorOptions,
  HOTP,
  type HOTPOptions,
  TOTP,
  type TOTPOptions
} from './core';

export const hotp = new HOTP<HOTPOptions>({
  createDigest
});

export const totp = new TOTP<TOTPOptions>({
  createDigest
});

export const authenticator = new Authenticator<AuthenticatorOptions>({
  createDigest,
  createRandomBytes,
  keyDecoder,
  keyEncoder
});
