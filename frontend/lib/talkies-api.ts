// lib/talkies-api.ts

export type Talkie = {
    id: string;
    fromNumber: string;
    toNumber: string;
    durationSeconds: number;
    fileFormat: string;
    status: string;
    createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTalkies(): Promise<Talkie[]> {
    const response = await fetch(`${API_URL}/talkies`);

    if (!response.ok) {
        throw new Error('Failed to fetch Talkies');
    }

    return response.json();
}