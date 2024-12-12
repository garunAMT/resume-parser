'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { parseResume } from '@/actions/parse-resume'

interface ParsedResume {
  personalInformation?: {
    name?: string
    email?: string
    phone?: string
    location?: string
  }
  summary?: string
  workExperience?: Array<{
    company?: string
    position?: string
    dates?: string
    responsibilities?: string[]
  }>
  education?: Array<{
    institution?: string
    degree?: string
    dates?: string
  }>
  skills?: string[]
  certifications?: string[]
}

export function ResumeUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0]
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Please upload a PDF, DOC, or DOCX file.')
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file before submitting.')
      return
    }

    setIsLoading(true)
    setError(null)
    setParsedData(null)

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const result = await parseResume(formData)
      setParsedData(result)
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      if (error instanceof Error) {
        setError(`Error: ${error.message}`)
      } else {
        setError('An unknown error occurred while parsing the resume.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
        <Button type="submit" disabled={!file || isLoading}>
          {isLoading ? 'Parsing...' : 'Parse Resume'}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {parsedData && (
        <Card>
          <CardHeader>
            <CardTitle>Parsed Resume Data (using Groq API)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parsedData.personalInformation && (
                <div>
                  <h3 className="font-semibold">Personal Information</h3>
                  <p>Name: {parsedData.personalInformation.name}</p>
                  <p>Email: {parsedData.personalInformation.email}</p>
                  <p>Phone: {parsedData.personalInformation.phone}</p>
                  <p>Location: {parsedData.personalInformation.location}</p>
                </div>
              )}
              {parsedData.summary && (
                <div>
                  <h3 className="font-semibold">Summary</h3>
                  <p>{parsedData.summary}</p>
                </div>
              )}
              {parsedData.workExperience && (
                <div>
                  <h3 className="font-semibold">Work Experience</h3>
                  {parsedData.workExperience.map((job, index) => (
                    <div key={index} className="mb-2">
                      <p><strong>{job.position}</strong> at {job.company}</p>
                      <p>{job.dates}</p>
                      <ul className="list-disc list-inside">
                        {job.responsibilities?.map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {parsedData.education && (
                <div>
                  <h3 className="font-semibold">Education</h3>
                  {parsedData.education.map((edu, index) => (
                    <div key={index}>
                      <p><strong>{edu.degree}</strong> - {edu.institution}</p>
                      <p>{edu.dates}</p>
                    </div>
                  ))}
                </div>
              )}
              {parsedData.skills && (
                <div>
                  <h3 className="font-semibold">Skills</h3>
                  <p>{parsedData.skills.join(', ')}</p>
                </div>
              )}
              {parsedData.certifications && (
                <div>
                  <h3 className="font-semibold">Certifications</h3>
                  <ul className="list-disc list-inside">
                    {parsedData.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
