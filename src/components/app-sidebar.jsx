'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, LogOut, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Manage Cases',
        href: '/dashboard/cases',
        icon: FolderKanban,
    },
]

function SidebarContent({ onNavigate }) {
    const pathname = usePathname()

    return (
        <>
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold" onClick={onNavigate}>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">LexFlow</span>
                </Link>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
                <nav className="grid gap-1">
                    {sidebarItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            onClick={onNavigate}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="border-t p-4">
                <Link
                    href="/login"
                    onClick={onNavigate}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Link>
            </div>
        </>
    )
}

// Desktop sidebar (hidden on mobile)
export function AppSidebar() {
    return (
        <aside className="hidden w-64 flex-col border-r bg-background md:flex">
            <SidebarContent />
        </aside>
    )
}

// Mobile sidebar toggle button + overlay (visible only on mobile)
export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsOpen(true)}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
            </Button>

            {/* Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setIsOpen(false)}
                    />
                    {/* Sidebar panel */}
                    <aside className="absolute left-0 top-0 h-full w-64 flex-col bg-background shadow-lg flex animate-in slide-in-from-left duration-200">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <SidebarContent onNavigate={() => setIsOpen(false)} />
                    </aside>
                </div>
            )}
        </>
    )
}
