import {Suspense} from 'react';
import {Await, NavLink, Link, useAsyncValue} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment, LayoutQuery} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

type Collections = LayoutQuery['collections']['nodes'];

interface HeaderProps {
  shopName: string;
  collections: Collections;
  cart: Promise<CartApiQueryFragment | null>;
}

export function Header({shopName, collections, cart}: HeaderProps) {
  return (
    <header className="header">
      <div className="container header-inner">
        <MobileMenuToggle />
        <Link to="/" prefetch="intent" className="logo" aria-label={shopName}>
          <LogoMark />
          <span>{shopName}</span>
        </Link>
        <HeaderNav collections={collections} viewport="desktop" />
        <CartToggle cart={cart} />
      </div>
    </header>
  );
}

export function HeaderNav({
  collections,
  viewport,
}: {
  collections: Collections;
  viewport: 'desktop' | 'mobile';
}) {
  const {close} = useAside();
  const onClick = viewport === 'mobile' ? close : undefined;

  return (
    <nav className={`header-nav header-nav-${viewport}`} role="navigation">
      <NavLink end to="/" prefetch="intent" onClick={onClick}>
        Home
      </NavLink>
      <NavLink to="/collections/all" prefetch="intent" onClick={onClick}>
        Shop all
      </NavLink>
      {collections.map((collection) => (
        <NavLink
          key={collection.id}
          to={`/collections/${collection.handle}`}
          prefetch="intent"
          onClick={onClick}
        >
          {collection.title}
        </NavLink>
      ))}
    </nav>
  );
}

function MobileMenuToggle() {
  const {open} = useAside();
  return (
    <button
      className="icon-button menu-toggle"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartButton count={0} />}>
      <Await resolve={cart}>
        <CartCount />
      </Await>
    </Suspense>
  );
}

function CartCount() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartButton count={cart?.totalQuantity ?? 0} />;
}

function CartButton({count}: {count: number}) {
  const {open} = useAside();
  return (
    <a
      href="/cart"
      className="icon-button cart-toggle"
      aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
      onClick={(event) => {
        event.preventDefault();
        open('cart');
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6 7h12l-1 13H7L6 7Zm3 0a3 3 0 0 1 6 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
      {count > 0 && <span className="cart-badge">{count}</span>}
    </a>
  );
}

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path d="M10 22V10h3v4.5h6V10h3v12h-3v-4.5h-6V22z" fill="var(--color-bg)" />
    </svg>
  );
}
