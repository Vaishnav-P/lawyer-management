'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCaseDocuments, addDocument, deleteDocument } from "@/actions/cases"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { FileText, Download, Plus, Trash, Eye } from "lucide-react"

export function CaseDetailsDialog({ caseItem, open, onOpenChange }) {
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(false)
    const [newDocName, setNewDocName] = useState("")
    const [file, setFile] = useState(null)

    useEffect(() => {
        if (open && caseItem) {
            fetchDocuments()
        }
    }, [open, caseItem])

    async function fetchDocuments() {
        setLoading(true)
        const res = await getCaseDocuments(caseItem.id)
        if (res.success) {
            setDocuments(res.documents)
        }
        setLoading(false)
    }

    async function handleAddDocument(e) {
        e.preventDefault()
        if (!newDocName || !file) return

        // Validation: Max size 10MB
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be less than 10MB")
            return
        }

        // Validation: Allowed types
        const allowedTypes = [
            // Images
            "image/jpeg", "image/png", "image/gif", "image/webp",
            // PDF
            "application/pdf",
            // Word
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            // Excel
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ]

        if (!allowedTypes.includes(file.type)) {
            toast.error("Invalid file type. Only Images, PDF, Word, and Excel files are allowed.")
            return
        }

        // Convert file to Base64 for storing (for demo purposes)
        // In production, upload to S3/Cloud Storage and get URL
        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = async () => {
            const base64Data = reader.result

            const res = await addDocument(caseItem.id, {
                name: newDocName,
                url: base64Data, // Storing base64 string directly
                type: file.type || "application/octet-stream"
            })

            if (res.success) {
                toast.success("Document uploaded")
                setNewDocName("")
                setFile(null)
                // Clear the file input manually since it's uncontrolled in some ways or just to be safe
                document.getElementById('file').value = ''
                fetchDocuments()
            } else {
                toast.error(res.error)
            }
        }
    }

    async function handleDeleteDocument(id) {
        if (!confirm('Are you sure you want to delete this document?')) return
        const res = await deleteDocument(id)
        if (res.success) {
            toast.success("Document deleted")
            fetchDocuments()
        } else {
            toast.error(res.error)
        }
    }

    function handleViewDocument(doc) {
        // Open the base64 URL or file path in a new tab
        const win = window.open()
        if (win) {
            win.document.write(
                `<iframe src="${doc.url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
            )
        }
    }

    if (!caseItem) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Case Details: {caseItem.title}</DialogTitle>
                    <DialogDescription>View case information and manage documents.</DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="details" className="flex-1 overflow-hidden flex flex-col">
                    <TabsList>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="clients">Clients</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="flex-1 overflow-y-auto p-4 border rounded-md mt-2">
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg">Description</h3>
                                <p className="text-muted-foreground">{caseItem.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium">Status</h4>
                                    <p className="capitalize">{caseItem.status.replace('_', ' ')}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium">Created At</h4>
                                    <p>{new Date(caseItem.createdAt).toLocaleDateString('en-GB')}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium">Case ID</h4>
                                    <p>{caseItem.id}</p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="clients" className="flex-1 overflow-y-auto p-4 border rounded-md mt-2">
                        {caseItem.caseClients && caseItem.caseClients.map(client => (
                            <Card key={client.id} className="mb-4">
                                <CardHeader>
                                    <CardTitle>{client.firstName} {client.lastName}</CardTitle>
                                    <CardDescription>Client ID: {client.id}</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Phone</Label>
                                        <p>{client.phone}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Aadhar</Label>
                                        <p>{client.aadhar || '-'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Address</Label>
                                        <p>{client.address}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">DOB</Label>
                                        <p>{new Date(client.dob).toLocaleDateString('en-GB')}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>

                    <TabsContent value="documents" className="flex-1 overflow-hidden flex flex-col mt-2">
                        <div className="flex-1 overflow-y-auto p-4 border rounded-md mb-4">
                            {loading ? (
                                <p>Loading documents...</p>
                            ) : documents.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">No documents found.</p>
                            ) : (
                                <div className="space-y-2">
                                    {documents.map(doc => (
                                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md bg-card">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-500/10 rounded-md">
                                                    <FileText className="h-5 w-5 text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium cursor-pointer hover:underline" onClick={() => handleViewDocument(doc)}>{doc.name}</p>
                                                    <p className="text-xs text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString('en-GB')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => handleViewDocument(doc)} title="View Document">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteDocument(doc.id)} title="Delete Document">
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleAddDocument} className="flex gap-2 p-1 items-end">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="docName">Document Name</Label>
                                <Input
                                    id="docName"
                                    placeholder="e.g. Court Order"
                                    value={newDocName}
                                    onChange={e => setNewDocName(e.target.value)}
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="file">File</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    onChange={e => setFile(e.target.files[0])}
                                />
                            </div>
                            <Button type="submit" disabled={!newDocName || !file}>
                                <Plus className="h-4 w-4 mr-2" /> Upload
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
