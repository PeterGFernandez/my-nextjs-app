import { jwtVerify, createRemoteJWKSet } from 'jose';

const issuer = process.env.KEYCLOAK_ISSUER;
if (!issuer) throw new Error('KEYCLOAK_ISSUER env var is required');
const JWKS = createRemoteJWKSet(new URL(issuer.endsWith('/') ? issuer + 'protocol/openid-connect/certs' : issuer + '/protocol/openid-connect/certs'));

export async function verifyAccessToken(authorizationHeader: string | undefined) {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new Error('No Bearer token');
  }
  const token = authorizationHeader.slice(7);
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer,
    });
    return payload;
  } catch {
    throw new Error('Invalid token');
  }
}
