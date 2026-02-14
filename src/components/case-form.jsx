"use client"

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createCase, updateCase } from '@/actions/cases'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2, User } from 'lucide-react'

// Schema for a single client
const clientSchema = z.object({
    firstName: z.string().min(1, 'First Name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last Name is required'),
    address: z.string().min(5, 'Address is required'),
    phone: z.string().min(10, 'Valid Phone Number is required'),
    dob: z.string().min(1, 'Date of Birth is required'),
    aadhar: z.string().optional(),
})

// Schema for the entire case form
const caseFormSchema = z.object({
    title: z.string().min(2, 'Case Title is required'),
    description: z.string().min(5, 'Description is required'),
    status: z.string().optional(),
    clients: z.array(clientSchema).min(1, 'At least one client is required'),
})

// Helper to format ISO date to YYYY-MM-DD for input[type="date"]
function formatDateForInput(dateStr) {
    if (!dateStr) return ''
    try {
        const d = new Date(dateStr)
        return d.toISOString().split('T')[0]
    } catch {
        return ''
    }
}

export function CaseForm({ onSuccess, initialData }) {
    const [isLoading, setIsLoading] = useState(false)
    const isEditing = !!initialData

    const form = useForm({
        resolver: zodResolver(caseFormSchema),
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            status: initialData?.status || 'open',
            clients: initialData?.caseClients?.length > 0
                ? initialData.caseClients.map(c => ({
                    firstName: c.firstName || '',
                    middleName: c.middleName || '',
                    lastName: c.lastName || '',
                    address: c.address || '',
                    phone: c.phone || '',
                    dob: formatDateForInput(c.dob),
                    aadhar: c.aadhar || '',
                }))
                : [
                    {
                        firstName: '',
                        middleName: '',
                        lastName: '',
                        address: '',
                        phone: '',
                        dob: '',
                        aadhar: '',
                    },
                ],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "clients",
    })

    async function onSubmit(values) {
        setIsLoading(true)

        try {
            if (isEditing) {
                const result = await updateCase(initialData.id, values)
                if (result.error) {
                    toast.error(result.error)
                } else {
                    toast.success('Case updated successfully')
                    if (onSuccess) onSuccess()
                }
            } else {
                const payload = {
                    ...values,
                    clientId: '1', // Hardcoded system user ID for now
                }
                const result = await createCase(payload)
                if (result.error) {
                    toast.error(result.error)
                } else {
                    toast.success('Case and Clients created successfully')
                    form.reset()
                    if (onSuccess) onSuccess()
                }
            }
        } catch (error) {
            toast.error(isEditing ? 'Failed to update case' : 'Failed to create case')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto px-1">

                {/* Case Details Section */}
                <div className="space-y-4 border-b pb-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        Case Details
                    </h3>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Case Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Smith vs. Jones" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Brief case details..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {isEditing && (
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        >
                                            <option value="open">Open</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                {/* Client Details Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <User className="w-5 h-5" /> Clients
                        </h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ firstName: '', lastName: '', address: '', phone: '', dob: '' })}
                            className="gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Client
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <Card key={field.id} className="relative bg-muted/20">
                                <CardContent className="pt-6 space-y-4">
                                    {index > 0 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`clients.${index}.firstName`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="First" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`clients.${index}.middleName`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Middle Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Middle" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`clients.${index}.lastName`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Last Name <span className="text-destructive">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Last" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name={`clients.${index}.address`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address <span className="text-destructive">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Full Address" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`clients.${index}.phone`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone <span className="text-destructive">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="+1 234..." {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`clients.${index}.dob`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Date of Birth <span className="text-destructive">*</span></FormLabel>
                                                    <FormControl>
                                                        <Input type="date" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`clients.${index}.aadhar`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Aadhar / ID</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="ID Number" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                        {isLoading
                            ? (isEditing ? 'Updating Case...' : 'Creating Case...')
                            : (isEditing ? 'Update Case' : 'Create Case')
                        }
                    </Button>
                </div>
            </form>
        </Form>
    )
}
