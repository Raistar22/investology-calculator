
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { FileText, Upload, FilePlus, Check, Calendar, DownloadCloud, FileCheck } from 'lucide-react';

const ITRFiling = () => {
  const [activeTab, setActiveTab] = useState('information');
  const [formData, setFormData] = useState({
    name: '',
    pan: '',
    aadhaar: '',
    dob: '',
    assessmentYear: '2023-24',
    incomeSource: 'salary',
    grossIncome: '',
    taxDeducted: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('ITR information saved successfully!');
    setActiveTab('documents');
  };

  const handleUpload = () => {
    toast.success('Documents uploaded successfully!');
    setActiveTab('review');
  };

  const handleFileITR = () => {
    toast.success('Your ITR has been filed successfully!');
  };

  const validateForm = () => {
    return formData.name && formData.pan && formData.aadhaar && formData.dob && 
           formData.grossIncome && formData.taxDeducted;
  };

  return (
    <div className="container mx-auto py-16 px-4 md:px-6 pt-24 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Income Tax Return Filing</h1>
          <p className="text-muted-foreground mt-2">
            File your ITR hassle-free with TaxSmart's guided process
          </p>
        </div>

        <Card className="border-2 border-primary/10">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-2">
              <FileText className="text-primary h-5 w-5" />
              ITR Filing Wizard
            </CardTitle>
            <CardDescription>
              Complete the following steps to file your income tax return
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="information" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                      1
                    </div>
                    Basic Information
                  </div>
                </TabsTrigger>
                <TabsTrigger value="documents" disabled={!validateForm()} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                      2
                    </div>
                    Upload Documents
                  </div>
                </TabsTrigger>
                <TabsTrigger value="review" disabled={activeTab !== 'review'} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                      3
                    </div>
                    Review & File
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="information" className="space-y-4 mt-2">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name (as per PAN)</Label>
                      <Input 
                        id="name" 
                        placeholder="Enter your full name" 
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pan">PAN Number</Label>
                      <Input 
                        id="pan" 
                        placeholder="e.g., ABCDE1234F" 
                        value={formData.pan}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar">Aadhaar Number</Label>
                      <Input 
                        id="aadhaar" 
                        placeholder="e.g., 1234 5678 9012" 
                        value={formData.aadhaar}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input 
                        id="dob" 
                        type="date" 
                        value={formData.dob}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assessmentYear">Assessment Year</Label>
                      <Select 
                        value={formData.assessmentYear} 
                        onValueChange={(value) => handleSelectChange('assessmentYear', value)}
                      >
                        <SelectTrigger id="assessmentYear">
                          <SelectValue placeholder="Select assessment year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023-24">2023-24</SelectItem>
                          <SelectItem value="2022-23">2022-23</SelectItem>
                          <SelectItem value="2021-22">2021-22</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="incomeSource">Primary Source of Income</Label>
                      <Select 
                        value={formData.incomeSource} 
                        onValueChange={(value) => handleSelectChange('incomeSource', value)}
                      >
                        <SelectTrigger id="incomeSource">
                          <SelectValue placeholder="Select income source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="salary">Salary</SelectItem>
                          <SelectItem value="business">Business/Profession</SelectItem>
                          <SelectItem value="capital_gains">Capital Gains</SelectItem>
                          <SelectItem value="other">Other Sources</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grossIncome">Gross Total Income (₹)</Label>
                      <Input 
                        id="grossIncome" 
                        type="number" 
                        placeholder="e.g., 1200000" 
                        value={formData.grossIncome}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxDeducted">TDS Amount (₹)</Label>
                      <Input 
                        id="taxDeducted" 
                        type="number" 
                        placeholder="e.g., 120000" 
                        value={formData.taxDeducted}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <Button type="submit" className="flex items-center gap-2">
                      Save and Continue <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4 mt-2">
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-medium">Required Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-background">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Form 16</h4>
                          <p className="text-sm text-muted-foreground">Salary certificate from employer</p>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Upload className="h-4 w-4" /> Upload
                        </Button>
                      </CardContent>
                    </Card>
                    <Card className="bg-background">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Investment Proofs</h4>
                          <p className="text-sm text-muted-foreground">80C, 80D, and other deductions</p>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Upload className="h-4 w-4" /> Upload
                        </Button>
                      </CardContent>
                    </Card>
                    <Card className="bg-background">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Bank Statements</h4>
                          <p className="text-sm text-muted-foreground">Last financial year statements</p>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Upload className="h-4 w-4" /> Upload
                        </Button>
                      </CardContent>
                    </Card>
                    <Card className="bg-background">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <FilePlus className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Other Documents</h4>
                          <p className="text-sm text-muted-foreground">Additional supporting documents</p>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Upload className="h-4 w-4" /> Upload
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button onClick={handleUpload} className="flex items-center gap-2">
                    Continue to Review <Check className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="review" className="space-y-6 mt-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Information</CardTitle>
                    <CardDescription>Please verify all details before filing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p>{formData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">PAN Number</p>
                        <p>{formData.pan}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Aadhaar Number</p>
                        <p>{formData.aadhaar}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                        <p>{formData.dob}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Assessment Year</p>
                        <p>{formData.assessmentYear}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Income Source</p>
                        <p>{formData.incomeSource === 'salary' ? 'Salary' : 
                           formData.incomeSource === 'business' ? 'Business/Profession' :
                           formData.incomeSource === 'capital_gains' ? 'Capital Gains' : 'Other Sources'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Gross Income</p>
                        <p>₹{formData.grossIncome}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">TDS</p>
                        <p>₹{formData.taxDeducted}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="font-medium">Uploaded Documents</p>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-green-500" /> Form 16
                        </li>
                        <li className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-green-500" /> Investment Proofs
                        </li>
                        <li className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-green-500" /> Bank Statements
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <div className="bg-muted/30 p-4 rounded-lg w-full">
                      <div className="flex justify-between mb-2">
                        <p className="font-medium">Total Tax Liability</p>
                        <p className="font-medium">₹{parseInt(formData.grossIncome || '0') * 0.1}</p>
                      </div>
                      <div className="flex justify-between mb-2">
                        <p className="font-medium">TDS Deducted</p>
                        <p className="font-medium">₹{formData.taxDeducted}</p>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <p>{parseInt(formData.taxDeducted || '0') > parseInt(formData.grossIncome || '0') * 0.1 ? 'Refund Amount' : 'Remaining Tax Payable'}</p>
                        <p>₹{Math.abs(parseInt(formData.taxDeducted || '0') - parseInt(formData.grossIncome || '0') * 0.1)}</p>
                      </div>
                    </div>
                    <Button onClick={handleFileITR} className="w-full flex items-center justify-center gap-2">
                      <DownloadCloud className="h-4 w-4" /> File ITR Now
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ITRFiling;
