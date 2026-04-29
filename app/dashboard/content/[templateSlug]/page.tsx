"use client"

import React, { useContext, useState } from 'react'
import FormSection from '../_components/FormSection'
import OutputSection from '../_components/OutputSection'
import { TEMPLATE } from '../../_components/TemplateListSection'
import Templates from '@/app/(data)/Templates'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { chatSession } from '@/utils/AiModel'
import { db } from '@/utils/db'
import { AIOutput } from '@/utils/schema'
import { useAuth } from '@/app/(context)/AuthContext'
import moment from 'moment'
import { TotalUsageContext } from '@/app/(context)/TotalUsageContext'
import { useRouter } from 'next/navigation'
import { UpdateCreditUsageContext } from '@/app/(context)/UpdateCreditUsageContext'


interface PROPS {
    params: Promise<{
        templateSlug: string
    }>
}

function CreateNewContent(props: PROPS) {
    const params = React.use(props.params);
    const selectedTemplate: TEMPLATE | undefined = Templates?.find((item) => item.slug == params.templateSlug)

    const [loading, setLoading] = useState(false);

    const [aiOutput, setAiOutput] = useState<string>('');

    const { user } = useAuth();
    const router = useRouter()
    const { totalUsage, setTotalUsage } = useContext(TotalUsageContext)
    const { updateCreditUsage, setUpdateCreditUsage } = useContext(UpdateCreditUsageContext)



    const GenerateAIContent = async (formData: any) => {
        if (totalUsage >= 13000) {
            console.log("please upgrade")
            router.push('/dashboard/billing')
            return;
        }
        setLoading(true)
        const SelectedPrompt = selectedTemplate?.aiprompt;

        const FinalAIPrompt = JSON.stringify(formData) + ", " + SelectedPrompt;

        const result = await chatSession.sendMessage(FinalAIPrompt)

        setAiOutput(result?.response.text());
        await SaveInDb(formData, selectedTemplate?.slug, result?.response.text())
        setLoading(false);

        setUpdateCreditUsage(Date.now())
    }

    const SaveInDb = async (formData: any, slug: string | undefined, aiResp: string | undefined) => {
        const userEmail = user?.email || 'dummy@example.com';
        if (!slug || !aiResp) {
            console.error("Missing required fields for DB insert");
            return;
        }

        if (!db) {
            console.warn("Database not initialized. Skipping SaveInDb.");
            return;
        }
    
        await db.insert(AIOutput).values({
            formData: JSON.stringify(formData), // Ensure it's a string
            templateSlug: slug,
            aiResponse: aiResp,
            createdBy: userEmail, // Ensure it's defined
            createdAt: moment().format('DD/MM/yyyy'),
            words: aiResp.split(/\s+/).filter(word => word.length > 0).length.toString()
        });
    };
    



    return (
        <div className='p-4 pt-28 bg-slate-950 h-screen text-white'>
            <Link href={"/dashboard"}>
                <Button className='bg-purple-500 hover:bg-purple-500'> <ArrowLeft /> Back</Button>
            </Link>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5 py-5'>
                <FormSection selectedTemplate={selectedTemplate}
                    userFormInput={(v: any) => GenerateAIContent(v)}
                    loading={loading}
                />

                <div className="col-span-2">
                    <OutputSection aiOutput={aiOutput} />
                </div>
            </div>
        </div>
    )
}

export default CreateNewContent