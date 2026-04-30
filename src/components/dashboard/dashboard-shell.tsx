export function DashboardShell({
    sidebar,
    header,
    children,
}: {
    sidebar: React.ReactNode;
    header: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen bg-[#f6f9f7] text-[#101828]">
            <div className="flex min-h-screen">
                {sidebar}

                <div className="flex min-w-0 flex-1 flex-col">
                    {header}

                    <section className="flex-1 px-5 py-6 md:px-8 lg:px-10">
                        <div className="mx-auto max-w-7xl">{children}</div>
                    </section>
                </div>
            </div>
        </main>
    );
}