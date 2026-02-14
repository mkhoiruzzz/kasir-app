import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oyoyfpzyjmzvkgngjfyf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95b3lmcHp5am16dmtnbmdqZnlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMzM1MTUsImV4cCI6MjA4NjYwOTUxNX0.2FH0oW-fQJHAfvU9Mj2FQe-Bn4JkBLYBX26wKZEuEpY';

export const supabase = createClient(supabaseUrl, supabaseKey);
