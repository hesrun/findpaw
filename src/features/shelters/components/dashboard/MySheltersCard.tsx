'use client';

import { Avatar, Card } from '@heroui/react';
import { Database } from '@supabase/database.types';
import { FaLocationDot } from 'react-icons/fa6';
import { LuGlobe, LuMail, LuPhone } from 'react-icons/lu';
import MyShelterActionsDropdown from './MyShelterActionsDropdown';

type Shelter = Database['public']['Tables']['shelters']['Row'];

export default function MySheltersCard({ shelter }: { shelter: Shelter }) {
    return (
        <Card className="hover:bg-muted/10 transition-colors">
            <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center">
                <Avatar size="lg">
                    {shelter.img_url?.length ? (
                        <Avatar.Image
                            alt={shelter.name ?? 'Shelter Image'}
                            src={shelter.img_url[0]}
                        />
                    ) : (
                        <Avatar.Fallback className="bg-accent text-white">
                            {shelter.name ? shelter.name[0] : 'S'}
                        </Avatar.Fallback>
                    )}
                </Avatar>
                <div className="font-medium text-accent">{shelter.name}</div>
                <div className="flex items-center gap-2">
                    <FaLocationDot className="text-green-500 text-xl" />
                    <span className="font-medium text-sm">
                        {[shelter.city, shelter.address]
                            .filter(Boolean)
                            .join(', ') || '—'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <LuPhone className="text-accent" />
                    <span className="font-medium text-sm">
                        {shelter.phone ? shelter.phone : '—'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <LuMail className="text-accent" />
                    <span className="font-medium text-sm">
                        {shelter.email ? shelter.email : '—'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <LuGlobe className="text-accent" />
                    <span className="font-medium text-sm">
                        {shelter.website ? shelter.website : '—'}
                    </span>
                </div>
                <div>
                    <MyShelterActionsDropdown shelterId={shelter.id} />
                </div>
            </div>
        </Card>
    );
}
