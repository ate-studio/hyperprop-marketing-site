export type DataSource = 'live' | 'placeholder';

export interface Sourced<T> {
  data: T;
  source: DataSource;
  asOf: string | null;
}

export function placeholderEnvelope<T>(data: T): Sourced<T> {
  return {
    data,
    source: 'placeholder',
    asOf: null,
  };
}

export function liveEnvelope<T>(data: T, asOf: string): Sourced<T> {
  return {
    data,
    source: 'live',
    asOf,
  };
}
