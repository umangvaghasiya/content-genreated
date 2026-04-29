"use client"
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/(context)/AuthContext';
import { db } from '@/utils/db';
import { Users } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { User, Mail, Lock, Eye, EyeOff, Calendar, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

function Settings() {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (authUser) {
      getUserDetails();
    }
  }, [authUser]);

  const getUserDetails = async () => {
    setLoading(true);
    try {
      if (!db) return;
      
      const result = await db.select().from(Users)
        .where(eq(Users.email, authUser?.email || ''))
        .limit(1);

      if (result && result.length > 0) {
        setUserData(result[0]);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-slate-950 min-h-screen text-white">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-purple-400 h-8 w-8" />
            <h2 className="text-3xl font-bold text-white">Account Settings</h2>
        </div>
        <p className="text-gray-400 mb-8 ml-11">View and manage your profile information</p>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden shadow-xl">
                {userData?.imageUrl ? (
                  <Image src={userData.imageUrl} alt="Profile" width={96} height={96} className="object-cover" />
                ) : (
                  <User className="w-12 h-12 text-slate-500" />
                )}
              </div>
            </div>
          </div>

          <div className="pt-16 p-8 space-y-6">
            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-24"></div>
                    <div className="h-12 bg-slate-800 rounded w-full"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-24"></div>
                    <div className="h-12 bg-slate-800 rounded w-full"></div>
                </div>
              </div>
            ) : userData ? (
              <div className="grid gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name
                  </label>
                  <div className="p-4 bg-slate-800/40 border border-slate-700 rounded-xl text-lg text-white">
                    {userData.name}
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </label>
                  <div className="p-4 bg-slate-800/40 border border-slate-700 rounded-xl text-lg text-white">
                    {userData.email}
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Password
                  </label>
                  <div className="relative group">
                    <div className="p-4 bg-slate-800/40 border border-slate-700 rounded-xl text-lg font-mono text-white">
                      {showPassword ? userData.password : '••••••••••••'}
                    </div>
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Member since: {userData.createdAt || 'N/A'}</span>
                    </div>
                    <div className="px-3 py-1 bg-green-900/20 text-green-400 rounded-full text-xs font-medium border border-green-900/30">
                        Active Account
                    </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
                <p className="text-slate-400">Please sign in to view your profile settings.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl flex gap-4 items-start">
           <div className="p-2 bg-blue-500/20 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
           </div>
           <div>
               <h4 className="text-blue-300 font-semibold mb-1">Security Privacy</h4>
               <p className="text-sm text-blue-200/70 leading-relaxed">
                 Your password is shown here for your convenience as part of this prototype. In a real-world application, passwords would be hashed and never displayed in plain text.
               </p>
           </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;