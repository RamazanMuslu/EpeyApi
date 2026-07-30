export interface PhoneInfo {
  id: string;
  name: string;
  image: string;
  url?: string;
}

export interface Offer {
  seller: string;
  title: string;
  price: string;
  priceNumeric: number | null;
  shipping: string | null;
  link: string | null;
}

export interface PhoneDetail {
  id: string;
  epeyId: string;
  name: string;
  url: string;
  cover: string;
  userRating: string;
  offers: Offer[];
  specs: Record<string, Record<string, string>>;
}

export interface ImagesResponse {
  id: string;
  images: string[];
}
