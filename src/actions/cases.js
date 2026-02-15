'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createCase(data) {
    // data is a plain object now, not FormData, to handle complex nested arrays easily
    // OR we can parse FormData carefully.
    // Let's assume we'll pass a JSON object from the client for this complex form.

    const { title, description, clientId, clients } = data

    try {
        const newCase = await prisma.case.create({
            data: {
                title,
                description,
                clientId: parseInt(clientId),
                status: 'open',
                caseClients: {
                    create: clients.map(client => ({
                        firstName: client.firstName,
                        middleName: client.middleName,
                        lastName: client.lastName,
                        address: client.address,
                        phone: client.phone,
                        dob: new Date(client.dob), // Ensure valid date string
                        aadhar: client.aadhar
                    }))
                }
            },
        })
        revalidatePath('/dashboard')
        revalidatePath('/dashboard/cases')
        return { success: true, case: newCase }
    } catch (error) {
        console.error("Create Case Error:", error)
        return { error: error.message }
    }
}

export async function deleteCase(id) {
    try {
        await prisma.case.delete({
            where: { id: parseInt(id) },
        })
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        return { error: error.message }
    }
}

export async function updateCaseStatus(id, status) {
    try {
        await prisma.case.update({
            where: { id: parseInt(id) },
            data: { status },
        })
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        return { error: error.message }
    }
}

export async function updateCase(id, data) {
    const { title, description, status, clients } = data

    try {
        // Update case details
        await prisma.case.update({
            where: { id: parseInt(id) },
            data: { title, description, ...(status ? { status } : {}) },
        })

        // Replace all case clients: delete existing, create new
        await prisma.client.deleteMany({
            where: { caseId: parseInt(id) },
        })

        if (clients && clients.length > 0) {
            await prisma.client.createMany({
                data: clients.map(client => ({
                    caseId: parseInt(id),
                    firstName: client.firstName,
                    middleName: client.middleName || '',
                    lastName: client.lastName,
                    address: client.address,
                    phone: client.phone,
                    dob: new Date(client.dob),
                    aadhar: client.aadhar || '',
                })),
            })
        }

        revalidatePath('/dashboard')
        revalidatePath('/dashboard/cases')
        return { success: true }
    } catch (error) {
        console.error("Update Case Error:", error)
        return { error: error.message }
    }
}

// ... other actions if needed

export async function getCases(query = '', page = 1, pageSize = 10, filters = {}) {
    const where = { AND: [] }

    if (query) {
        where.AND.push({
            OR: [
                { title: { contains: query } },
                { description: { contains: query } },
                {
                    caseClients: {
                        some: {
                            OR: [
                                { firstName: { contains: query } },
                                { lastName: { contains: query } }
                            ]
                        }
                    }
                }
            ]
        })
    }

    if (filters.caseId) {
        where.AND.push({ id: parseInt(filters.caseId) })
    }

    if (filters.date) {
        try {
            const searchDate = new Date(filters.date)
            // Ensure valid date
            if (!isNaN(searchDate.getTime())) {
                const nextDay = new Date(searchDate)
                nextDay.setDate(searchDate.getDate() + 1)

                where.AND.push({
                    createdAt: {
                        gte: searchDate,
                        lt: nextDay
                    }
                })
            }
        } catch (e) {
            console.error("Invalid date filter:", filters.date)
        }
    }

    if (filters.clientFirstName) {
        where.AND.push({
            caseClients: {
                some: {
                    firstName: { contains: filters.clientFirstName }
                }
            }
        })
    }

    if (filters.clientLastName) {
        where.AND.push({
            caseClients: {
                some: {
                    lastName: { contains: filters.clientLastName }
                }
            }
        })
    }

    if (filters.aadhar) {
        where.AND.push({
            caseClients: {
                some: {
                    aadhar: { contains: filters.aadhar }
                }
            }
        })
    }

    if (filters.phone) {
        where.AND.push({
            caseClients: {
                some: {
                    phone: { contains: filters.phone }
                }
            }
        })
    }

    if (filters.status && filters.status !== 'all') {
        where.AND.push({ status: filters.status })
    }

    if (where.AND.length === 0) delete where.AND

    try {
        const [cases, totalCount] = await Promise.all([
            prisma.case.findMany({
                where,
                include: {
                    client: true, // System user
                    caseClients: true, // Detailed clients
                    lawyer: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.case.count({ where })
        ])

        return { cases, totalCount }
    } catch (error) {
        console.error("Get Cases Error:", error)
        return { cases: [], totalCount: 0 }
    }
}

export async function addDocument(caseId, data) {
    try {
        const doc = await prisma.document.create({
            data: {
                name: data.name,
                url: data.url,
                type: data.type,
                caseId: parseInt(caseId)
            }
        })
        revalidatePath('/dashboard')
        revalidatePath('/dashboard/cases')
        return { success: true, document: doc }
    } catch (error) {
        console.error("Add Document Error:", error)
        return { error: error.message }
    }
}

export async function getCaseDocuments(caseId) {
    try {
        const documents = await prisma.document.findMany({
            where: { caseId: parseInt(caseId) },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, documents }
    } catch (error) {
        return { error: error.message }
    }
}

export async function deleteDocument(id) {
    try {
        await prisma.document.delete({
            where: { id: parseInt(id) }
        })
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        return { error: error.message }
    }
}
