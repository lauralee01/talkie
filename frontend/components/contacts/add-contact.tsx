"use client";

import { useState } from "react";
import { AddContactForm } from "./add-contact-form";

export function AddContact() {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
                + Add Contact
            </button>
        );
    }

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-sm text-zinc-500 transition hover:text-zinc-950"
                >
                    Cancel
                </button>
            </div>

            <AddContactForm />
        </div>
    );
}