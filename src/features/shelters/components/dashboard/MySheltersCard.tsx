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
            <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 items-center">
                <Avatar size="lg">
                    <Avatar.Image
                        alt={shelter.name}
                        src={shelter.img_url?.length ? shelter.img_url[0] : undefined}
                    />
                    <Avatar.Fallback>{shelter.name[0]}</Avatar.Fallback>
                </Avatar>

                <div className="font-medium text-accent">{shelter.name}</div>

                <div className="flex items-center gap-2 text-sm text-muted">
                    <FaLocationDot className="text-green-500 shrink-0" />
                    <span>{[shelter.city, shelter.address].filter(Boolean).join(', ') || '—'}</span>
                </div>

                <div className="flex flex-col gap-1 text-sm text-muted">
                    {shelter.phone && (
                        <span className="flex items-center gap-1"><LuPhone /> {shelter.phone}</span>
                    )}
                    {shelter.email && (
                        <span className="flex items-center gap-1"><LuMail /> {shelter.email}</span>
                    )}
                    {shelter.website && (
                        <span className="flex items-center gap-1"><LuGlobe /> {shelter.website}</span>
                    )}
                </div>

                <MyShelterActionsDropdown shelterId={shelter.id} />
            </div>
        </Card>
    );
}

