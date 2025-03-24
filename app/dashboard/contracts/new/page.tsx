"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Loader2, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AnalyzeContractPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [contractText, setContractText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState("paste")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (activeTab === "paste" && !contractText.trim()) {
      toast({
        title: "Error",
        description: "Please enter your contract text",
        variant: "destructive",
      })
      return
    }

    if (activeTab === "upload" && !file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAnalyzing(true)

      let textToAnalyze = contractText

      // If file is uploaded, read its contents
      if (activeTab === "upload" && file) {
        textToAnalyze = await readFileAsText(file)
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
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || "Failed to analyze contract")
      }

      const data = await response.json()

      // Redirect to the contract details page
      router.push(`/dashboard/contracts/${data.id}`)

      toast({
        title: "Analysis Complete",
        description: "Your contract has been analyzed successfully.",
      })
    } catch (error: any) {
      console.error("Error analyzing contract:", error)
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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Analyze New Contract</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload Contract</CardTitle>
          <CardDescription>
            Paste your contract text or upload a document to analyze for potential issues.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Contract Title
                </Label>
                <Input
                  id="title"
                  placeholder="E.g., Client Project Agreement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-neutral-500">Give your contract a name for easy reference later.</p>
              </div>

              <Tabs defaultValue="paste" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="paste" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Paste Text
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Upload File
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="paste" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contract-text" className="text-sm font-medium">
                      Contract Text
                    </Label>
                    <Textarea
                      id="contract-text"
                      placeholder="Paste your contract here..."
                      value={contractText}
                      onChange={(e) => setContractText(e.target.value)}
                      className="min-h-[300px] font-mono text-sm"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
                    <Upload className="h-10 w-10 text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload Contract Document</h3>
                    <p className="text-sm text-neutral-500 mb-4">Drag and drop your file here, or click to browse.</p>
                    <input
                      type="file"
                      id="contract-file"
                      accept=".doc,.docx,.pdf,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      onClick={() => document.getElementById("contract-file")?.click()}
                      variant="outline"
                      className="mx-auto"
                    >
                      Browse Files
                    </Button>

                    {file && (
                      <div className="mt-4 bg-neutral-50 p-3 rounded-md flex items-center">
                        <FileText className="h-5 w-5 text-primary mr-2" />
                        <span className="text-sm font-medium truncate">{file.name}</span>
                      </div>
                    )}

                    <p className="text-xs text-neutral-500 mt-4">Supported file types: .PDF, .DOCX, .DOC, .TXT</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t p-6">
            <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isAnalyzing}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isAnalyzing || (activeTab === "paste" && !contractText.trim()) || (activeTab === "upload" && !file)
              }
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>Analyze Contract</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

