import { supabase } from './supabase';
import type { Product } from '../types/product';
import { cacheService } from './cacheService';

class LampService {
  private readonly CACHE_KEYS = {
    ALL_LAMPS: 'all_lamps',
    LAMP_BY_ID: (id: string) => `lamp_${id}`,
  };

  private readonly lampsUrl = '/lamps.json';

  // Получение всех ламп
  async getAllLamps(): Promise<Product[]> {
    const res = await fetch(this.lampsUrl);
    if (!res.ok) throw new Error('Не удалось загрузить lamps.json');
    return await res.json();
  }

  // Получение лампы по ID
  async getLampById(id: string): Promise<Product> {
    const res = await fetch(this.lampsUrl);
    if (!res.ok) throw new Error('Не удалось загрузить lamps.json');
    const lamps: Product[] = await res.json();
    const lamp = lamps.find(l => l.id === id);
    if (!lamp) throw new Error('Lamp not found');
    return lamp;
  }

  // Добавление новой лампы
  async addLamp(): Promise<Product> { throw new Error('SSG mode: addLamp не поддерживается'); }

  // Обновление лампы
  async updateLamp(): Promise<Product> { throw new Error('SSG mode: updateLamp не поддерживается'); }

  // Удаление лампы
  async deleteLamp(): Promise<void> { throw new Error('SSG mode: deleteLamp не поддерживается'); }

  // Загрузка изображения
  async uploadImage(): Promise<string> { throw new Error('SSG mode: uploadImage не поддерживается'); }

  clearCache(): void {
    cacheService.clear();
  }
}

export const lampService = new LampService(); 