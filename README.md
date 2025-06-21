# my-nextjs-app

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), in which which I've also been using AI, primarily to implement [Authentication](https://discovery.cevolution.co.uk/ciam/authenticate/) and [Authorization](https://discovery.cevolution.co.uk/ciam/authorize/) as part of a CIAM Integration. The application is also a companion to the various Vibe Coding articles published on the [Discover CIAM Blog](https://discovery.cevolution.co.uk/ciam/?s=Vibe+Coding), and the various code branches reflect the various states of the application as related to each article. 

This branch is associated with the article [here](https://discovery.cevolution.co.uk/ciam/vibe-coded-authn/), with some additional updates related to the User Account and User Account presentation, and with my take on the followup exercises that were left for the reader to tackle (in no particular order):

- Skipping the NextAuth.js Signin page wasn't as straightforward for the AI as I'd of hoped 🤷🏻‍♂️ In the end I ended up getting the AI to convert the main page to being Client Side Rendered (CSR) and then told it to use the provider specific version of the `signIn()` method as described [here](https://next-auth.js.org/getting-started/client#signin). Arguably more of a limitation with NextAuth.js I feel, rather than with the AI.   

- Converting to CSR ultimately fixed the legacy behaviour issue too, though to be fair that was a relatively easy one to address by simply following the `Learn more:` link to the docs 😎

- For signout from Keycloak when signing out from the application, the AI recommended `NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL` as an additional `.env` entry and redirecting after calling `signOut({redirect:false})` (the latter facilitated by moving to a CSR pattern). Of course, Copilot made the necessary code changes for me 😁. It felt a little "clunky" if I'm honest, but it got the job done more or less. Perhaps this was again something of a limitiation in NextAuth.js rather that with the AI, and perhaps the price you pay for not using an IdP integrated SDK 🤷🏻‍♂️ My `.env` ended up looking something like the following:

```
KEYCLOAK_CLIENT_ID=nextjs-app
KEYCLOAK_ISSUER=https://<My Keycloak Domain>/realms/Cevolution
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_KEYCLOAK_ISSUER=${KEYCLOAK_ISSUER}
NEXT_PUBLIC_KEYCLOAK_LOGOUT_URL=${KEYCLOAK_ISSUER}/protocol/openid-connect/logout?redirect_uri=http%3A%2F%2Flocalhost%3A3000
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open [http://localhost:3000](http://localhost:3000) with your browser to see the result (the application is typically accessible via port `3000` though this may change based on your system configuration).

You can start editing the page by modifying `app/page.tsx`, and the page will typically auto-update as you edit the file. The project also uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about CIAM and building a CIAM integration, check out the various resources at [Discover CIAM](https://discovery.cevolution.co.uk/ciam/). To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deployment

The easiest way to deploy a Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), brought to you by the creators of Next.js. Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

For this application you will also need a suitable CIAM provider that is compatible with industry standard protocols including OIDC and OAuth 2.0. I personally use the open-source Keycloak service for this in a DIY fashion, and you can read more about this in my article [here](https://discovery.cevolution.co.uk/ciam/open-source-ciam-using-keycloak/) 

## Feedback

Feedback and contributions to this repo are appreciated, and you are invited to [use issue tracking here on GitHub](https://github.com/PeterGFernandez/my-nextjs-app/issues). However, in the interest of _Responsible Disclosure_, please do not report security vulnerabilities on the public GitHub issue tracker and prefer to DM me instead. Thank you.

Additionally, you can check out [the Next.js GitHub repository](https://github.com/vercel/next.js), where your feedback and contributions are always welcome, too!

