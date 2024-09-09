import { createClient } from '@supabase/supabase-js';

// Remplacez par vos informations Supabase
const supabaseUrl = 'https://qeyjxucrpwbsqbnoyfgw.supabase.co'; // Votre URL Supabase
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFleWp4dWNycHdic3Fibm95Zmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwNzgzMDQsImV4cCI6MjAzOTY1NDMwNH0.ePSDtjyZun_0Y4jG7hFXvPWoc0rxI1GmLMiSpCrCWiA'; // Votre clé anonyme

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
