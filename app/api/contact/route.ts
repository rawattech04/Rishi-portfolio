import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Contact from '@/models/Contact';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = contactSchema.parse(body);
    
    // Connect to database using Mongoose for the POST request
    await dbConnect();
    
    // Create new contact message
    const contact = await Contact.create(validatedData);
    
    return NextResponse.json({
      message: 'Message sent successfully',
      contact
    }, { status: 201 });
    
  } catch (error) {
    console.error('Contact API Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation error',
        details: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Connect to database using Mongoose for consistency with the model
    await dbConnect();
    const contacts = await Contact.find()
      .sort('-createdAt')
      .lean();

    // Transform the data to match the expected format
    const formattedMessages = contacts.map(message => {
      const typedMessage = message as unknown as {
        _id: { toString: () => string };
        name: string;
        email: string;
        subject: string;
        message: string;
        status?: string;
        createdAt: Date;
      };

      return {
        id: typedMessage._id.toString(),
        name: typedMessage.name,
        email: typedMessage.email,
        subject: typedMessage.subject,
        message: typedMessage.message,
        status: typedMessage.status || 'unread',
        createdAt: typedMessage.createdAt.toISOString(),
      };
    });

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact messages' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database using Mongoose for consistency
    await dbConnect();
    const result = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to update message status' },
      { status: 500 }
    );
  }
} 