import { ResumeUploader } from '@/components/resume-uploader'

export default function ResumeParsePage() {
  console.log('GROQ_API_KEY is set:', !!process.env.GROQ_API_KEY)
  
  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY is not set. Please add it to your environment variables.')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Resume Parser</h1>
      <p className="mb-4">Upload your resume (PDF or Word document) and our AI will extract the key information.</p>
      {!process.env.GROQ_API_KEY && (
        <p className="text-red-500 mb-4">Warning: GROQ_API_KEY is not set. The resume parser may not work correctly.</p>
      )}
      <ResumeUploader />
    </div>
  )
}

