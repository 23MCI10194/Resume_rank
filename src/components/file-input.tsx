'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { UploadCloud } from 'lucide-react';
import React, { useState } from 'react';

type FileInputProps = React.ComponentPropsWithoutRef<typeof Input> & {
  label: string;
};

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ label, id, className, onChange, name, ...props }, ref) => {
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setFileName(e.target.files[0].name);
      } else {
        setFileName('');
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="grid w-full items-center gap-1.5">
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative">
          <label
            htmlFor={id}
            className={cn(
              'flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/10 transition-colors',
              className
            )}
          >
            <div className="flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
              <UploadCloud className="w-8 h-8 mb-2" />
              <span className="font-semibold text-sm break-all">
                {fileName || 'Click or drag file to upload'}
              </span>
              <p className="text-xs">{props.accept?.replace(/,/g, ', ')}</p>
            </div>
            <Input
              id={id}
              name={name}
              type="file"
              className="hidden"
              ref={ref}
              onChange={handleFileChange}
              {...props}
            />
          </label>
        </div>
      </div>
    );
  }
);
FileInput.displayName = 'FileInput';
