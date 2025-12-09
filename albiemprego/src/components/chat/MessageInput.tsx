import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface AttachedFile {
  file: File;
  preview?: string;
}

interface MessageInputProps {
  onSend: (text: string, files?: File[]) => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

const MessageInput = ({ 
  onSend, 
  placeholder = "Escreva uma mensagem...", 
  maxLength = 2000,
  disabled = false 
}: MessageInputProps) => {
  const [text, setText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if ((!text.trim() && attachedFiles.length === 0) || isSending) return;
    
    setIsSending(true);
    
    try {
      await onSend(text.trim(), attachedFiles.map(af => af.file));
      setText('');
      setAttachedFiles([]);
      textareaRef.current?.focus();
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttached: AttachedFile[] = files.map(file => {
      const attached: AttachedFile = { file };
      if (file.type.startsWith('image/')) {
        attached.preview = URL.createObjectURL(file);
      }
      return attached;
    });
    
    setAttachedFiles(prev => [...prev, ...newAttached].slice(0, 5));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => {
      const file = prev[index];
      if (file.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="border-t bg-background p-3">
      {/* Attached files preview */}
      {attachedFiles.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
          {attachedFiles.map((af, index) => (
            <div 
              key={index}
              className="relative flex-shrink-0 w-16 h-16 rounded-lg border bg-muted overflow-hidden group"
            >
              {af.preview ? (
                <img 
                  src={af.preview} 
                  alt={af.file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <button
                onClick={() => removeFile(index)}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Attach button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || attachedFiles.length >= 5}
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Text input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value.slice(0, maxLength));
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSending}
            className="min-h-[40px] max-h-[120px] resize-none pr-16"
            rows={1}
          />
          {text.length > maxLength * 0.8 && (
            <span className={cn(
              "absolute bottom-1 right-2 text-xs",
              text.length >= maxLength ? "text-destructive" : "text-muted-foreground"
            )}>
              {text.length}/{maxLength}
            </span>
          )}
        </div>

        {/* Send button */}
        <Button
          type="button"
          size="icon"
          onClick={handleSend}
          disabled={disabled || isSending || (!text.trim() && attachedFiles.length === 0)}
          className="flex-shrink-0"
        >
          {isSending ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      <p className="text-[10px] text-muted-foreground mt-1 text-center">
        Mantenha a comunicação profissional. Shift+Enter para nova linha.
      </p>
    </div>
  );
};

export default MessageInput;
