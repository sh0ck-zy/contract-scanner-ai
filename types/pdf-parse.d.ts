declare module 'pdf-parse' {
  interface PDFData {
    text: string
    numpages: number
    info: Record<string, any>
    metadata: Record<string, any>
    version: string
  }

  interface PDFOptions {
    pagerender?: (pageData: any) => Promise<string>
    max?: number
    version?: string
  }

  function PDFParse(dataBuffer: Buffer, options?: PDFOptions): Promise<PDFData>

  export = PDFParse
} 