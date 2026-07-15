'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { saveCsvString } from '@/lib/csv-handler';
import { DownloadIcon } from 'lucide-react';

interface TemplateCardProps {
  title: string;
  description: string;
  filename: string;
  headers: string[];
  sampleData: string[][];
  csvContent: string;
}

export function TemplateCard({
  title,
  description,
  filename,
  headers,
  sampleData,
  csvContent,
}: TemplateCardProps) {
  const handleDownload = async () => {
    await saveCsvString(csvContent, filename, 'Template downloaded successfully!');
  };

  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div className='flex flex-col space-y-1.5'>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button variant='outline' onClick={handleDownload} className='ml-auto'>
          <DownloadIcon className='w-4 h-4 mr-2' />
          Download CSV
        </Button>
      </CardHeader>
      <CardContent>
        <div className='rounded-md border overflow-x-auto'>
          <table className='w-full text-sm text-left'>
            <thead className='bg-muted/50 text-muted-foreground'>
              <tr>
                {headers.map((header, idx) => (
                  <th key={idx} className='p-3 border-b font-medium'>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y'>
              {sampleData.map((row, rowIdx) => (
                <tr key={rowIdx} className='hover:bg-muted/30'>
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className='p-3'>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
