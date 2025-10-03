import { createClient } from '@supabase/supabase-js';
import { Event, Registration } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      events: {
        Row: Event;
        Insert: Omit<Event, 'id'>;
        Update: Partial<Omit<Event, 'id'>>;
      };
      registrations: {
        Row: Registration;
        Insert: Omit<Registration, 'id'>;
        Update: Partial<Omit<Registration, 'id'>>;
      };
    };
  };
}
