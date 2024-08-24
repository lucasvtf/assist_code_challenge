import { verifyToken } from './jwt';

export function parseCookieToken(
  cookieHeader: string,
  token: string,
): string | undefined {
  const cookies = cookieHeader
    .split(';')
    .reduce<Record<string, string>>((cookieMap, cookie) => {
      const [name, value] = cookie.split('=').map((c) => c.trim());
      if (name) {
        cookieMap[name] = value;
      }
      return cookieMap;
    }, {});

  return cookies[token];
}

export function decodeTokens(tokens: string[]): any[] {
  return tokens.map((token) => verifyToken(token));
}
