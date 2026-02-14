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

// ... other actions if needed

export async function getCases(query = '') {
    const where = query ? {
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
    } : {}

    try {
        const cases = await prisma.case.findMany({
            where,
            include: {
                client: true, // System user
                caseClients: true, // Detailed clients
                lawyer: true,
            },
            orderBy: {
                createdAt: 'desc',
            }
        })
        return cases
    } catch (error) {
        console.error("Get Cases Error:", error)
        return []
    }
}
