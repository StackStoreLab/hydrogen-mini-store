import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {Money, type OptimisticCart} from '@shopify/hydrogen';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  return (
    <div className={`cart-summary cart-summary-${layout}`}>
      <dl className="cart-subtotal">
        <dt>Subtotal</dt>
        <dd>
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart.cost.subtotalAmount} />
          ) : (
            '–'
          )}
        </dd>
      </dl>
      <p className="muted small">Shipping and taxes calculated at checkout.</p>
      {cart?.checkoutUrl && (
        <a href={cart.checkoutUrl} target="_self" className="button button-block">
          Checkout
        </a>
      )}
    </div>
  );
}
