export function formatTalkieDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
        date.toDateString() === yesterday.toDateString();

    const time = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });

    if (isToday) {
        return `Today, ${time}`;
    }

    if (isYesterday) {
        return `Yesterday, ${time}`;
    }

    const day = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    return `${day}, ${time}`;
}