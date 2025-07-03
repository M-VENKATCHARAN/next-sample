"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Award,
  ExternalLink,
  Search,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  Users,
  Shield,
} from "lucide-react"
import { getAllCertificates, validateSheetSetup } from "@/lib/google-sheets"
import type { Certificate } from "@/types/certificate"

export default function HomePage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sheetStatus, setSheetStatus] = useState<{
    isValid: boolean
    error?: string
    sampleData?: any[]
  } | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      // Validate sheet setup
      const validation = await validateSheetSetup()
      setSheetStatus(validation)

      // Load certificates if validation passes
      if (validation.isValid) {
        const certs = await getAllCertificates()
        setCertificates(certs)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setSheetStatus({
        isValid: false,
        error: "Failed to connect to Google Sheets",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">CertShare</h1>
          </div>
          <p className="text-xl text-gray-600 mb-4">Automated certificate hosting powered by Google Sheets</p>
          <Badge variant="outline" className="text-sm">
            <FileSpreadsheet className="h-4 w-4 mr-1" />
            Real-time data from Google Sheets
          </Badge>
        </div>

        {/* Google Sheets Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Google Sheets Integration
              </span>
              <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="bg-transparent">
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Connecting to Google Sheets...</span>
              </div>
            ) : sheetStatus?.isValid ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Successfully connected to Google Sheets</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>{certificates.length} certificates loaded</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Real-time verification</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 text-gray-600" />
                    <span>Auto-refresh every 5 minutes</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Google Sheets connection failed</span>
                </div>
                <p className="text-sm text-gray-600">{sheetStatus?.error}</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Setup Instructions:</h4>
                  <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                    <li>Create a Google Sheet with the required columns</li>
                    <li>Make the sheet publicly viewable</li>
                    <li>Get a Google Sheets API key</li>
                    <li>
                      Set environment variables: NEXT_PUBLIC_GOOGLE_SHEET_ID and NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY
                    </li>
                  </ol>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search and Certificates */}
        {sheetStatus?.isValid && (
          <>
            {/* Search */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <Label htmlFor="search" className="sr-only">
                      Search certificates
                    </Label>
                    <Input
                      id="search"
                      placeholder="Search by name, course, or certificate ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certificates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredCertificates.map((cert) => (
                <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{cert.courseName}</CardTitle>
                        <CardDescription className="mt-1">{cert.issuerName}</CardDescription>
                      </div>
                      <Badge variant={cert.isVerified ? "default" : "secondary"} className="ml-2">
                        {cert.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium text-gray-900">{cert.recipientName}</p>
                      <p className="text-sm text-gray-600">Completed: {cert.completionDate}</p>
                      {cert.grade && <p className="text-sm text-gray-600">Grade: {cert.grade}</p>}
                    </div>

                    {cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {cert.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {cert.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{cert.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <Button asChild className="w-full">
                      <Link href={`/certificate/${cert.id}`}>
                        View Certificate
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCertificates.length === 0 && !loading && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? "Try adjusting your search terms" : "No certificates available in the Google Sheet"}
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Simple certificate management with Google Sheets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Create Google Sheet</h3>
                <p className="text-sm text-gray-600">
                  Set up your certificate data in a Google Sheet with the required columns
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Auto-Generate Pages</h3>
                <p className="text-sm text-gray-600">
                  Certificate pages are automatically created from your sheet data
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Share & Verify</h3>
                <p className="text-sm text-gray-600">
                  Recipients get unique URLs to share their certificates with real-time verification
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
