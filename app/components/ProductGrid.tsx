import {Pagination} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';

type Connection = React.ComponentProps<
  typeof Pagination<ProductItemFragment>
>['connection'];

/** Paginated product grid used by collection pages. */
export function ProductGrid({connection}: {connection: Connection}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => (
        <>
          <PreviousLink className="load-more">
            {isLoading ? 'Loading…' : 'Load previous'}
          </PreviousLink>
          <div className="product-grid">
            {nodes.map((product, index) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
          {nodes.length === 0 && (
            <p className="muted">No products in this collection yet.</p>
          )}
          <NextLink className="load-more">
            {isLoading ? 'Loading…' : 'Load more'}
          </NextLink>
        </>
      )}
    </Pagination>
  );
}
