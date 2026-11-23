import {Link} from 'react-router';
import type {LayoutQuery} from 'storefrontapi.generated';

export function Footer({
  shopName,
  collections,
}: {
  shopName: string;
  collections: LayoutQuery['collections']['nodes'];
}) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          © {new Date().getFullYear()} {shopName}
        </p>
        <nav className="footer-nav">
          <Link to="/collections/all">Shop all</Link>
          {collections.map((collection) => (
            <Link key={collection.id} to={`/collections/${collection.handle}`}>
              {collection.title}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
