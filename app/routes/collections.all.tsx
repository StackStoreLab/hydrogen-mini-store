import {useLoaderData} from 'react-router';
import type {Route} from './+types/collections.all';
import {getPaginationVariables} from '@shopify/hydrogen';
import {ProductGrid} from '~/components/ProductGrid';
import {SortSelect} from '~/components/SortSelect';
import {PRODUCT_ITEM_FRAGMENT} from '~/lib/fragments';
import {getSortFromRequest} from '~/lib/sort';

export const meta: Route.MetaFunction = () => [{title: 'All products'}];

export async function loader({context, request}: Route.LoaderArgs) {
  const {sort, sortKey, reverse} = getSortFromRequest(request, 'BEST_SELLING' as const);
  const pagination = getPaginationVariables(request, {pageBy: 12});

  const {products} = await context.storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {sortKey, reverse, ...pagination},
  });

  return {products, sort};
}

export default function AllProducts() {
  const {products, sort} = useLoaderData<typeof loader>();

  return (
    <div className="container section">
      <div className="collection-head">
        <h1>All products</h1>
        <SortSelect value={sort} />
      </div>
      <ProductGrid key={sort} connection={products} />
    </div>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      sortKey: $sortKey
      reverse: $reverse
    ) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
