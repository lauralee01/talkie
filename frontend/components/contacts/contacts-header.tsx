"use client";

import { useState } from "react";
import { AddContactForm } from "./add-contact-form";

export function ContactsHeader() {
    const [isAddingContact, setIsAddingContact] = useState(false);

    return (
        <div className="mb-10">
            <div className="flex items-start justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
                        Contacts
                    </h1>

                    <p className="mt-4 text-zinc-600">
                        The people on your private line.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsAddingContact((current) => !current)}
                    className={
                        isAddingContact
                            ? "text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
                            : "rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
                    }
                >
                    {isAddingContact ? "Cancel" : "+ Add Contact"}
                </button>
            </div>

            {isAddingContact && (
                <div className="mt-8">
                    <AddContactForm />
                </div>
            )}
        </div>
    );
}