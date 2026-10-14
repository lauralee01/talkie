"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ContactFormFields } from "@/components/contacts/contact-form-fields";
import { Card } from "@/components/ui/card";
import { createContact } from "@/lib/contacts-api";

type AddContactFormProps = {
  onSuccess: () => void;
};

export function AddContactForm({ onSuccess }: AddContactFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createContact({ name, phoneNumber });
      setName("");
      setPhoneNumber("");
      onSuccess();
      router.refresh();
    } catch {
      setError("We couldn't add this contact. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card as="form" onSubmit={handleSubmit}>
      <ContactFormFields
        idPrefix="add-contact"
        name={name}
        phoneNumber={phoneNumber}
        onNameChange={setName}
        onPhoneNumberChange={setPhoneNumber}
      />

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add Contact"}
        </button>
      </div>
    </Card>
  );
}
