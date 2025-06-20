import { supabase } from './supabase';
import type { Product } from '../types/product';
import { cacheService } from './cacheService';

class LampService {
  private readonly CACHE_KEYS = {
    ALL_LAMPS: 'all_lamps',
    LAMP_BY_ID: (id: string) => `lamp_${id}`,
  };

  // Получение всех ламп
  async getAllLamps(): Promise<Product[]> {
    const cachedData = cacheService.get<Product[]>(this.CACHE_KEYS.ALL_LAMPS);
    if (cachedData) {
      return cachedData;
    }

    try {
      const { data, error } = await supabase
        .from('lamps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lamps:', error);
        throw error;
      }

      cacheService.set(this.CACHE_KEYS.ALL_LAMPS, data);
      return data || [];
    } catch (error) {
      console.error('Error in getAllLamps:', error);
      throw error;
    }
  }

  // Получение лампы по ID
  async getLampById(id: string): Promise<Product> {
    const cachedData = cacheService.get<Product>(this.CACHE_KEYS.LAMP_BY_ID(id));
    if (cachedData) {
      return cachedData;
    }

    try {
      const { data, error } = await supabase
        .from('lamps')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching lamp:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Lamp not found');
      }

      cacheService.set(this.CACHE_KEYS.LAMP_BY_ID(id), data);
      return data;
    } catch (error) {
      console.error('Error in getLampById:', error);
      throw error;
    }
  }

  // Добавление новой лампы
  async addLamp(lamp: Omit<Product, 'id'>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('lamps')
        .insert([lamp])
        .select()
        .single();

      if (error) {
        console.error('Error adding lamp:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in addLamp:', error);
      throw error;
    }
  }

  // Обновление лампы
  async updateLamp(id: string, lamp: Partial<Product>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('lamps')
        .update(lamp)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating lamp:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateLamp:', error);
      throw error;
    }
  }

  // Удаление лампы
  async deleteLamp(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('lamps')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting lamp:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteLamp:', error);
      throw error;
    }
  }

  // Загрузка изображения
  async uploadImage(file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  }

  clearCache(): void {
    cacheService.clear();
  }
}

export const lampService = new LampService(); 