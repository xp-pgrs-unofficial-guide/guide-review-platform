import { NextPage } from 'next';

declare module 'next' {
  export type PageProps = {
    params?: any;
    searchParams?: any;
  };
  export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP>;
}
