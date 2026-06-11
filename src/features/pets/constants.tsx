import { FaCat, FaDog, FaFish, FaHorseHead, FaQuestion } from 'react-icons/fa';
import type en from '../../../messages/en.json';
import { Enums } from '../../../supabase/database.types';
import { LuBird } from 'react-icons/lu';
import { GiRabbit, GiRat, GiSandSnake, GiTakeMyMoney } from 'react-icons/gi';
import { FaHandsHolding, FaMagnifyingGlass, FaOtter } from 'react-icons/fa6';
import { MdFemale, MdMale } from 'react-icons/md';

type MyPets = (typeof en)['dashboard']['myPets'];
type SpeciesLabel = `species.${keyof MyPets['species'] & string}`;
type TypeLabel = `type.${keyof MyPets['type'] & string}`;
type SexLabel = `sex.${keyof MyPets['sex'] & string}`;

export const SPECIES: {
    id: Enums<'pet_species'>;
    label: SpeciesLabel;
    icon?: React.ReactNode;
}[] = [
    { id: 'dog', label: 'species.dog', icon: <FaDog /> },
    { id: 'cat', label: 'species.cat', icon: <FaCat /> },
    { id: 'bird', label: 'species.bird', icon: <LuBird /> },
    { id: 'fish', label: 'species.fish', icon: <FaFish /> },
    { id: 'rodent', label: 'species.rodent', icon: <GiRat /> },
    { id: 'ferret', label: 'species.ferret', icon: <FaOtter /> },
    { id: 'rabbit', label: 'species.rabbit', icon: <GiRabbit /> },
    { id: 'reptile', label: 'species.reptile', icon: <GiSandSnake /> },
    { id: 'horse', label: 'species.horse', icon: <FaHorseHead /> },
    { id: 'other', label: 'species.other', icon: <FaQuestion /> },
] as const;

export const LISTING_TYPES: {
    id: Enums<'pet_listing_type'>;
    label: TypeLabel;
    icon?: React.ReactNode;
}[] = [
    { id: 'lost', label: 'type.lost', icon: <FaQuestion /> },
    { id: 'found', label: 'type.found', icon: <FaMagnifyingGlass /> },
    { id: 'adoption', label: 'type.adoption', icon: <FaHandsHolding /> },
    { id: 'sale', label: 'type.sale', icon: <GiTakeMyMoney /> },
] as const;

export const SEX_OPTIONS: {
    id: Enums<'pet_sex'>;
    label: SexLabel;
    icon?: React.ReactNode;
}[] = [
    { id: 'male', label: 'sex.male', icon: <MdMale /> },
    { id: 'female', label: 'sex.female', icon: <MdFemale /> },
] as const;
