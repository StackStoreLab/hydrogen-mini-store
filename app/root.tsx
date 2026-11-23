import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  Link,
} from 'react-router';
import type {Route} from './+types/root';
import favicon from '~/assets/favicon.svg';
import {LAYOUT_QUERY} from '~/lib/fragments';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import {PageLayout} from './components/PageLayout';

export type RootLoader = typeof loader;

/** Root data (shop + navigation) only needs to reload after cart mutations. */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;
  return false;
};

export function links() {
  return [
    {rel: 'preconnect', href: 'https://cdn.shopify.com'},
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

export async function loader({context}: Route.LoaderArgs) {
  const {storefront, env, cart} = context;

  const layout = await storefront.query(LAYOUT_QUERY, {
    cache: storefront.CacheLong(),
  });

  return {
    layout,
    cart: cart.get(),
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');

  if (!data) return <Outlet />;

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      <PageLayout layout={data.layout} cart={data.cart}>
        <Outlet />
      </PageLayout>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let status = 500;
  let message = 'Something went wrong.';

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = status === 404 ? 'This page could not be found.' : message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="container route-error">
      <p className="eyebrow">Error {status}</p>
      <h1>{message}</h1>
      <Link to="/" className="button">
        Back to home
      </Link>
    </div>
  );
}
