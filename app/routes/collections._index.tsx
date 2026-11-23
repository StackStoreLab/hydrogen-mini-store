import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/collections._index';
import {Image} from '@shopify/hydrogen';

export const meta: Route.MetaFunction = () => [{title: 'Collections'}];

export async function loader({context}: Route.LoaderArgs) {
  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    cache: context.storefront.CacheLong(),
  });
  return {collections: collections.nodes};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="container section">
      <h1>Collections</h1>
      <div className="collection-grid">
        {collections.map((collection, index) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.handle}`}
            prefetch="intent"
            className="collection-card"
          >
            {collection.image && (
              <Image
                data={collection.image}
                alt={collection.image.altText || collection.title}
                aspectRatio="4/3"
                loading={index < 3 ? 'eager' : 'lazy'}
                sizes="(min-width: 40em) 33vw, 100vw"
              />
            )}
            <h2>{collection.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query StoreCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 20) {
      nodes {
        id
        title
        handle
        image {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
` as const;
