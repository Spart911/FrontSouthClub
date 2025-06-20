require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

  const lamps = data || [];
  const outDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }
  const outPath = path.join(outDir, 'lamps.json');
  fs.writeFileSync(outPath, JSON.stringify(lamps, null, 2), 'utf-8');
  console.log(`Выгружено ${lamps.length} ламп в public/lamps.json`);
}

fetchLamps(); 