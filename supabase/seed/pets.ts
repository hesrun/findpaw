import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@supabase/database.types'; // путь к твоим типам

const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const OWNER_ID = '228719c7-92dc-4862-8813-2fc3970e2144';

// --- Данные для шелтеров ---
const shelterNames = [
    'Тёплый дом',
    'Лапки',
    'Добрые руки',
    'Новый хвост',
    'Приют Надежды',
    'Зелёный двор',
    'Четыре лапы',
    'Ковчег',
    'Солнечный берег',
    'Верный друг',
];

// --- Данные для питомцев по видам ---
const dogNames = [
    'Рекс',
    'Бобик',
    'Шарик',
    'Барон',
    'Граф',
    'Зевс',
    'Буян',
    'Тузик',
    'Арчи',
    'Макс',
];
const catNames = [
    'Мурка',
    'Барсик',
    'Рыжик',
    'Снежок',
    'Пушок',
    'Симба',
    'Луна',
    'Васька',
    'Тигр',
    'Персик',
];
const otherNames = [
    'Кеша',
    'Гоша',
    'Пуговка',
    'Чип',
    'Дейл',
    'Нюша',
    'Фокси',
    'Зефир',
    'Карамель',
    'Бублик',
];

const dogBreeds = [
    'Лабрадор',
    'Хаски',
    'Овчарка',
    'Бигль',
    'Шпиц',
    'Корги',
    'Боксёр',
    'Далматин',
];
const catBreeds = [
    'Британская',
    'Мейн-кун',
    'Сфинкс',
    'Персидская',
    'Сиамская',
    'Бенгальская',
];

const dogDescriptions = [
    'Дружелюбный пёс, обожает прогулки и игры с мячом.',
    'Ласковый и послушный, отлично ладит с детьми.',
    'Активный пёс, нуждается в большом пространстве.',
    'Любит людей, быстро привязывается к хозяину.',
    'Умный и преданный, легко поддаётся дрессировке.',
];

const catDescriptions = [
    'Спокойная кошка, любит тихие вечера на диване.',
    'Игривая и ласковая, мурлычет при каждом прикосновении.',
    'Независимая, но очень нежная с теми, кому доверяет.',
    'Любопытная кошечка, исследует каждый уголок дома.',
    'Ласковая мурлыка, отлично ладит с другими животными.',
];

const otherDescriptions = [
    'Весёлый и активный, любит общение.',
    'Ручной и дружелюбный, быстро привыкает к людям.',
    'Спокойный характер, не требует много внимания.',
    'Игривый и любопытный, легко приручается.',
    'Добродушный питомец, подходит для семьи.',
];

const cities = [
    'Москва',
    'Санкт-Петербург',
    'Казань',
    'Екатеринбург',
    'Новосибирск',
    'Краснодар',
];
const listingTypes = ['adoption', 'sale', 'lost', 'found'] as const;
const sexes = ['male', 'female', 'unknown'] as const;
const species = ['dog', 'cat', 'bird', 'rabbit', 'rodent', 'other'] as const;

// --- Хелперы ---
const pick = <T>(arr: readonly T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
const maybe = <T>(val: T, chance = 0.7): T | null =>
    Math.random() < chance ? val : null;

function buildPet(ownerId: string, shelterId: string | null) {
    const sp = pick(species);

    const name =
        sp === 'dog'
            ? pick(dogNames)
            : sp === 'cat'
              ? pick(catNames)
              : pick(otherNames);

    const breed =
        sp === 'dog'
            ? maybe(pick(dogBreeds))
            : sp === 'cat'
              ? maybe(pick(catBreeds))
              : null;

    const description =
        sp === 'dog'
            ? pick(dogDescriptions)
            : sp === 'cat'
              ? pick(catDescriptions)
              : pick(otherDescriptions);

    const listingType = pick(listingTypes);
    const price = listingType === 'sale' ? maybe(randInt(1000, 50000)) : null;

    return {
        owner_id: ownerId,
        shelter_id: shelterId,
        name,
        species: sp,
        breed,
        description,
        age_months: randInt(1, 120),
        sex: pick(sexes),
        listing_type: listingType,
        status: 'active' as const,
        city: pick(cities),
        price,
        is_vaccinated: maybe(true, 0.6),
        is_sterilized: maybe(true, 0.5),
        is_special_needs: maybe(true, 0.15),
    };
}

async function seed() {
    // 1. Создаём 10 шелтеров
    const sheltersData = shelterNames.map((name, i) => ({
        name,
        owner_id: OWNER_ID,
        city: pick(cities),
        description: `Приют "${name}" — помогаем животным найти новый дом.`,
        phone: `+7900${String(1000000 + i).slice(1)}`,
        email: `shelter${i + 1}@findpaw.com`,
    }));

    const { data: shelters, error: shelterError } = await supabase
        .from('shelters')
        .insert(sheltersData)
        .select('id');

    if (shelterError) {
        console.error('Ошибка при создании шелтеров:', shelterError);
        return;
    }

    console.log(`✅ Создано шелтеров: ${shelters.length}`);

    const shelterIds = shelters.map((s) => s.id);

    // 2. Создаём 100 питомцев
    const petsData = Array.from({ length: 100 }, (_, i) => {
        // ~60% питомцев привязаны к шелтеру, ~40% к обычному юзеру
        const shelterId = i < 60 ? pick(shelterIds) : null;
        return buildPet(OWNER_ID, shelterId);
    });

    const { data: pets, error: petsError } = await supabase
        .from('pets')
        .insert(petsData)
        .select('id');

    if (petsError) {
        console.error('Ошибка при создании питомцев:', petsError);
        return;
    }

    console.log(`✅ Создано питомцев: ${pets.length}`);
}

seed();
