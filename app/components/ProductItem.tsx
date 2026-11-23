import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';

export function ProductItem({
  product,
  loading = 'lazy',
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const image = product.featuredImage;

  return (
    <Link className="product-card" prefetch="intent" to={`/products/${product.handle}`}>
      <div className="product-card-media">
        {image && (
          <Image
            alt={image.altText || product.title}
            aspectRatio="4/5"
            data={image}
            loading={loading}
            sizes="(min-width: 64em) 25vw, (min-width: 40em) 33vw, 50vw"
          />
        )}
      </div>
      <h3 className="product-card-title">{product.title}</h3>
      <div className="product-card-price">
        <Money data={product.priceRange.minVariantPrice} />
      </div>
    </Link>
  );
}
