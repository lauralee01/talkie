"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createContact } from "@/lib/contacts-api";

export function AddContactForm() {
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
            await createContact({
                name,
                phoneNumber,
            });

            setName("");
            setPhoneNumber("");

            router.refresh();
        } catch {
            setError("We couldn't add this contact. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
        >
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="contact-name"
                        className="text-sm font-medium text-zinc-700"
                    >
                        Name
                    </label>

                    <input
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Mom"
                        required
                        className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950"
                    />
                </div>

                <div>
                    <label
                        htmlFor="contact-phone"
                        className="text-sm font-medium text-zinc-700"
                    >
                        Phone number
                    </label>

                    <input
                        id="contact-phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                        placeholder="+12055551234"
                        required
                        className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950"
                    />
                </div>
            </div>

            {error && (
                <p className="mt-4 text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="mt-5 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? "Adding..." : "Add Contact"}
                </button>
            </div>
        </form>
    );
}