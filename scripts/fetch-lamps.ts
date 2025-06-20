import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import type { Product } from '../src/types/product';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fetchLamps() {
  const { data, error } = await supabase
    .from('lamps')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Ошибка при получении ламп из Supabase:', error);
    process.exit(1);
  }

  const lamps: Product[] = data || [];
  const outDir = path.resolve(__dirname, '../src/data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }
  const outPath = path.join(outDir, 'lamps.json');
  fs.writeFileSync(outPath, JSON.stringify(lamps, null, 2), 'utf-8');
  console.log(`Выгружено ${lamps.length} ламп в src/data/lamps.json`);
}

fetchLamps(); 