import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {ProductItem} from '~/components/ProductItem';
import {PRODUCT_ITEM_FRAGMENT} from '~/lib/fragments';

export const meta: Route.MetaFunction = ({matches}) => {
  const shopName = matches[0]?.loaderData?.layout?.shop?.name ?? 'Store';
  return [{title: `${shopName} | Home`}];
};

export async function loader({context}: Route.LoaderArgs) {
  const {products} = await context.storefront.query(FEATURED_PRODUCTS_QUERY, {
    cache: context.storefront.CacheShort(),
  });
  return {products: products.nodes};
}

export default function Homepage() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow">New season</p>
          <h1>Everyday essentials, made to last.</h1>
          <p className="hero-copy">
            Clean cuts, soft fabrics and colors that work with everything you
            already own.
          </p>
          <Link to="/collections/all" className="button" prefetch="intent">
            Shop the collection
          </Link>
        </div>
      </section>

      <section className="container section" aria-labelledby="featured">
        <div className="section-head">
          <h2 id="featured">Featured products</h2>
          <Link to="/collections/all" prefetch="intent" className="text-link">
            View all
          </Link>
        </div>
        <div className="product-grid">
          {products.map((product, index) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 4 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
      </section>
    </>
  );
}

const FEATURED_PRODUCTS_QUERY = `#graphql
  query FeaturedProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: BEST_SELLING) {
      nodes {
        ...ProductItem
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
