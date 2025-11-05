// API service for SOUTH CLUB backend
const API_BASE_URL = 'https://southclub.ru/api/v1';

// Import utility for secure URLs
import { ensureHttps } from '../utils/secureUrl';

// Simple cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Build absolute URL for backend-served files
export const buildFileUrl = (filePath: string): string => {
  if (!filePath) return filePath;
  
  // Если уже полный URL, принудительно используем HTTPS
  if (/^https?:\/\//i.test(filePath)) {
    return ensureHttps(filePath);
  }
  
  try {
    const origin = new URL(API_BASE_URL).origin;
    
    // Если путь содержит /app/uploads/products/, это путь из Docker контейнера
    // Файлы находятся в /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/ на сервере
    // Обращаемся напрямую к файлам без API запросов
    if (filePath.includes('/app/uploads/products/')) {
      // Извлекаем только название файла из полного пути
      const fileName = filePath.split('/').pop();
      return ensureHttps(`${origin}/uploads/products/${fileName}`);
    }
    
    // Если путь содержит /app/uploads/slider/, это путь из Docker контейнера для слайдера
    if (filePath.includes('/app/uploads/slider/')) {
      // Извлекаем только название файла из полного пути
      const fileName = filePath.split('/').pop();
      return ensureHttps(`${origin}/uploads/slider/${fileName}`);
    }
    
    // Если путь уже содержит /uploads/products/, используем как есть
    if (filePath.startsWith('/uploads/products/')) {
      return ensureHttps(`${origin}${filePath}`);
    }
    
    // Если путь уже содержит /uploads/slider/, используем как есть
    if (filePath.startsWith('/uploads/slider/')) {
      return ensureHttps(`${origin}${filePath}`);
    }
    
    // Для всех остальных путей добавляем origin
    return ensureHttps(`${origin}${filePath}`);
  } catch (error) {
    console.warn('Error building file URL:', error, 'for path:', filePath);
    return ensureHttps(filePath);
  }
};

// Size mapping constants
export const SIZE_OPTIONS = [
  { value: 0, label: 'XS' },
  { value: 1, label: 'S' },
  { value: 2, label: 'M' },
  { value: 3, label: 'L' },
  { value: 4, label: 'XL' },
];

export const getSizeLabel = (size: number): string => {
  const option = SIZE_OPTIONS.find(opt => opt.value === size);
  return option ? option.label : `Size ${size}`;
};

// Types based on API schema
export interface Product {
  id: string;
  name: string;
  sku?: string;
  soon?: boolean;
  color?: string;
  composition?: string;
  print_technology?: string;
  size: number[]; // Array of sizes (0-5) - matches backend field name
  price: number;
  photos: ProductPhoto[];
  order_number?: number;
}

export interface ProductPhoto {
  id: string;
  product_id: string;
  name: string;
  file_path: string;
  priority: number; // 0-2
}

export interface ProductCreate {
  name: string;
  sku?: string;
  soon?: boolean;
  color?: string;
  composition?: string;
  print_technology?: string;
  size: number[]; // Array of sizes (0-5) - matches backend field name
  price: number;
}

export interface ProductUpdate {
  name?: string;
  sku?: string;
  soon?: boolean;
  color?: string;
  composition?: string;
  print_technology?: string;
  size?: number[]; // Array of sizes (0-5) - matches backend field name
  price?: number;
  order_number?: number;
}

// Photo upload types
export interface PhotoUpload {
  file: File;
  priority: number;
  name: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  size: number;
}

export interface SliderPhoto {
  id: string;
  name: string;
  file_path: string;
  order_number: number;
}

export interface SliderListResponse {
  photos: SliderPhoto[];
  total: number;
}

export interface FeedbackCreate {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
}

export interface AdminLogin {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Order types
export interface OrderItem {
  product_id: string;
  quantity: number;
  size: number;
  price: number;
}

export interface OrderCreate {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  items: OrderItem[];
  total_amount: number;
  payment_method: 'yookassa' | 'cash';
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  items: OrderItem[];
  total_amount: number;
  payment_method: 'yookassa' | 'cash';
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_url?: string;
  payment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderStatus {
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  updated_at: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  size: number;
}

export interface OrderStatistics {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  paid_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
}

export interface WebhookPayload {
  event: string;
  object: any;
}

// API service class
class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('admin_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Only set Content-Type for JSON requests, not for FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Auth handling: if unauthorized, clear token and redirect to login
      if (response.status === 401) {
        try {
          this.logout();
        } finally {
          if (typeof window !== 'undefined') {
            window.location.href = '/admin';
          }
        }
        throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
      }
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Products API
  async getProducts(page: number = 1, size: number = 10): Promise<ProductListResponse> {
    const cacheKey = `products_${page}_${size}`;
    const cached = getCachedData(cacheKey);
    if (cached) {
      return cached;
    }
    
    const result = await this.request<ProductListResponse>(`/products/?page=${page}&size=${size}`);
    setCachedData(cacheKey, result);
    return result;
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(product: ProductCreate): Promise<Product> {
    return this.request<Product>('/products/', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: ProductUpdate): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async updateProductOrder(id: string, orderNumber: number): Promise<Product> {
    return this.updateProduct(id, { order_number: orderNumber });
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

// Product Photos API
async uploadProductPhoto(productId: string, photo: File, priority: number = 0): Promise<ProductPhoto> {
  const formData = new FormData();
  formData.append('photo', photo);

  const endpoint = `/photos/upload-photo?product_id=${productId}&priority=${priority}`;

  return this.request<ProductPhoto>(endpoint, {
    method: 'POST',
    body: formData,
  });
}



  async getProductPhotos(productId: string): Promise<ProductPhoto[]> {
    const cacheKey = `product_photos_${productId}`;
    const cached = getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.request<ProductPhoto[]>(`/photos/product/${productId}`);
    setCachedData(cacheKey, result);
    return result;
  }

  async updateProductPhoto(photoId: string, data: { name?: string; priority?: number }): Promise<ProductPhoto> {
    return this.request<ProductPhoto>(`/photos/${photoId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProductPhoto(photoId: string): Promise<void> {
    return this.request<void>(`/photos/${photoId}`, {
      method: 'DELETE',
    });
  }

  // Slider API
  async getSliderPhotos(): Promise<SliderListResponse> {
    const cacheKey = 'slider_photos';
    const cached = getCachedData(cacheKey);
    if (cached) {
      return cached;
    }
    
    const result = await this.request<SliderListResponse>('/slider/');
    setCachedData(cacheKey, result);
    return result;
  }

  async uploadSliderPhoto(photo: File, extra?: { name: string; order_number: number }): Promise<SliderPhoto> {
    const formData = new FormData();
    formData.append('photo', photo);
    if (extra) {
      formData.append('name', extra.name);
      formData.append('order_number', String(extra.order_number));
    }

    return this.request<SliderPhoto>('/slider/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async updateSliderPhoto(photoId: string, data: { name?: string; order_number?: number }): Promise<SliderPhoto> {
    return this.request<SliderPhoto>(`/slider/${photoId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateSliderPhotoOrder(photoId: string, orderNumber: number): Promise<SliderPhoto> {
    return this.request<SliderPhoto>(`/slider/${photoId}/order?order_number=${orderNumber}`, {
      method: 'PUT',
    });
  }

  async deleteSliderPhoto(photoId: string): Promise<void> {
    return this.request<void>(`/slider/${photoId}`, {
      method: 'DELETE',
    });
  }

  // Feedback API
  async sendFeedback(feedback: FeedbackCreate): Promise<FeedbackResponse> {
    return this.request<FeedbackResponse>('/feedback/', {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  }

  async testTelegramConnection(): Promise<FeedbackResponse> {
    return this.request<FeedbackResponse>('/feedback/test', {
      method: 'POST',
    });
  }
// Auth API
async adminLogin(credentials: AdminLogin): Promise<AdminLoginResponse> {
  const url = `${this.baseUrl}/auth/login`;
  
  // Попробуем использовать form-data формат, как ожидает OAuth2
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);
  formData.append('grant_type', 'password');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  this.token = result.access_token;
  if (this.token) {
    localStorage.setItem('admin_token', this.token);
  }
  return result;
}

logout(): void {
  this.token = null;
  localStorage.removeItem('admin_token');
}

isAuthenticated(): boolean {
  return !!this.token;
}

getToken(): string | null {
  return this.token;
}

  // Orders API
  async createOrder(order: OrderCreate): Promise<Order> {
    return this.request<Order>('/orders/', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async getOrder(orderId: string): Promise<Order> {
    return this.request<Order>(`/orders/${orderId}`);
  }

  async getOrderStatus(orderId: string): Promise<OrderStatus> {
    return this.request<OrderStatus>(`/orders/${orderId}/status`);
  }

  async getOrdersByEmail(email: string): Promise<OrderListResponse> {
    return this.request<OrderListResponse>(`/orders/email/${encodeURIComponent(email)}`);
  }

  async processWebhook(payload: WebhookPayload): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/orders/webhook', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getAllOrders(page: number = 1, size: number = 10): Promise<OrderListResponse> {
    return this.request<OrderListResponse>(`/orders/?page=${page}&size=${size}`);
  }

  async getOrderStatistics(): Promise<OrderStatistics> {
    return this.request<OrderStatistics>('/orders/statistics/summary');
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
