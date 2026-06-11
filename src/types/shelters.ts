import { Database } from '@supabase/database.types';

export type Shelter = Database['public']['Tables']['shelters']['Row'];
export type ShelterInsert = Database['public']['Tables']['shelters']['Insert'];
