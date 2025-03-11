
import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';

export interface IncomeSource {
  id: string;
  type: string;
  amount: number;
  description: string;
}

interface IncomeSourcesFormProps {
  onUpdate: (sources: IncomeSource[]) => void;
}

const incomeTypes = [
  { value: 'salary', label: 'Salary' },
  { value: 'business', label: 'Business Income' },
  { value: 'rental', label: 'Rental Income' },
  { value: 'capital_gains', label: 'Capital Gains' },
  { value: 'interest', label: 'Interest Income' },
  { value: 'dividends', label: 'Dividends' },
  { value: 'freelance', label: 'Freelance Income' },
  { value: 'other', label: 'Other Income' },
];

const IncomeSourcesForm: React.FC<IncomeSourcesFormProps> = ({ onUpdate }) => {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([
    { id: '1', type: 'salary', amount: 0, description: '' }
  ]);

  const handleAddSource = () => {
    const newSource = {
      id: Date.now().toString(),
      type: 'salary',
      amount: 0,
      description: ''
    };
    
    const updatedSources = [...incomeSources, newSource];
    setIncomeSources(updatedSources);
    onUpdate(updatedSources);
  };

  const handleRemoveSource = (id: string) => {
    if (incomeSources.length === 1) {
      toast.error("You must have at least one income source.");
      return;
    }
    
    const updatedSources = incomeSources.filter(source => source.id !== id);
    setIncomeSources(updatedSources);
    onUpdate(updatedSources);
  };

  const handleChange = (id: string, field: keyof IncomeSource, value: string | number) => {
    const updatedSources = incomeSources.map(source => {
      if (source.id === id) {
        return { ...source, [field]: value };
      }
      return source;
    });
    
    setIncomeSources(updatedSources);
    onUpdate(updatedSources);
  };

  return (
    <div className="rounded-xl p-6 glass">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Income Sources</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddSource}
          className="rounded-full"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Source
        </Button>
      </div>
      
      <div className="space-y-6">
        {incomeSources.map((source, index) => (
          <div 
            key={source.id} 
            className="p-4 rounded-lg border border-border bg-white/50 animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Income Source {index + 1}</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveSource(source.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`type-${source.id}`}>Income Type</Label>
                <Select
                  value={source.type}
                  onValueChange={(value) => handleChange(source.id, 'type', value)}
                >
                  <SelectTrigger id={`type-${source.id}`}>
                    <SelectValue placeholder="Select Income Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`amount-${source.id}`}>Annual Amount (₹)</Label>
                <Input
                  id={`amount-${source.id}`}
                  type="number"
                  value={source.amount === 0 ? '' : source.amount}
                  onChange={(e) => handleChange(source.id, 'amount', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="appearance-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`description-${source.id}`}>Description (Optional)</Label>
                <Input
                  id={`description-${source.id}`}
                  value={source.description}
                  onChange={(e) => handleChange(source.id, 'description', e.target.value)}
                  placeholder="Add details about this income"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomeSourcesForm;
