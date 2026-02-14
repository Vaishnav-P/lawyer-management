import { AppSidebar, MobileSidebar } from '@/components/app-sidebar'
import { ModeToggle } from '@/components/mode-toggle'

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-muted/30">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
                <header className="sticky top-0 z-30 flex h-14 md:h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                    <MobileSidebar />
                    <div className="ml-auto flex items-center gap-4">
                        <ModeToggle />
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
