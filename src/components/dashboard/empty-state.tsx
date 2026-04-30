import { CircleDashed } from "lucide-react";

export function EmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-xl border border-dashed border-[#d0d5dd] bg-[#f9fafb] p-6 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#98a2b3]">
                <CircleDashed size={22} />
            </div>
            <p className="font-black text-[#101828]">{title}</p>
            <p className="mt-1 text-sm leading-6 text-[#667085]">{description}</p>
        </div>
    );
}