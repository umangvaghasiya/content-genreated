"use client"

import { db } from '@/utils/db';
import { AIOutput } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button'; 
import Templates from '@/app/(data)/Templates';
import { useAuth } from '@/app/(context)/AuthContext';
import { eq, desc, like, or } from 'drizzle-orm';
import Image from 'next/image';
import { Copy, Search, Eye, Clock, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface HISTORY {
    id: number,
    formData: string,
    aiResponse: string,
    templateSlug: string,
    createdBy: string,
    createdAt: string,
    words: string
}

function HistoryPage() {
    const { user } = useAuth();
    const [historyData, setHistoryData] = useState<HISTORY[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user) {
            getHistory();
        }
    }, [user]);

    const getHistory = async () => {
        setLoading(true);
        const userEmail = user?.email || 'dummy@example.com';
        
        try {
            if (!db) {
                console.warn("Database not initialized.");
                setLoading(false);
                return;
            }

            const result: HISTORY[] = await db.select()
                .from(AIOutput)
                .where(eq(AIOutput.createdBy, userEmail))
                .orderBy(desc(AIOutput.id));
            
            setHistoryData(result);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    }
    
    const getTemplateDetails = (slug: string) => {
        return Templates.find(template => template.slug === slug);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const filteredHistory = historyData.filter(item => {
        const template = getTemplateDetails(item.templateSlug);
        const searchStr = searchQuery.toLowerCase();
        return (
            template?.name.toLowerCase().includes(searchStr) ||
            item.aiResponse.toLowerCase().includes(searchStr)
        );
    });

    return (
        <div className="m-5 p-5 border rounded-lg bg-slate-900 shadow-xl min-h-[80vh]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="font-bold text-3xl text-white flex items-center gap-2">
                        <Clock className="text-purple-400" /> History
                    </h2>
                    <p className="text-gray-400">Review and manage your generated AI content</p>
                </div>
                
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input 
                        placeholder="Search history..." 
                        className="pl-10 bg-slate-800 border-slate-700 text-white focus:ring-purple-500"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-slate-950/50">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-slate-800/50 text-gray-100 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-5 font-semibold">Template</th>
                            <th className="px-6 py-5 font-semibold">Content Preview</th>
                            <th className="px-6 py-5 font-semibold">Date</th>
                            <th className="px-6 py-5 font-semibold">Words</th>
                            <th className="px-6 py-5 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-6 py-4">
                                        <div className="h-8 bg-slate-800 rounded w-full"></div>
                                    </td>
                                </tr>
                            ))
                        ) : filteredHistory.length > 0 ? (
                            filteredHistory.map((item, index) => {
                                const template = getTemplateDetails(item.templateSlug);
                                return (
                                    <tr key={index} className="hover:bg-slate-800/30 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-purple-900/20 transition-colors">
                                                    {template?.icon && (
                                                        <Image src={template.icon} alt={template.name} width={24} height={24} />
                                                    )}
                                                </div>
                                                <span className="font-medium text-white">{template?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="line-clamp-1 text-sm text-gray-400 max-w-md italic">
                                                "{item.aiResponse}"
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-3 w-3 text-gray-500" />
                                                {item.createdAt}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="px-2 py-1 bg-slate-800 rounded-md text-purple-300">
                                                {item.words}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/30"
                                                    onClick={() => copyToClipboard(item.aiResponse)}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                                                    onClick={() => alert(item.aiResponse)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3 text-gray-500">
                                        <FileText className="h-12 w-12 opacity-20" />
                                        <p>{searchQuery ? 'No matching results found.' : 'No history found yet.'}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HistoryPage;