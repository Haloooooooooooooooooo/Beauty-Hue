/**
 * Supabase 客户端配置
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jprfulksnsjsayasdffk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwcmZ1bGtzbnNqc2F5YXNkZmZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MjA4OTUsImV4cCI6MjA5MTA5Njg5NX0.OWyr_EBvYav2I3LL06iyR1HnJ4yymIPK55eLSxjgHHU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket 名称
export const STORAGE_BUCKET = 'share-cards';