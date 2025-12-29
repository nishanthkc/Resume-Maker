import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { latexCode } = body;

    // Validate input
    if (!latexCode || typeof latexCode !== 'string' || latexCode.trim().length === 0) {
      return NextResponse.json(
        { error: 'LaTeX code is required and cannot be empty' },
        { status: 400 }
      );
    }

    // Check if required environment variables are set
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('AWS credentials are not configured');
      return NextResponse.json(
        { error: 'AWS credentials are not configured' },
        { status: 500 }
      );
    }

    // Validate LaTeX code length (prevent extremely large files)
    if (latexCode.length > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json(
        { error: 'LaTeX code exceeds maximum size limit of 10MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const filename = `resume-${uuidv4()}.tex`;
    const s3Key = `snips/${filename}`;

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: 'latex-snips-001',
      Key: s3Key,
      Body: latexCode,
      ContentType: 'text/plain',
    });

    await s3Client.send(command);

    // Construct public URL
    const publicUrl = `https://latex-snips-001.s3.us-east-1.amazonaws.com/${s3Key}`;

    return NextResponse.json({
      success: true,
      filename,
      url: publicUrl,
    });
  } catch (error) {
    console.error('S3 upload error:', error);
    
    // Handle specific AWS errors
    if (error instanceof Error) {
      if (error.message.includes('credentials') || error.message.includes('Credential')) {
        return NextResponse.json(
          { error: 'AWS credentials are invalid or missing' },
          { status: 500 }
        );
      }
      if (error.message.includes('bucket') || error.message.includes('Bucket')) {
        return NextResponse.json(
          { error: 'S3 bucket access error. Please check bucket name and permissions.' },
          { status: 500 }
        );
      }
      if (error.message.includes('Network') || error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Network error. Please check your connection and try again.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to upload file to S3. Please try again.' },
      { status: 500 }
    );
  }
}

