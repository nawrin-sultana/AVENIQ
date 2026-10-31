import {NextResponse} from 'next/server';
import {generateDatabase} from '@/lib/engine';
export async function GET(){return NextResponse.json(generateDatabase(),{headers:{'Cache-Control':'public, max-age=3600'}})}
