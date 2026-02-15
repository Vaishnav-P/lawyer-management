'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { CaseDetailsDialog } from '@/components/case-details-dialog'
import { Plus, Trash2, Clock, CheckCircle, Users, Search, ChevronLeft, ChevronRight, Pencil } from 'lucide-react'

export default function DashboardClient({ initialCases, totalPages = 1, currentPage = 1 }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const [viewCase, setViewCase] = useState(null)
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [editCase, setEditCase] = useState(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const handleSuccess = () => {
        setOpen(false)
        router.refresh()
    }

    const handleEditSuccess = () => {
        setIsEditOpen(false)
        setEditCase(null)
        router.refresh()
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this case?')) return

        try {
            const result = await deleteCase(id)
            if (result.success) {
                toast.success('Case deleted')
                router.refresh()
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
                router.refresh()
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    function handleSearch(term) {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('query', term)
        } else {
            params.delete('query')
        }
        router.replace(`${pathname}?${params.toString()}`)
    }

    function handlePageChange(page) {
        const params = new URLSearchParams(searchParams)
        params.set('page', page)
        router.push(`${pathname}?${params.toString()}`)
    }

    function handleView(caseItem) {
        setViewCase(caseItem)
        setIsViewOpen(true)
    }

    function handleEdit(caseItem) {
        setEditCase(caseItem)
        setIsEditOpen(true)
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your cases and clients</p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search cases..."
                        className="pl-8 bg-card"
                        onChange={(e) => handleSearch(e.target.value)}
                        defaultValue={searchParams.get('query')?.toString()}
                    />
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
                    <Card key={caseItem.id} className="bg-card shadow-md hover:shadow-lg transition-shadow flex flex-col">
                        <div onClick={() => handleView(caseItem)} className="cursor-pointer flex-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-bold truncate pr-4">
                                    {caseItem.title}
                                </CardTitle>
                                <Badge className={
                                    caseItem.status === 'open' ? 'bg-green-500/15 text-green-600 border-green-500/30 hover:bg-green-500/25' :
                                        caseItem.status === 'in_progress' ? 'bg-yellow-500/15 text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/25' :
                                            'bg-red-500/15 text-red-600 border-red-500/30 hover:bg-red-500/25'
                                } variant="outline">
                                    {caseItem.status.replace('_', ' ')}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                    {caseItem.description}
                                </p>
                                <div className="flex items-center text-xs text-muted-foreground gap-2 mb-2">
                                    <Clock className="w-3 h-3" />
                                    {new Date(caseItem.createdAt).toLocaleDateString('en-GB')}
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
                        </div>
                        <CardFooter className="flex justify-between border-t pt-4 mt-auto">
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" title="Edit Case" onClick={() => handleEdit(caseItem)}>
                                    <Pencil className="w-4 h-4 text-blue-600" />
                                </Button>
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

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 py-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* View Case Dialog */}
            <CaseDetailsDialog
                open={isViewOpen}
                onOpenChange={setIsViewOpen}
                caseItem={viewCase}
            />

            {/* Edit Case Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Case</DialogTitle>
                        <DialogDescription>
                            Update the case details and associated clients.
                        </DialogDescription>
                    </DialogHeader>
                    {editCase && (
                        <CaseForm
                            key={editCase.id}
                            initialData={editCase}
                            onSuccess={handleEditSuccess}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
