import { getContacts } from "@/lib/contacts-api";

export default async function ContactsPage() {
    const contacts = await getContacts();

    return (
        <main className="mx-auto min-h-screen max-w-5xl px-6 py-8 sm:px-8">
            <div className="mb-12">
                <p className="text-sm text-zinc-500">
                    Talkie
                </p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
                    Contacts
                </h1>

                <p className="mt-4 text-zinc-600">
                    The people on your private line.
                </p>
            </div>

            <section>
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-zinc-950">
                        Your contacts
                    </h2>

                    <p className="text-sm text-zinc-500">
                        {contacts.length} {contacts.length === 1 ? "contact" : "contacts"}
                    </p>
                </div>

                {contacts.length === 0 ? (
                    <p className="text-zinc-500">
                        No contacts yet.
                    </p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {contacts.map((contact) => (
                            <article
                                key={contact.id}
                                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                            >
                                <p className="font-medium text-zinc-950">
                                    {contact.name}
                                </p>

                                <p className="mt-1 text-sm text-zinc-500">
                                    {contact.phoneNumber}
                                </p>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}