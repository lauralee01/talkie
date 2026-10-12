import { apiFetch } from "@/lib/api-client";
import type { Talkie } from "@/lib/talkies-api";

export type Contact = {
  id: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
  _count?: {
    talkies: number;
  };
};

export type ContactDetail = Contact & {
  talkies: Talkie[];
};

export type ContactInput = {
  name: string;
  phoneNumber: string;
};

export type CreateContactInput = ContactInput;

export function getContacts(): Promise<Contact[]> {
  return apiFetch<Contact[]>("/contacts", { cache: "no-store" });
}

export function getContact(contactId: string): Promise<ContactDetail> {
  return apiFetch<ContactDetail>(`/contacts/${contactId}`, {
    cache: "no-store",
  });
}

export function createContact(input: CreateContactInput): Promise<Contact> {
  return apiFetch<Contact>("/contacts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateContact(
  contactId: string,
  input: ContactInput,
): Promise<Contact> {
  return apiFetch<Contact>(`/contacts/${contactId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteContact(contactId: string): Promise<void> {
  return apiFetch<void>(`/contacts/${contactId}`, {
    method: "DELETE",
  });
}
