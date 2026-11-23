import {Await} from 'react-router';
import {Suspense} from 'react';
import type {CartApiQueryFragment, LayoutQuery} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderNav} from '~/components/Header';
import {CartMain} from '~/components/CartMain';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  layout: LayoutQuery;
  children?: React.ReactNode;
}

export function PageLayout({cart, layout, children = null}: PageLayoutProps) {
  const collections = layout.collections.nodes;

  return (
    <Aside.Provider>
      <Aside type="cart" heading="Your cart">
        <Suspense fallback={<p className="muted">Loading cart…</p>}>
          <Await resolve={cart}>
            {(cart) => <CartMain cart={cart} layout="aside" />}
          </Await>
        </Suspense>
      </Aside>
      <Aside type="mobile" heading="Menu">
        <HeaderNav collections={collections} viewport="mobile" />
      </Aside>
      <Header shopName={layout.shop.name} collections={collections} cart={cart} />
      <main>{children}</main>
      <Footer shopName={layout.shop.name} collections={collections} />
    </Aside.Provider>
  );
}
