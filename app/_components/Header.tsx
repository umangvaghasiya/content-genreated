"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useAuth } from '../(context)/AuthContext'

function Header() {
  const { isSignedIn, login, logout, user } = useAuth();
  const path = usePathname();

  return  (
    <div className='p-6 border-b shadow-sm fixed top-0 left-0 right-0  z-50 bg-gray-900'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <Image
            src="https://img.freepik.com/premium-psd/computer-social-media-content-3d-icon-design_557569-440.jpg"
            width={45}
            height={45}
            alt="logo"
            className="rounded-full"
          />
          <Link href={'/'}>
            <h1 className="ml-1 font-bold text-3xl bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text">
              Content-Forge
            </h1>
          </Link>
        </div>

        {isSignedIn ? (
          <div className='flex items-center gap-5'>
            <Link href={'/dashboard'}>
              <Button className='bg-purple-500  hover:bg-purple-500'>DashBoard</Button>
            </Link>
            <div className='flex items-center gap-2'>
               {user?.imageUrl && <Image src={user.imageUrl} width={35} height={35} alt="user" className='rounded-full' />}
               <Button variant='ghost' onClick={logout} className="text-white">Logout</Button>
            </div>
          </div>
        ) : (
          <Link href={'/auth/login'}>
            <Button>Get Started</Button>
          </Link>
        )}

      </div>
    </div>
  )
}

export default Header;