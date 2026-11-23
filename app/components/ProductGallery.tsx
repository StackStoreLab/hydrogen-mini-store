import {useEffect, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import type {ProductVariantFragment} from 'storefrontapi.generated';

type GalleryImage = NonNullable<ProductVariantFragment['image']>;

/**
 * Main image plus thumbnails. Selecting a variant switches the main image
 * to that variant's image; thumbnails let shoppers browse the rest.
 */
export function ProductGallery({
  images,
  selectedImage,
  title,
}: {
  images: GalleryImage[];
  selectedImage?: GalleryImage | null;
  title: string;
}) {
  const [activeId, setActiveId] = useState(selectedImage?.id ?? images[0]?.id);

  useEffect(() => {
    if (selectedImage?.id) setActiveId(selectedImage.id);
  }, [selectedImage?.id]);

  const active =
    images.find((image) => image.id === activeId) ?? selectedImage ?? images[0];

  if (!active) return <div className="product-gallery-main placeholder" />;

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        <Image
          key={active.id}
          data={active}
          alt={active.altText || title}
          aspectRatio="4/5"
          sizes="(min-width: 48em) 50vw, 100vw"
          loading="eager"
        />
      </div>
      {images.length > 1 && (
        <div className="product-gallery-thumbs">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={image.id === active.id ? 'is-active' : undefined}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-current={image.id === active.id}
              onClick={() => setActiveId(image.id)}
            >
              <Image
                data={image}
                alt=""
                aspectRatio="1/1"
                width={96}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
