'use server'

import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function login(formData) {
    const email = formData.get('email')
    const password = formData.get('password')

    const user = await prisma.user.findUnique({
        where: { email },
    })

    // Basic password check (insecure, matching original impl)
    if (!user || user.password !== password) {
        return { error: 'Invalid email or password' }
    }

    // Set user in session/cookie?
    // For now, we'll just return the user to client to handle state locally
    // Ideally, use NextAuth or cookies. Sticking to simple approach for now.
    const { password: _, ...userWithoutPassword } = user
    return { success: true, user: userWithoutPassword }
}

export async function signup(formData) {
    const email = formData.get('email')
    const password = formData.get('password')
    const name = formData.get('name')
    const role = formData.get('role') || 'client'

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password,
                name,
                role,
            },
        })
        const { password: _, ...userWithoutPassword } = user
        return { success: true, user: userWithoutPassword }
    } catch (error) {
        return { error: 'User already exists or other error' }
    }
}
