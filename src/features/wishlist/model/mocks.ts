import type { WishlistItem } from './types';

const PRODUCTS = [
  { brand: 'Levis', name: 'LVC 1955 501', price: 340000 },
  { brand: 'Stüssy', name: 'Basic Logo Hoodie', price: 128000 },
  { brand: 'Nike', name: 'Air Jordan 1 Retro High', price: 189000 },
  { brand: 'New Balance', name: '993 Made in USA', price: 259000 },
  { brand: 'Our Legacy', name: 'Mohair Knit', price: 210000 },
  { brand: 'Guidi', name: '788 Boots', price: 420000 },
];

const SELLERS = ['yoonfit', 'minsu.log', 'closetroom', 'daily_archive'];

const TOTAL_MOCK_COUNT = 42;

export const mockWishlistItems: WishlistItem[] = Array.from(
  { length: TOTAL_MOCK_COUNT },
  (_, index) => {
    const product = PRODUCTS[index % PRODUCTS.length];
    const cycle = index % 5;
    const saleStatus = cycle === 2 ? 'unlisted' : 'onSale';
    const tradeStatus = cycle === 4 ? 'waiting' : 'none';

    return {
      id: `wishlist-${index}`,
      itemId: `item-${index}`,
      brand: product.brand,
      name: product.name,
      price: product.price,
      imageUrl: `https://picsum.photos/seed/wishlist-${index}/200/200`,
      saleStatus,
      tradeStatus,
      sellerName: SELLERS[index % SELLERS.length],
      updatedAt: `${(index % 6) + 1}일 전`,
      notifyEnabled: cycle !== 3,
    };
  },
);
