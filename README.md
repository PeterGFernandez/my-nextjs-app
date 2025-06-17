# my-nextjs-app


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), in which which I've also been using AI, primarily to implement [Authentication](https://discovery.cevolution.co.uk/ciam/authenticate/) and [Authorization](https://discovery.cevolution.co.uk/ciam/authorize/) as part of a CIAM Integration. 

The application is also a companion to the various Vibe Coding articles published on the [Discover CIAM Blog](https://discovery.cevolution.co.uk/ciam/?s=Vibe+Coding), and the various code branches reflect the various states of the application as related to each article. The main branch is typically kept up-to-date with the latest development overall.

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

We appreciate feedback and contribution to this repo, and invite you to [use issue tracking here on GitHub](https://github.com/PeterGFernandez/my-nextjs-app/issues). However, in the interest of _Responsible Disclosure_, please do not report security vulnerabilities on the public GitHub issue tracker and prefer to DM me instead. Thank you.

Additionally, you can check out [the Next.js GitHub repository](https://github.com/vercel/next.js), where your feedback and contributions are always welcome, too!

