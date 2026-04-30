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
        <main className="min-h-screen w-full overflow-x-hidden bg-[#f6f9f7] text-[#101828]">
            <div className="flex min-h-screen w-full min-w-0 overflow-x-hidden">
                {sidebar}

                <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
                    <div className="hidden lg:block">{header}</div>

                    <section className="w-full min-w-0 flex-1 overflow-x-hidden px-4 py-4 sm:px-5 md:px-6 lg:px-10 lg:py-6">
                        <div className="mx-auto w-full min-w-0 max-w-7xl overflow-x-hidden">
                            {children}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}