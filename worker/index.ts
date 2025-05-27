import { decode, verify } from '@tsndr/cloudflare-worker-jwt';
import JwkToPem from 'jwk-to-pem';

// // import.meta.env.VITE_AUTHORITY_URI

//`http://localhost:8787/.well-known/jwks.json` 
//  jwksUri: `${import.meta.env.VITE_AUTHORITY_URI}/.well-known/jwks.json`


// Heavily influenced by https://gitlab.com/JacoKoster/node-jwks-client but this uses node-fetch which will not work in Cloudflare workers
async function fetchPublicKey(kid: string) {

  type JwkCompatibleKey = {
    kid: string;
    use: string;
    kty: string;
    n: string;
    e: string;
    [key: string]: unknown;
  };

  interface KeyResponse {
    keys: JwkCompatibleKey[]
  }

  interface PemKey {
    kid: string;
    publicKey: string;
  }

  const response = await fetch(`${import.meta.env.VITE_AUTHORITY_URI}.well-known/jwks.json`)

  let keyRing: KeyResponse = {keys: []}
  let data = await response.text()

  if(!response.ok) {
        //console.log(response.statusText)
        throw Error(`Error with keys from ${import.meta.env.VITE_AUTHORITY_URI}.well-known/jwks.json`);
  } else {
    keyRing = JSON.parse(data);
  }

  function isValidRsaKey(key: any): key is JwkCompatibleKey & { kty: "RSA" } {
    return (
      key &&
      typeof key.kid === 'string' &&
      key.use === 'sig' &&
      key.kty === 'RSA' &&
      typeof key.n === 'string' &&
      typeof key.e === 'string'
    );
  }

  const signingKeys: PemKey[] = keyRing.keys
    .filter(isValidRsaKey)
    .filter((key) => key.kid === kid)
    .map((key) => ({
      kid: key.kid,
      publicKey: JwkToPem(key),
    }));

  if(signingKeys.length != 1)
    throw new Error("No key matching kid could be found")

  return signingKeys[0].publicKey

}

interface Env {
  ASSETS: Fetcher;
}

async function denyAuthorisation(headers: Headers) {

  const token = headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
        return new Response('Unauthorized', { status: 401 });
    }

    const decodedToken = decode(token);

    if(!decodedToken.header)
      return new Response('No header in decoded token', { status: 500 });

    // Unfortunately, kid is not on the header type in cloudflare-worker-jwt...
    const kid = (decodedToken.header as Record<string, string>)['kid'];

    const authorityKey = await fetchPublicKey(kid);
    
    if(!authorityKey) {
      return new Response('Could not get Authority Public Key', { status: 500 });
    }

    const algo = decodedToken.header?.alg;
    const verifiedToken = await verify(token, authorityKey, algo);

    if (!verifiedToken) {
        return new Response('Unauthorized', { status: 401 });
    }

}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    try {

      const response = await denyAuthorisation(request.headers)

      if(response)
        return response

      if (url.pathname.startsWith("/api/")) {
        return Response.json({
          name: "Superstar!",
        });
      }

      return new Response(null, { status: 404 });

    } catch(err) {
      console.log("Error=", err)
      return new Response('Unauthorized', { status: 401 });
    }

  },
} satisfies ExportedHandler<Env>;