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
              "shrink-0 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium transition",
              isAddingContact
                ? "bg-transparent text-muted hover:text-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary-hover",
            )}
          >
            {isAddingContact ? "Cancel" : "+ Add Contact"}
          </button>
        }
      />

      {isAddingContact ? (
        <div className="-mt-2 mb-8 sm:-mt-4">
          <AddContactForm onSuccess={() => setIsAddingContact(false)} />
        </div>
      ) : null}
    </>
  );
}
