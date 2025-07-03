"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, Key, Settings, ExternalLink, Copy, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function SetupPage() {
  const [copiedTemplate, setCopiedTemplate] = useState(false)

  const templateColumns = [
    "Certificate ID",
    "Recipient Name",
    "Recipient Email",
    "Course Name",
    "Issuer Name",
    "Issue Date",
    "Completion Date",
    "Duration",
    "Grade",
    "Skills",
    "Instructor Name",
    "Verification Code",
    "Is Verified",
  ]

  const sampleData = [
    "CERT-2024-001",
    "John Smith",
    "john@example.com",
    "Advanced React Development",
    "TechEd Academy",
    "January 15, 2024",
    "January 10, 2024",
    "40 hours",
    "95%",
    "React, TypeScript, Next.js, State Management",
    "Dr. Sarah Johnson",
    "VER-789123",
    "TRUE",
  ]

  const copyTemplate = async () => {
    const template = templateColumns.join("\t") + "\n" + sampleData.join("\t")
    try {
      await navigator.clipboard.writeText(template)
      setCopiedTemplate(true)
      setTimeout(() => setCopiedTemplate(false), 2000)
    } catch (err) {
      console.error("Failed to copy template")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Google Sheets Integration</h1>
          <p className="text-gray-600">Follow these steps to connect your certificate data</p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Create Google Sheet */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <FileSpreadsheet className="h-5 w-5" />
                Create Google Sheet
              </CardTitle>
              <CardDescription>Set up your certificate database in Google Sheets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Required Columns:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {templateColumns.map((column, index) => (
                    <Badge key={index} variant="outline" className="justify-center">
                      {column}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Template with Sample Data:</h4>
                  <Button variant="outline" size="sm" onClick={copyTemplate} className="bg-transparent">
                    <Copy className="h-4 w-4 mr-1" />
                    {copiedTemplate ? "Copied!" : "Copy Template"}
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Copy this template and paste it into your Google Sheet (first row = headers, second row = sample
                  data):
                </p>
                <div className="bg-white rounded border p-2 text-xs font-mono overflow-x-auto">
                  <div className="whitespace-nowrap">{templateColumns.join(" | ")}</div>
                  <div className="whitespace-nowrap text-gray-600 mt-1">{sampleData.join(" | ")}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild>
                  <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Google Sheets
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Make Sheet Public */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <Settings className="h-5 w-5" />
                Make Sheet Public
              </CardTitle>
              <CardDescription>Allow the application to read your sheet data</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  In your Google Sheet, click <strong>"Share"</strong> button (top right)
                </li>
                <li>
                  Click <strong>"Change to anyone with the link"</strong>
                </li>
                <li>
                  Set permission to <strong>"Viewer"</strong>
                </li>
                <li>
                  Click <strong>"Copy link"</strong> and save the Sheet ID from the URL
                </li>
              </ol>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>Sheet ID</strong> is the long string between <code>/spreadsheets/d/</code> and{" "}
                  <code>/edit</code> in your sheet URL
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Get API Key */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <Key className="h-5 w-5" />
                Get Google Sheets API Key
              </CardTitle>
              <CardDescription>Create an API key to access Google Sheets data</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm mb-4">
                <li>
                  Go to{" "}
                  <a
                    href="https://console.cloud.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google Cloud Console
                  </a>
                </li>
                <li>Create a new project or select existing one</li>
                <li>
                  Enable the <strong>"Google Sheets API"</strong>
                </li>
                <li>
                  Go to <strong>"Credentials"</strong> → <strong>"Create Credentials"</strong> →{" "}
                  <strong>"API Key"</strong>
                </li>
                <li>Copy your API key</li>
              </ol>
              <Button asChild variant="outline" className="bg-transparent">
                <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Google Cloud Console
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Step 4: Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">4</span>
                </div>
                <Settings className="h-5 w-5" />
                Set Environment Variables
              </CardTitle>
              <CardDescription>Configure your application with the credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Add these environment variables to your <code>.env.local</code> file:
                </p>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm">
                  <div>NEXT_PUBLIC_GOOGLE_SHEET_ID=your_sheet_id_here</div>
                  <div>NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=your_api_key_here</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Ready to test!</p>
                      <p className="text-sm text-blue-700">
                        Once configured, go back to the home page to see your certificates loaded from Google Sheets.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Button asChild>
            <a href="/">
              View Certificates
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
