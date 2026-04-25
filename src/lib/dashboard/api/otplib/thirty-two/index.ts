/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
import thirtyTwo from './lib';
import {
  type Base32SecretKey,
  type KeyDecoder,
  type KeyEncoder,
  KeyEncodings,
  type SecretKey
} from '../core';

/**
 * - Key decoder using npm `thirty-two`
 */
export const keyDecoder: KeyDecoder = (
  encodedSecret: Base32SecretKey,
  encoding: KeyEncodings
): SecretKey => {
  return thirtyTwo.decode(encodedSecret).toString(encoding);
};

/**
 * - Key encoder using npm `thirty-two`
 */
export const keyEncoder: KeyEncoder = (
  secret: SecretKey,
  encoding: KeyEncodings
): Base32SecretKey => {
  return thirtyTwo
    .encode(Buffer.from(secret, encoding).toString('ascii'))
    .toString()
    .replace(/=/g, '');
};
