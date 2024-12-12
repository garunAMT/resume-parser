'use server'

import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

export async function parseResume(formData: FormData) {
  try {
    const file = formData.get('resume') as File;
    if (!file) {
      throw new Error('No file uploaded');
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileName = file.name.toLowerCase();

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.some((ext) => fileName.endsWith(ext))
    ) {
      throw new Error('Invalid file type. Please upload a PDF, DOC, or DOCX file.');
    }

    const maxSizeMB = 5; // 5 MB
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`File size exceeds ${maxSizeMB} MB.`);
    }

    let text = '';

    try {
      text = await file.text();
    } catch (error) {
      console.error('Error reading file:', error);
      throw new Error('Failed to read the uploaded file.');
    }

    if (text.length === 0) {
      throw new Error('The uploaded file is empty or could not be read.');
    }

    const prompt = `
      You are an AI assistant specialized in parsing resumes. Given the following resume content, extract and organize the information into a structured format. Include the following sections if available:

      1. Personal Information (name, email, phone, location)
      2. Summary or Objective
      3. Work Experience (company, position, dates, responsibilities)
      4. Education (institution, degree, dates)
      5. Skills
      6. Certifications or Awards

      If the content appears to be in a non-text format (like PDF), do your best to interpret the available text and structure.

      Present the information in a clear, organized JSON format.

      Resume content:
      ${text}
    `;

    console.log('Prompt sent to Groq API:', prompt);

    let parsedResume;
    try {
      console.log('Sending request to Groq API...');
      const response = await generateText({
        model: groq('mixtral-8x7b-32768'),
        prompt: prompt,
        temperature: 0.5,
        maxTokens: 1000,
      });

      console.log('Groq API raw response:', response);
      parsedResume = response.text;

      if (!parsedResume || typeof parsedResume !== 'string') {
        throw new Error('Empty or invalid response from Groq API.');
      }
    } catch (apiError) {
      console.error('Error during Groq API call:', apiError);
      throw new Error('Failed to communicate with Groq API. Please try again later.');
    }

    let parsedData;
    try {
      parsedData = JSON.parse(parsedResume);
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      console.error('Raw response from Groq API:', parsedResume);

      // If parsing fails, save raw response for debugging
      return {
        error: 'Failed to parse the AI response as JSON.',
        rawResponse: parsedResume,
      };
    }

    if (Object.keys(parsedData).length === 0) {
      throw new Error('The AI was unable to extract any information from the resume.');
    }

    return parsedData;
  } catch (error) {
    console.error('Error in parseResume:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to parse resume: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while parsing the resume.');
    }
  }
}
