import { Database } from '@supabase/database.types';
import { Shelter } from './shelters';

export type Pet = Database['public']['Tables']['pets']['Row'];
export type PetInsert = Database['public']['Tables']['pets']['Insert'];

export type PetWithShelter = Pet & {
    shelter: Pick<Shelter, 'id' | 'name' | 'city' | 'address'> | null;
};
