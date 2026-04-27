"use client"
import React, { useState } from 'react'
import SideNav from './_components/SideNav';
import { TotalUsageContext } from '../(context)/TotalUsageContext';
import { UpdateCreditUsageContext } from '../(context)/UpdateCreditUsageContext';

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [totalUsage, setTotalUsage] = useState<Number>(0);
  const [updateCreditUsage, setUpdateCreditUsage] = useState<any>();

  return (
    <TotalUsageContext.Provider value={{ totalUsage, setTotalUsage }}>
      <UpdateCreditUsageContext.Provider value={{ updateCreditUsage, setUpdateCreditUsage }}>
        <div className='bg-slate-100 min-h-screen'>
          <div className='md:w-64 fixed hidden md:block'>
            <SideNav />
          </div>
          <div className='md:ml-64'>
            {children}
          </div>
        </div>
      </UpdateCreditUsageContext.Provider>
    </TotalUsageContext.Provider>
  )
}

export default DashboardLayout
