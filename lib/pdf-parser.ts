import type { BiomarkerData } from "./data-processor"
import { PDFTextExtractor } from "./pdf-text-extractor"

export interface ParsedBiomarker {
  name: string
  value: number
  unit: string
  date: string
}

export class PDFBiomarkerParser {
  private static biomarkerPatterns = {
    totalCholesterol: [
      /total\s+cholesterol[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
      /cholesterol\s+total[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
      /cholesterol[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
    ],
    hdlCholesterol: [
      /hdl\s+cholesterol[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
      /hdl[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
      /high\s+density\s+lipoprotein[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
    ],
    ldlCholesterol: [
      /ldl\s+cholesterol[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
      /ldl[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
      /low\s+density\s+lipoprotein[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
    ],
    triglycerides: [
      /triglycerides[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
      /trig[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
      /triglyceride[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
    ],
    creatinine: [
      /serum\s+creatinine[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
      /creatinine[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
      /s\.creatinine[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
    ],
    vitaminD: [
      /vitamin\s+d[:\s]+(\d+\.?\d*)\s*ng\/ml/i,
      /25.*hydroxy.*vitamin\s+d[:\s]+(\d+\.?\d*)\s*ng\/ml/i,
      /25.*oh.*vitamin\s+d[:\s]+(\d+\.?\d*)\s*ng\/ml/i,
      /vit.*d[:\s]+(\d+\.?\d*)\s*ng\/ml/i,
    ],
    vitaminB12: [
      /vitamin\s+b12[:\s]+(\d+\.?\d*)\s*pg\/ml/i,
      /b12[:\s]+(\d+\.?\d*)\s*pg\/ml/i,
      /cobalamin[:\s]+(\d+\.?\d*)\s*pg\/ml/i,
      /vitamin\s+b-12[:\s]+(\d+\.?\d*)\s*pg\/ml/i,
    ],
    hba1c: [
      /hba1c[:\s]+(\d+\.?\d*)\s*%/i,
      /hb\s*a1c[:\s]+(\d+\.?\d*)\s*%/i,
      /glycosylated\s+hemoglobin[:\s]+(\d+\.?\d*)\s*%/i,
      /hemoglobin\s+a1c[:\s]+(\d+\.?\d*)\s*%/i,
    ],
  }

  private static datePatterns = [
    /date[:\s]+(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /date[:\s]+(\d{1,2}-\d{1,2}-\d{4})/i,
    /report\s+date[:\s]+(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /collected[:\s]+(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
    /(\d{4}-\d{1,2}-\d{1,2})/,
  ]

  static async parsePDFFile(file: File): Promise<BiomarkerData | null> {
    try {
      console.log("Starting PDF parsing for:", file.name)

      // Extract text from PDF
      const text = await PDFTextExtractor.extractTextFromPDF(file)
      console.log("Extracted text length:", text.length)

      // Parse the extracted text
      const biomarkerData = await this.parsePDFText(text)

      if (biomarkerData) {
        console.log("Successfully parsed biomarker data:", biomarkerData)
      }

      return biomarkerData
    } catch (error) {
      console.error("Error parsing PDF file:", error)
      throw error
    }
  }

  static async parsePDFText(text: string): Promise<BiomarkerData | null> {
    try {
      const extractedData: Partial<BiomarkerData> = {}

      // Extract date
      const dateMatch = this.extractDate(text)
      extractedData.date = dateMatch || new Date().toISOString().split("T")[0]

      // Extract biomarkers
      let extractedCount = 0
      for (const [biomarker, patterns] of Object.entries(this.biomarkerPatterns)) {
        const value = this.extractBiomarkerValue(text, patterns)
        if (value !== null) {
          extractedData[biomarker as keyof BiomarkerData] = value
          extractedCount++
          console.log(`Extracted ${biomarker}:`, value)
        }
      }

      // Validate that we have at least some biomarkers
      if (extractedCount === 0) {
        throw new Error("No biomarkers found in the uploaded document")
      }

      // Fill in missing values with reasonable defaults to ensure complete data
      const completeData: BiomarkerData = {
        date: extractedData.date!,
        totalCholesterol: extractedData.totalCholesterol || 0,
        hdlCholesterol: extractedData.hdlCholesterol || 0,
        ldlCholesterol: extractedData.ldlCholesterol || 0,
        triglycerides: extractedData.triglycerides || 0,
        creatinine: extractedData.creatinine || 0,
        vitaminD: extractedData.vitaminD || 0,
        vitaminB12: extractedData.vitaminB12 || 0,
        hba1c: extractedData.hba1c || 0,
      }

      return completeData
    } catch (error) {
      console.error("Error parsing PDF text:", error)
      return null
    }
  }

  private static extractDate(text: string): string | null {
    for (const pattern of this.datePatterns) {
      const match = text.match(pattern)
      if (match) {
        try {
          const dateStr = match[1] || match[0]
          const date = new Date(dateStr)
          if (!isNaN(date.getTime())) {
            return date.toISOString().split("T")[0]
          }
        } catch (e) {
          continue
        }
      }
    }
    return null
  }

  private static extractBiomarkerValue(text: string, patterns: RegExp[]): number | null {
    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match && match[1]) {
        const value = Number.parseFloat(match[1])
        if (!isNaN(value) && value > 0) {
          return value
        }
      }
    }
    return null
  }
}
