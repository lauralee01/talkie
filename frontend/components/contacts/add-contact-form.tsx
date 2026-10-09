"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
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
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="contact-name"
          label="Name"
          type="text"
          value={name}
          onChange={setName}
          placeholder="Mom"
          required
        />

        <Field
          id="contact-phone"
          label="Phone number"
          type="tel"
          value={phoneNumber}
          onChange={setPhoneNumber}
          placeholder="+12055551234"
          required
        />
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add Contact"}
        </button>
      </div>
    </Card>
  );
}

type FieldProps = {
  id: string;
  label: string;
  type: "text" | "tel";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
};

function Field({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950"
      />
    </div>
  );
}
