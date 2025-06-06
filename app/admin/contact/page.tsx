'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../../../components/ui/table';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read';
}

export default function ContactAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/contact');
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      toast.error('Failed to load messages');
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMessageStatus = async (id: string, newStatus: 'unread' | 'read') => {
    try {
      setUpdatingId(id);
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update message status');
      }

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === id ? { ...msg, status: newStatus } : msg
        )
      );
      toast.success('Message status updated');
    } catch (error) {
      toast.error('Failed to update message status');
      console.error('Error updating message status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <Button
          onClick={fetchMessages}
          variant="outline"
          size="sm"
          isLoading={isLoading}
        >
          Refresh
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell>
                  {format(new Date(message.createdAt), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell>{message.name}</TableCell>
                <TableCell>{message.email}</TableCell>
                <TableCell className="max-w-md truncate">
                  {message.message}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      message.status === 'unread'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }
                  >
                    {message.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() =>
                      updateMessageStatus(
                        message.id,
                        message.status === 'unread' ? 'read' : 'unread'
                      )
                    }
                    variant="outline"
                    size="sm"
                    isLoading={updatingId === message.id}
                  >
                    Mark as {message.status === 'unread' ? 'read' : 'unread'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {messages.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No messages found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 