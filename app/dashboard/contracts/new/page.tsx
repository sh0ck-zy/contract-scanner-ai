"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  Loader2, 
  Upload, 
  AlertCircle, 
  Shield, 
  Check, 
  CheckCircle, 
  Info, 
  AlertTriangle,
  Users,
  FileCheck,
  Eye,
  Scale
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function AnalyzeContractPage() {
  // Current state and hooks
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [contractText, setContractText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState("paste")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeProgress, setAnalyzeProgress] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)
  const [freelancerType, setFreelancerType] = useState("writer")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Character limits - 100KB max for free tier
  const FREE_TIER_CHAR_LIMIT = 100000
  const isExceedingLimit = characterCount > FREE_TIER_CHAR_LIMIT
  const charPercentage = Math.min(100, (characterCount / FREE_TIER_CHAR_LIMIT) * 100)

  // Format number consistently
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        })
        return
      }
      // Check file type
      if (selectedFile.type !== "application/pdf" && selectedFile.type !== "text/plain") {
        toast({
          title: "Unsupported File Format",
          description: "Please upload a PDF or text file",
          variant: "destructive",
        })
        return
      }
      setFile(selectedFile)
      
      // Show success toast for better feedback
      toast({
        title: "File Selected",
        description: `${selectedFile.name} is ready for analysis`,
      })
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setContractText(text)
    setCharacterCount(text.length)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isClient) return // Don't proceed if we're not on the client side

    if (activeTab === "paste" && !contractText.trim()) {
      toast({
        title: "Empty Contract",
        description: "Please enter your contract text",
        variant: "destructive",
      })
      return
    }

    if (activeTab === "upload" && !file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    if (activeTab === "paste" && isExceedingLimit) {
      toast({
        title: "Character Limit Exceeded",
        description: `Free tier contracts are limited to ${formatNumber(FREE_TIER_CHAR_LIMIT)} characters. Please upgrade or shorten your contract.`,
        variant: "destructive",
      })
      return
    }

    try {
      setIsAnalyzing(true)
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setAnalyzeProgress((prev) => {
          const increment = Math.random() * 15
          const newValue = Math.min(prev + increment, 90)
          return newValue
        })
      }, 1000)

      let textToAnalyze = contractText

      // If file is uploaded, read its contents
      if (activeTab === "upload" && file) {
        if (file.type === "application/pdf") {
          // For PDF files, send to the server for processing
          const formData = new FormData()
          formData.append("file", file)
          formData.append("title", title || "Untitled Contract")
          formData.append("freelancerType", freelancerType)

          try {
            const response = await fetch("/api/contracts/analyze/pdf", {
              method: "POST",
              body: formData,
            })

            clearInterval(progressInterval)
            setAnalyzeProgress(100)

            if (!response.ok) {
              let errorMessage = "Failed to analyze PDF"
              try {
                const errorData = await response.json()
                errorMessage = errorData.error || errorData.message || errorMessage
              } catch (e) {
                console.error("Error parsing error response:", e)
                errorMessage = `Server error: ${response.status} ${response.statusText}`
              }
              throw new Error(errorMessage)
            }

            const data = await response.json()
            toast({
              title: "Analysis Complete",
              description: "Your contract has been analyzed successfully.",
            })
            
            setTimeout(() => {
              router.push(`/dashboard/contracts/${data.id}`)
            }, 500)
          } catch (error: any) {
            console.error("PDF analysis error:", error)
            toast({
              title: "Analysis Failed",
              description: error.message || "Something went wrong. Please try again.",
              variant: "destructive",
            })
            setIsAnalyzing(false)
            setAnalyzeProgress(0)
          }
          
          return
        } else {
          // For text-based files
          textToAnalyze = await readFileAsText(file)
          setCharacterCount(textToAnalyze.length)
          
          if (textToAnalyze.length > FREE_TIER_CHAR_LIMIT) {
            clearInterval(progressInterval)
            setIsAnalyzing(false)
            setAnalyzeProgress(0)
            
            toast({
              title: "File Too Large",
              description: `Your file exceeds the ${formatNumber(FREE_TIER_CHAR_LIMIT)} character limit for free tier users.`,
              variant: "destructive",
            })
            return
          }
        }
      }

      // Call the API to analyze the contract
      const response = await fetch("/api/contracts/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title || "Untitled Contract",
          contractText: textToAnalyze,
          freelancerType: freelancerType
        }),
      })

      clearInterval(progressInterval)
      setAnalyzeProgress(100)

      // Log the raw response text to see what's happening
      const responseText = await response.text()
      console.log("Raw API Response:", responseText)
      
      if (!response.ok) {
        throw new Error(responseText || "Failed to analyze contract")
      }

      // Parse the response text manually since we already consumed it
      const data = responseText ? JSON.parse(responseText) : {}

      // Redirect to the contract details page with slight delay to show 100% progress
      toast({
        title: "Analysis Complete",
        description: "Your contract has been analyzed successfully.",
      })
      
      setTimeout(() => {
        router.push(`/dashboard/contracts/${data.id}`)
      }, 500)
    } catch (error: any) {
      console.error("Error analyzing contract:", error)
      setAnalyzeProgress(0)
      toast({
        title: "Analysis Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Helper function to read file contents
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => resolve(event.target?.result as string)
      reader.onerror = (error) => reject(error)
      reader.readAsText(file)
    })
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10 text-center">
        <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
          <Shield className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Analyze Your Contract</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our AI will review your contract for potential issues and suggest improvements to protect your freelance business.
        </p>
      </div>

      {/* Freelancer Type Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2 text-center">I'm a freelance:</label>
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-muted p-1 rounded-lg">
            <button 
              type="button"
              className={`px-4 py-2 rounded-md text-sm font-medium ${freelancerType === 'writer' ? 'bg-primary text-white' : 'text-foreground'}`}
              onClick={() => setFreelancerType('writer')}
            >
              Writer
            </button>
            <button 
              type="button"
              className={`px-4 py-2 rounded-md text-sm font-medium ${freelancerType === 'designer' ? 'bg-primary text-white' : 'text-foreground'}`}
              onClick={() => setFreelancerType('designer')}
            >
              Designer
            </button>
            <button 
              type="button"
              className={`px-4 py-2 rounded-md text-sm font-medium ${freelancerType === 'developer' ? 'bg-primary text-white' : 'text-foreground'}`}
              onClick={() => setFreelancerType('developer')}
            >
              Developer
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-7">
        <Card className="md:col-span-5 border-slate-200 shadow-md">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
              <CardDescription>
                Paste your contract or upload a document file for AI-powered analysis.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Contract Title
                </Label>
                <Input
                  id="title"
                  placeholder="E.g., Web Development Agreement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                  disabled={isAnalyzing}
                />
              </div>

              <Tabs defaultValue="paste" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="paste" className="flex items-center gap-2" disabled={isAnalyzing}>
                    <FileText className="h-4 w-4" /> Paste Text
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex items-center gap-2" disabled={isAnalyzing}>
                    <Upload className="h-4 w-4" /> Upload File
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="paste">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="contract-text" className="text-sm font-medium">
                        Contract Text
                      </Label>
                      <span className={`text-xs ${isExceedingLimit ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                        {formatNumber(characterCount)} / {formatNumber(FREE_TIER_CHAR_LIMIT)} characters
                      </span>
                    </div>
                    <Textarea
                      id="contract-text"
                      placeholder="Paste your contract text here..."
                      value={contractText}
                      onChange={handleTextChange}
                      className="min-h-[300px] font-mono text-sm"
                      disabled={isAnalyzing}
                    />
                    
                    {/* Character count progress bar */}
                    <div className="w-full">
                      <Progress 
                        value={charPercentage} 
                        className="h-2" 
                        indicatorClassName={
                          charPercentage > 90 ? "bg-red-500" : 
                          charPercentage > 75 ? "bg-amber-500" : 
                          "bg-emerald-500"
                        }
                      />
                    </div>
                    
                    {isExceedingLimit && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Character Limit Exceeded</AlertTitle>
                        <AlertDescription>
                          Free tier users are limited to {formatNumber(FREE_TIER_CHAR_LIMIT)} characters. 
                          <a href="/pricing" className="underline ml-1">Upgrade your plan</a> or shorten your contract.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="upload">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Upload your contract</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Drag and drop or click to browse your files
                    </p>
                    
                    <Input
                      id="contract-file"
                      type="file"
                      className="hidden"
                      accept=".pdf,.txt"
                      onChange={handleFileChange}
                      disabled={isAnalyzing}
                    />
                    <Button 
                      variant="outline" 
                      type="button" 
                      disabled={isAnalyzing}
                      onClick={() => {
                        const fileInput = document.getElementById('contract-file');
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                    >
                      Browse Files
                    </Button>
                    
                    <div className="mt-4 text-xs text-muted-foreground">
                      Supports PDF or text files up to 10MB
                    </div>
                    
                    {file && (
                      <div className="mt-6 bg-muted p-3 rounded-md flex items-center">
                        <FileCheck className="h-5 w-5 text-success mr-2" />
                        <div className="text-sm font-medium truncate">{file.name}</div>
                        <div className="ml-auto text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(0)} KB
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              {isAnalyzing && (
                <div className="w-full space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Analyzing contract...</span>
                    <span className="font-medium">{Math.round(analyzeProgress)}%</span>
                  </div>
                  <Progress value={analyzeProgress} className="h-2" />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 py-6 text-lg shadow-md"
                disabled={isAnalyzing || (activeTab === "paste" && (!contractText || isExceedingLimit))}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Contract...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Analyze Contract
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">What We Look For</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FreelancerChecklist type={freelancerType} />
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Trusted By Freelancers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex -space-x-2 mb-3">
                <Avatar className="border-2 border-background">
                  <AvatarFallback>JP</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-background">
                  <AvatarFallback>ST</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-background">
                  <AvatarFallback>RK</AvatarFallback>
                </Avatar>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "ContractScan flagged an unlimited revisions clause that would have cost me 20+ hours of unpaid work."
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                — Alex K., Freelance Designer
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function FreelancerChecklist({ type }: { type: string }) {
  // Different checklists based on freelancer type
  const checklist = {
    writer: [
      "Copyright ownership and usage rights",
      "Payment terms and schedules",
      "Revision limitations and scope",
      "Deadlines and delivery expectations",
      "Content approval process"
    ],
    designer: [
      "Usage rights and portfolio inclusion",
      "Unlimited revision clauses",
      "Ownership of source files",
      "Client approval process",
      "Cancellation terms and kill fees"
    ],
    developer: [
      "Scope creep protection",
      "Payment milestones and deposits",
      "IP and code ownership",
      "Maintenance and support terms",
      "Acceptance testing criteria"
    ]
  }

  // Get the appropriate checklist or default to writer
  const items = checklist[type as keyof typeof checklist] || checklist.writer
  
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
          <span className="text-sm">{item}</span>
        </li>
      ))}
    </ul>
  )
}

