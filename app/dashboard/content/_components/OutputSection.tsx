import React, { useEffect, useRef } from 'react'
import '@toast-ui/editor/dist/toastui-editor.css';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

const Editor = dynamic(() => import('@toast-ui/react-editor').then(mod => mod.Editor), {
  ssr: false,
});

interface props {
  aiOutput: string
}

function OutputSection({ aiOutput }: props) {

const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance()
      editorInstance.setMarkdown(aiOutput)
    }
  }, [aiOutput])

  return (
    <div className='bg-white text-black shadow-lg border rounded-lg'>
      <div className='flex justify-between items-center p-5'>
        <h2 className='font-medium text-lg'>Your Result</h2>
        <Button className='flex gap-2 bg-purple-500 hover:bg-purple-500'
        onClick={()=>navigator.clipboard.writeText(aiOutput)}><Copy className='w-4 h-4' /> Copy</Button>
      </div>
      <Editor
        ref={editorRef}
        initialValue="Your content will appear here"
        height="450px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        onChange={() => editorRef.current && console.log(editorRef.current.getInstance().getMarkdown())}
      />

    </div>
  )
}

export default OutputSection