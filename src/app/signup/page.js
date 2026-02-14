'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { signup } from '@/actions/auth'
import { toast } from 'sonner' // Using sonner

const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export default function SignupPage() {
    const router = useRouter()
    const [userType, setUserType] = useState('client')
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    async function onSubmit(values) {
        setIsLoading(true)
        const formData = new FormData()
        formData.append('name', values.name)
        formData.append('email', values.email)
        formData.append('password', values.password)
        formData.append('role', userType)

        try {
            const result = await signup(formData)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Account created successfully')
                router.push('/login')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-md shadow-xl bg-card">
                <CardHeader className="text-center">
                    <Link href="/" className="inline-block mb-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                            LexFlow
                        </span>
                    </Link>
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>
                        Join us to streamline your legal workflow
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* User Type Toggle */}
                    <div className="flex p-1 bg-muted rounded-lg mb-6 relative">
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-background rounded-md shadow-sm transition-all duration-300 ease-in-out ${userType === 'lawyer' ? 'left-[calc(50%+2px)]' : 'left-1'}`}
                        ></div>
                        <button
                            onClick={() => setUserType('client')}
                            className={`flex-1 relative z-10 py-1.5 text-sm font-medium transition-colors duration-300 ${userType === 'client' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            type="button"
                        >
                            Client
                        </button>
                        <button
                            onClick={() => setUserType('lawyer')}
                            className={`flex-1 relative z-10 py-1.5 text-sm font-medium transition-colors duration-300 ${userType === 'lawyer' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            type="button"
                        >
                            Lawyer
                        </button>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="name@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center flex-col">
                    <div className="mt-2 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-primary hover:underline transition-colors">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>

            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px] animate-blob"></div>
                <div className="absolute top-[50%] right-[20%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px] animate-blob animation-delay-2000"></div>
            </div>
        </div>
    )
}
