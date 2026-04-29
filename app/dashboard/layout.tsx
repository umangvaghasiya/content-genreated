"use client"

import React, { useEffect, useState } from 'react'
import SideNav from './_components/SideNav';
import { TotalUsageContext } from '../(context)/TotalUsageContext';
import { UpdateCreditUsageContext } from '../(context)/UpdateCreditUsageContext';
import { useAuth } from '../(context)/AuthContext';
import { useRouter } from 'next/navigation';

function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
 
    const [totalUsage, setTotalUsage] = useState<Number>(0);
    const [updateCreditUsage,setUpdateCreditUsage]=useState<any>()
    const { isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isSignedIn) {
            router.push('/auth/login');
        }
    }, [isSignedIn]);

    if (!isSignedIn) {
        return <div className='h-screen bg-slate-950 flex items-center justify-center text-white'>Redirecting...</div>;
    }

    return (
        <TotalUsageContext.Provider value={{ totalUsage, setTotalUsage }}>
            <UpdateCreditUsageContext.Provider value={{updateCreditUsage,setUpdateCreditUsage}}>
                <div className=' h-screen bg-slate-950'>
                    <div className="md:w-64 hidden md:block fixed">
                        <SideNav />
                    </div>
                    <div className="md:ml-64 pt-24">
                        
                        {children}
                    </div>

                </div>
            </UpdateCreditUsageContext.Provider>
        </TotalUsageContext.Provider>
    )
}

export default layout