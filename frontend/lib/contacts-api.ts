export type Contact = {
    id: string;
    name: string;
    phoneNumber: string;
    createdAt: string;
};

export type CreateContactInput = {
    name: string;
    phoneNumber: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getContacts(): Promise<Contact[]> {
    const response = await fetch(`${API_URL}/contacts`);

    if (!response.ok) {
        throw new Error("Failed to fetch Contacts");
    }

    return response.json();
}

export async function createContact(
    input: CreateContactInput,
): Promise<Contact> {
    const response = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        throw new Error("Failed to create Contact");
    }

    return response.json();
}


