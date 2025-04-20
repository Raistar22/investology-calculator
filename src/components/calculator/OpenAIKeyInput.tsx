
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Eye, EyeOff, Wand } from 'lucide-react';
import { toast } from 'sonner';

interface OpenAIKeyInputProps {
  onSubmit: (apiKey: string) => void;
  isLoading: boolean;
}

const OpenAIKeyInput: React.FC<OpenAIKeyInputProps> = ({ onSubmit, isLoading }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error('Please enter your OpenAI API key');
      return;
    }
    onSubmit(apiKey);
  };

  // Save key to localStorage
  const saveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey);
      toast.success('API key saved to browser storage');
    }
  };

  // Try to load the key from localStorage
  React.useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          OpenAI API Key
        </CardTitle>
        <CardDescription>
          Enter your OpenAI API key to generate AI-powered investment strategies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="pr-10"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={saveKey}
              disabled={!apiKey.trim() || isLoading}
            >
              Save Key
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              className="flex-1"
              disabled={!apiKey.trim() || isLoading}
            >
              <Wand className="h-4 w-4 mr-2" />
              {isLoading ? 'Generating Strategy...' : 'Generate AI Strategy'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Your API key is stored locally in your browser and never sent to our servers.
            We only use it to make direct requests to OpenAI's API.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default OpenAIKeyInput;
