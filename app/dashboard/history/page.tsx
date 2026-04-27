"use client"

import { db } from '@/utils/db';
import { AIOutput } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button'; 
import Templates from '@/app/(data)/Templates';

function HistoryPage() {
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        if (!db) {
            console.warn("Database is not initialized. Skipping data fetch.");
            setLoading(false);
            return;
        }
        try {
            const result = await db.select().from(AIOutput);
            setHistoryData(result);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    const getTemplateDetails = (slug: string) => {
        return Templates.find(template => template.slug === slug);
    };

    if (loading) {
        return <div className="mx-auto p-6 text-center text-white pt-32">Loading...</div>;
    }

    return (
        <div className=" mx-auto p-6  rounded-lg shadow-lg pt-32 bg-slate-900 text-purple-200">
            <h1 className="text-5xl font-bold mb-6 text-center ">History</h1>
            
            <div className="overflow-x-auto">
                <table className="w-full h-screen rounded-md shadow-md">
                    <thead className="bg-slate-950 text-white">
                        <tr>
                            <th className="p-3 text-left">Template</th>
                            <th className="p-3 text-left">AI Response</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Words</th>
                            <th className="p-3 text-left">Copy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyData.map((entry: any, index) => {
                            let formData = {};
                            try {
                                formData = JSON.parse(entry.formData);
                            } catch (e) {
                                console.error("Error parsing formData", e);
                            }
                            const wordCount = entry.aiResponse ? entry.aiResponse.split(' ').length : 0;
                            const templateDetails = getTemplateDetails(entry.templateSlug || '');

                            return (
                                <tr key={index} className="border-b border-gray-300">
                                    <td className="p-4 flex items-center space-x-4">
                                        {templateDetails?.icon ? (
                                            <img src={templateDetails.icon} alt={templateDetails.name} className="w-12 h-12 object-cover rounded-md" />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                                <span className="text-gray-500">No Image</span>
                                            </div>
                                        )}
                                        <span>{templateDetails?.name || 'No Name'}</span>
                                    </td>
                                    <td className="p-4 truncate max-w-xs">{entry.aiResponse}</td>
                                    <td className="p-4">{entry.createdAt}</td>
                                    <td className="p-4 text-center">{wordCount}</td>
                                    <td className="p-4 text-center">
                                        <Button
                                            onClick={() => navigator.clipboard.writeText(entry.aiResponse)}
                                            className="bg-blue-500 text-white hover:bg-blue-600"
                                        >
                                            Copy
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HistoryPage;
