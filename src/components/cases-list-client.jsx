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
import { Label } from "@/components/ui/label"
import { Search, MoreHorizontal, Pencil, ChevronLeft, ChevronRight, Filter, X, Eye } from "lucide-react"
import { updateCaseStatus, deleteCase } from '@/actions/cases'
import { toast } from 'sonner'
import { CaseForm } from '@/components/case-form'
import { CaseDetailsDialog } from '@/components/case-details-dialog'
import { useEffect } from "react"

export default function CasesListClient({ initialCases, totalPages = 1, currentPage = 1 }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const [editCase, setEditCase] = useState(null)
    const [viewCase, setViewCase] = useState(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filterValues, setFilterValues] = useState({
        caseId: '',
        date: '',
        clientFirstName: '',
        clientLastName: '',
        aadhar: '',
        phone: '',
        status: 'all'
    })

    useEffect(() => {
        setFilterValues({
            caseId: searchParams.get('caseId') || '',
            date: searchParams.get('date') || '',
            clientFirstName: searchParams.get('clientFirstName') || '',
            clientLastName: searchParams.get('clientLastName') || '',
            aadhar: searchParams.get('aadhar') || '',
            phone: searchParams.get('phone') || '',
            status: searchParams.get('status') || 'all'
        })
    }, [searchParams])

    const handleFilterChange = (key, value) => {
        setFilterValues(prev => ({ ...prev, [key]: value }))
    }

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams)
        // Reset to page 1
        params.set('page', '1')

        Object.entries(filterValues).forEach(([key, value]) => {
            if (value) params.set(key, value)
            else params.delete(key)
        })

        router.push(`${pathname}?${params.toString()}`)
        setIsFilterOpen(false)
    }

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams)
        const relevantKeys = ['caseId', 'date', 'clientFirstName', 'clientLastName', 'aadhar', 'phone', 'status']
        relevantKeys.forEach(key => params.delete(key))
        params.set('page', '1')

        setFilterValues({
            caseId: '',
            date: '',
            clientFirstName: '',
            clientLastName: '',
            aadhar: '',
            phone: '',
            status: 'all'
        })

        router.push(`${pathname}?${params.toString()}`)
        setIsFilterOpen(false)
    }

    const handleSearch = (term) => {
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

    function handleView(caseItem) {
        setViewCase(caseItem)
        setIsViewOpen(true)
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
                    <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(true)} title="Advanced Filters">
                        <Filter className="h-4 w-4" />
                    </Button>
                    {(searchParams.get('caseId') || searchParams.get('date') || searchParams.get('clientFirstName') || searchParams.get('clientLastName') || searchParams.get('aadhar') || searchParams.get('phone') || (searchParams.get('status') && searchParams.get('status') !== 'all')) && (
                        <Button variant="outline" size="icon" onClick={clearFilters} title="Clear Filters">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
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
                                        {new Date(caseItem.createdAt).toLocaleDateString('en-GB')}
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
                                                <DropdownMenuItem onClick={() => handleView(caseItem)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
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

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 py-4">
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

            {/* Filter Dialog */}
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Advanced Search</DialogTitle>
                        <DialogDescription>Filter cases by specific criteria.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="caseId" className="text-right">Case ID</Label>
                            <Input
                                id="caseId"
                                value={filterValues.caseId}
                                onChange={(e) => handleFilterChange('caseId', e.target.value)}
                                className="col-span-3"
                                type="number"
                                placeholder="E.g. 101"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">Created Date</Label>
                            <Input
                                id="date"
                                value={filterValues.date}
                                onChange={(e) => handleFilterChange('date', e.target.value)}
                                className="col-span-3"
                                type="date"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="clientFirstName" className="text-right">First Name</Label>
                            <Input
                                id="clientFirstName"
                                value={filterValues.clientFirstName}
                                onChange={(e) => handleFilterChange('clientFirstName', e.target.value)}
                                className="col-span-3"
                                placeholder="First name"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="clientLastName" className="text-right">Last Name</Label>
                            <Input
                                id="clientLastName"
                                value={filterValues.clientLastName}
                                onChange={(e) => handleFilterChange('clientLastName', e.target.value)}
                                className="col-span-3"
                                placeholder="Last name"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="aadhar" className="text-right">Aadhar</Label>
                            <Input
                                id="aadhar"
                                value={filterValues.aadhar}
                                onChange={(e) => handleFilterChange('aadhar', e.target.value)}
                                className="col-span-3"
                                placeholder="Aadhar number"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">Phone</Label>
                            <Input
                                id="phone"
                                value={filterValues.phone}
                                onChange={(e) => handleFilterChange('phone', e.target.value)}
                                className="col-span-3"
                                placeholder="Phone number"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">Status</Label>
                            <select
                                id="status"
                                value={filterValues.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
                            >
                                <option value="all">All</option>
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={clearFilters}>Clear Filters</Button>
                        <Button onClick={applyFilters}>Apply Filters</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
