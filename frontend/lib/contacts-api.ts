import { apiFetch } from "@/lib/api-client";

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

export function getContacts(): Promise<Contact[]> {
  return apiFetch<Contact[]>("/contacts", { cache: "no-store" });
}

export function createContact(input: CreateContactInput): Promise<Contact> {
  return apiFetch<Contact>("/contacts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
