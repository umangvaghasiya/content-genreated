"use client"
import React, { useState } from 'react'
import { db } from '@/utils/db'
import { Users } from '@/utils/schema'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/(context)/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { and, eq } from 'drizzle-orm'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { login } = useAuth()

    const onLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await db.select().from(Users)
                .where(and(eq(Users.email, email), eq(Users.password, password)))

            if (result && result.length > 0) {
                login({
                    id: result[0].id,
                    name: result[0].name,
                    email: result[0].email,
                    imageUrl: result[0].imageUrl || undefined
                })
                router.push('/dashboard')
            } else {
                alert("Invalid email or password")
            }
        } catch (error) {
            console.error(error)
            alert("Login failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-slate-950 text-white'>
            <div className='p-10 bg-slate-900 rounded-xl shadow-2xl w-full max-w-md border border-slate-800'>
                <h1 className='text-3xl font-bold mb-6 text-center text-purple-400'>Welcome Back</h1>
                <form onSubmit={onLogin} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium mb-1'>Email Address</label>
                        <Input 
                            type='email' 
                            placeholder='name@example.com' 
                            required 
                            className='bg-slate-800 border-slate-700 text-white'
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-1'>Password</label>
                        <Input 
                            type='password' 
                            placeholder='••••••••' 
                            required 
                            className='bg-slate-800 border-slate-700 text-white'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button type='submit' className='w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition duration-300' disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                <p className='mt-6 text-center text-slate-400'>
                    Don't have an account? <Link href='/auth/signup' className='text-purple-400 hover:underline'>Sign Up</Link>
                </p>
            </div>
        </div>
    )
}

export default Login