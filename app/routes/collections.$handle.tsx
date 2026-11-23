import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {ProductGrid} from '~/components/ProductGrid';
import {SortSelect} from '~/components/SortSelect';
import {PRODUCT_ITEM_FRAGMENT} from '~/lib/fragments';
import {getSortFromRequest} from '~/lib/sort';

export const meta: Route.MetaFunction = ({data}) => [
  {title: `${data?.collection.title ?? 'Collection'}`},
];

export async function loader({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  if (!handle) throw redirect('/collections');

  const {sort, sortKey, reverse} = getSortFromRequest(
    request,
    'COLLECTION_DEFAULT' as const,
  );
  const pagination = getPaginationVariables(request, {pageBy: 12});

  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {handle, sortKey, reverse, ...pagination},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  return {collection, sort};
}

export default function Collection() {
  const {collection, sort} = useLoaderData<typeof loader>();

  return (
    <div className="container section">
      <div className="collection-head">
        <div>
          <h1>{collection.title}</h1>
          {collection.description && (
            <p className="muted">{collection.description}</p>
          )}
        </div>
        <SortSelect value={sort} />
      </div>
      <ProductGrid key={sort} connection={collection.products} />
      <Analytics.CollectionView
        data={{collection: {id: collection.id, handle: collection.handle}}}
      />
    </div>
  );
}

const COLLECTION_QUERY = `#graphql
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
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
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
