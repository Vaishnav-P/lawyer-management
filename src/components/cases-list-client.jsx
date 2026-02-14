'use client'

import { useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Pencil } from "lucide-react"
import { updateCaseStatus, deleteCase } from '@/actions/cases'
import { toast } from 'sonner'
import { CaseForm } from '@/components/case-form'

export default function CasesListClient({ initialCases }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const [editCase, setEditCase] = useState(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const handleSearch = (term) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('query', term)
        } else {
            params.delete('query')
        }
        router.replace(`${pathname}?${params.toString()}`)
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

    function handleEdit(caseItem) {
        setEditCase(caseItem)
        setIsEditOpen(true)
    }

    async function handleEditSuccess() {
        setIsEditOpen(false)
        setEditCase(null)
        router.refresh()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Cases</h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage all your legal cases.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 max-w-sm flex-1">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search cases..."
                            className="pl-8"
                            onChange={(e) => handleSearch(e.target.value)}
                            defaultValue={searchParams.get('query')?.toString()}
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialCases.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No cases found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialCases.map((caseItem) => (
                                <TableRow key={caseItem.id}>
                                    <TableCell className="font-medium">
                                        {caseItem.title}
                                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                                            {caseItem.description}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={
                                            caseItem.status === 'open' ? 'bg-green-500/15 text-green-600 border-green-500/30 hover:bg-green-500/25' :
                                                caseItem.status === 'in_progress' ? 'bg-yellow-500/15 text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/25' :
                                                    'bg-red-500/15 text-red-600 border-red-500/30 hover:bg-red-500/25'
                                        } variant="outline">
                                            {caseItem.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {caseItem.caseClients && caseItem.caseClients.length > 0 ? (
                                            <div className="flex flex-col">
                                                <span>{caseItem.caseClients[0].firstName} {caseItem.caseClients[0].lastName}</span>
                                                {caseItem.caseClients.length > 1 && (
                                                    <span className="text-xs text-muted-foreground">+{caseItem.caseClients.length - 1} more</span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground italic">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(caseItem.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleEdit(caseItem)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit Case
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleStatusUpdate(caseItem.id, 'open')}>
                                                    Mark as Open
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusUpdate(caseItem.id, 'in_progress')}>
                                                    Mark as In Progress
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusUpdate(caseItem.id, 'closed')}>
                                                    Mark as Closed
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(caseItem.id)}>
                                                    Delete Case
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

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
