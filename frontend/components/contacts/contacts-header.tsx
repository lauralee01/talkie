"use client";

import { useState } from "react";
import { AddContactForm } from "@/components/contacts/add-contact-form";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/cn";

export function ContactsHeader() {
  const [isAddingContact, setIsAddingContact] = useState(false);

  return (
    <>
      <PageHeader
        title="Contacts"
        description="The people on your private line."
        actions={
          <button
            type="button"
            onClick={() => setIsAddingContact((current) => !current)}
            className={cn(
              "shrink-0 text-sm font-medium transition",
              isAddingContact
                ? "text-zinc-500 hover:text-zinc-950"
                : "rounded-xl bg-zinc-950 px-4 py-2.5 text-white hover:bg-zinc-800",
            )}
          >
            {isAddingContact ? "Cancel" : "+ Add Contact"}
          </button>
        }
      />

      {isAddingContact ? (
        <div className="-mt-4 mb-10 sm:-mt-6 sm:mb-12">
          <AddContactForm onSuccess={() => setIsAddingContact(false)} />
        </div>
      ) : null}
    </>
  );
}
