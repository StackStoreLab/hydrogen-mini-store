export const SORT_OPTIONS = [
  {value: 'featured', label: 'Featured'},
  {value: 'price-asc', label: 'Price: low to high'},
  {value: 'price-desc', label: 'Price: high to low'},
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

/** Reads ?sort= from the request and returns the Storefront API sort variables. */
export function getSortFromRequest<FeaturedKey extends string>(
  request: Request,
  featuredKey: FeaturedKey,
): {sort: SortValue; sortKey: FeaturedKey | 'PRICE'; reverse: boolean} {
  const param = new URL(request.url).searchParams.get('sort');
  const sort: SortValue = SORT_OPTIONS.some((option) => option.value === param)
    ? (param as SortValue)
    : 'featured';

  if (sort === 'featured') return {sort, sortKey: featuredKey, reverse: false};
  return {sort, sortKey: 'PRICE', reverse: sort === 'price-desc'};
}
