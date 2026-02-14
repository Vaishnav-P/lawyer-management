'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from '@/components/ui/badge'
import { deleteCase, updateCaseStatus } from '@/actions/cases'
import { toast } from 'sonner'
import { CaseForm } from '@/components/case-form'
import { Plus, Trash2, Clock, CheckCircle, Users } from 'lucide-react'

export default function DashboardClient({ initialCases }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    // We can rely on router.refresh() to update data, initialCases is just for initial load
    // but to be reactive without full page reload feels, we might want to sync state.
    // However, for simplicity and correctness with server actions, router.refresh is best.
    // We'll just display initialCases which Next.js will update upon refresh.

    // Actually, initialCases won't update on router.refresh() if passed as prop unless the parent re-renders?
    // Parent is an async component, so router.refresh() re-runs it and passes new initialCases. Correct.

    const handleSuccess = () => {
        setOpen(false)
        router.refresh()
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this case?')) return

        try {
            const result = await deleteCase(id)
            if (result.success) {
                toast.success('Case deleted')
                // router.refresh() handles the UI update
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error('Failed to delete')
        }
    }

    async function handleStatusUpdate(id, status) {
        try {
            const result = await updateCaseStatus(id, status)
            if (result.success) {
                toast.success(`Status updated to ${status}`)
                // router.refresh() handled by action (or we call it here explicitly if action didn't)
                // In our action we did revalidatePath, so router.refresh might not even be strictly needed 
                // if we were using a client cache, but with props it is.
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
                    <span className="text-xl font-bold tracking-tight">LexFlow</span>
                </Link>
                <div className="ml-auto flex items-center gap-4">
                    <ModeToggle />
                    <Button variant="ghost" asChild>
                        <Link href="/login">Logout</Link>
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Manage your cases and clients</p>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" /> New Case
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create New Case</DialogTitle>
                                <DialogDescription>
                                    Enter case details and add associated clients.
                                </DialogDescription>
                            </DialogHeader>
                            <CaseForm onSuccess={handleSuccess} />
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {initialCases.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground bg-card rounded-xl border border-dashed">
                            No cases found. Create one to get started.
                        </div>
                    ) : initialCases.map((caseItem) => (
                        <Card key={caseItem.id} className="bg-card shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-bold truncate pr-4">
                                    {caseItem.title}
                                </CardTitle>
                                <Badge variant={
                                    caseItem.status === 'open' ? 'default' :
                                        caseItem.status === 'in_progress' ? 'secondary' : 'outline'
                                }>
                                    {caseItem.status.replace('_', ' ')}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                    {caseItem.description}
                                </p>
                                <div className="flex items-center text-xs text-muted-foreground gap-2 mb-2">
                                    <Clock className="w-3 h-3" />
                                    {new Date(caseItem.createdAt).toLocaleDateString()}
                                </div>
                                {caseItem.caseClients && caseItem.caseClients.length > 0 ? (
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        <span className="font-medium text-foreground">{caseItem.caseClients.length} Client{caseItem.caseClients.length > 1 ? 's' : ''}</span>
                                        <span className="text-muted-foreground/70">({caseItem.caseClients[0].lastName})</span>
                                    </div>
                                ) : (
                                    <div className="text-xs text-muted-foreground italic">No clients added</div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-between border-t pt-4">
                                <div className="flex gap-2">
                                    {caseItem.status !== 'closed' && (
                                        <Button variant="ghost" size="icon" title="Close Case" onClick={() => handleStatusUpdate(caseItem.id, 'closed')}>
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        </Button>
                                    )}
                                </div>
                                <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => handleDelete(caseItem.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}
