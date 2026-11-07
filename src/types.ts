export interface Category {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  image: string;
  productCount: number;
  specs: {
    cut: string;
    pieces: string;
    hijabIncluded: boolean;
    recommendedFabric: string;
  };
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  image: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  featuredImage: string;
  colors: ProductColor[];
  sizes: string[];
}

export interface AudioGuide {
  id: string;
  fileName: string;
  title: string;
  stepNumber: number;
  targetTrigger: string;
  script: string;
  durationSeconds: number;
  notes: string;
}

export interface CustomerOrder {
  id: string;
  product: Product | null;
  selectedColor: ProductColor | null;
  selectedSize: string;
  quantity: number;
  customerName: string;
  city: string;
  address: string;
  phone: string;
  paymentMethod: 'cod' | 'bank_transfer';
  status: 'draft' | 'pending_admin_approval' | 'approved' | 'cancelled';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'customer';
  timestamp: string;
  type: 'text' | 'categories' | 'carousel' | 'colors' | 'sizes' | 'form' | 'summary' | 'status' | 'audio_note';
  text?: string;
  audioGuideId?: string;
  data?: any;
}
