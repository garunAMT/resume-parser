// 'use server'

// import { generateText } from 'ai'
// import { openai } from '@ai-sdk/openai'
// import { PDFLoader } from 'langchain/document_loaders/fs/pdf'

// export async function parseResume(formData: FormData) {
//   const file = formData.get('resume') as File
//   if (!file) {
//     throw new Error('No file uploaded')
//   }

//   const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
//   if (!allowedTypes.includes(file.type)) {
//     throw new Error('Invalid file type. Please upload a PDF or Word document.')
//   }

//   let text = ''

//   try {
//     if (file.type === 'application/pdf') {
//       const loader = new PDFLoader(file)
//       const pages = await loader.load()
//       text = pages.map(page => page.pageContent).join('\n')
//     } else {
//       // For Word documents, we'll just read the file as text
//       text = await file.text()
//     }

//     const prompt = `
//       You are an AI assistant specialized in parsing resumes. Given the following resume content, extract and organize the information into a structured format. Include the following sections if available:

//       1. Personal Information (name, email, phone, location)
//       2. Summary or Objective
//       3. Work Experience (company, position, dates, responsibilities)
//       4. Education (institution, degree, dates)
//       5. Skills
//       6. Certifications or Awards

//       Present the information in a clear, organized JSON format.

//       Resume content:
//       ${text}
//     `

//     const { text: parsedResume } = await generateText({
//       model: openai('gpt-3.5-turbo'),
//       prompt: prompt,
//       temperature: 0.5,
//       max_tokens: 1000,
//     })

//     return JSON.parse(parsedResume)
//   } catch (error) {
//     console.error('Error parsing resume:', error)
//     throw new Error('Failed to parse resume. Please try again.')
//   }
// }

