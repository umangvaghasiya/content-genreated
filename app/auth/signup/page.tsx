"use client"
import React, { useState } from 'react'
import { db } from '@/utils/db'
import { Users } from '@/utils/schema'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/(context)/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import moment from 'moment'

function SignUp() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { login } = useAuth()

    const onSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await db.insert(Users).values({
                name: name,
                email: email,
                password: password, // In a real app, hash this!
                createdAt: moment().format('DD/MM/yyyy')
            }).returning()

            if (result && result.length > 0) {
                login({
                    id: result[0].id,
                    name: result[0].name,
                    email: result[0].email
                })
                router.push('/dashboard')
            }
        } catch (error) {
            console.error(error)
            alert("Signup failed. Email might already exist.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-slate-950 text-white'>
            <div className='p-10 bg-slate-900 rounded-xl shadow-2xl w-full max-w-md border border-slate-800'>
                <h1 className='text-3xl font-bold mb-6 text-center text-purple-400'>Create Account</h1>
                <form onSubmit={onSignUp} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium mb-1'>Full Name</label>
                        <Input 
                            placeholder='John Doe' 
                            required 
                            className='bg-slate-800 border-slate-700 text-white'
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>
                <p className='mt-6 text-center text-slate-400'>
                    Already have an account? <Link href='/auth/login' className='text-purple-400 hover:underline'>Login</Link>
                </p>
            </div>
        </div>
    )
}

export default SignUp