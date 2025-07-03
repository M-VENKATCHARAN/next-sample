"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Share2,
  Download,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  Link2,
  Shield,
  Calendar,
  User,
  Award,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { getCertificateById } from "@/lib/google-sheets"
import type { Certificate } from "@/types/certificate"

interface CertificatePageProps {
  params: {
    id: string
  }
}

export default function CertificatePage({ params }: CertificatePageProps) {
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const loadCertificate = async () => {
    try {
      setError(null)
      const cert = await getCertificateById(params.id)
      if (cert) {
        setCertificate(cert)
      } else {
        setError("Certificate not found in Google Sheets")
      }
    } catch (err) {
      setError("Failed to load certificate from Google Sheets")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadCertificate()
  }, [params.id])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadCertificate()
  }

  const handleShare = (platform: string) => {
    if (!certificate) return

    const url = `${window.location.origin}/certificate/${certificate.id}`
    const text = `I just completed ${certificate.courseName} at ${certificate.issuerName}! 🎓`

    switch (platform) {
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
        break
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank",
        )
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
        break
      case "email":
        window.open(
          `mailto:?subject=${encodeURIComponent(`Check out my certificate: ${certificate.courseName}`)}&body=${encodeURIComponent(`${text}\n\nView certificate: ${url}`)}`,
        )
        break
    }
  }

  const copyToClipboard = async () => {
    if (!certificate) return

    try {
      const url = `${window.location.origin}/certificate/${certificate.id}`
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificate from Google Sheets...</p>
        </div>
      </div>
    )
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Certificate Not Found</h2>
            <p className="text-gray-600 mb-4">
              {error || "The certificate you're looking for doesn't exist in our Google Sheets database."}
            </p>
            <div className="space-y-2">
              <Button onClick={handleRefresh} disabled={refreshing} className="w-full">
                {refreshing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh from Sheets
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full bg-transparent">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">CertShare</span>
              <Badge variant="outline" className="ml-2 text-xs">
                Powered by Google Sheets
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-transparent"
              >
                {refreshing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" />
                {certificate.isVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Certificate Display */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                    <Award className="h-8 w-8" />
                  </div>
                  <h1 className="text-3xl font-bold">Certificate of Completion</h1>
                  <p className="text-xl opacity-90">This certifies that</p>
                  <h2 className="text-4xl font-bold">{certificate.recipientName}</h2>
                  <p className="text-xl opacity-90">has successfully completed</p>
                  <h3 className="text-2xl font-semibold">{certificate.courseName}</h3>
                  <div className="flex items-center justify-center space-x-8 mt-8">
                    <div className="text-center">
                      <p className="text-sm opacity-75">Issued by</p>
                      <p className="font-semibold">{certificate.issuerName}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm opacity-75">Date</p>
                      <p className="font-semibold">{certificate.issueDate}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm opacity-75">Certificate ID</p>
                      <p className="font-semibold">{certificate.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Sharing Options */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share this certificate
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <Button
                    variant="outline"
                    onClick={() => handleShare("linkedin")}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare("twitter")}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Twitter className="h-4 w-4" />
                    <span>Twitter</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare("facebook")}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Facebook className="h-4 w-4" />
                    <span>Facebook</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare("email")}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex-1 p-2 bg-gray-50 rounded border text-sm text-gray-600">
                    {`${window.location.origin}/certificate/${certificate.id}`}
                  </div>
                  <Button
                    variant="outline"
                    onClick={copyToClipboard}
                    className="flex items-center space-x-1 bg-transparent"
                  >
                    <Link2 className="h-4 w-4" />
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Certificate Details Sidebar */}
          <div className="space-y-6">
            {/* Certificate Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Certificate Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Recipient</p>
                      <p className="text-sm text-gray-600">{certificate.recipientName}</p>
                      {certificate.recipientEmail && (
                        <p className="text-xs text-gray-500">{certificate.recipientEmail}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Completion Date</p>
                      <p className="text-sm text-gray-600">{certificate.completionDate}</p>
                    </div>
                  </div>
                  {certificate.duration && (
                    <div className="flex items-start space-x-3">
                      <Award className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Duration</p>
                        <p className="text-sm text-gray-600">{certificate.duration}</p>
                      </div>
                    </div>
                  )}
                  {certificate.grade && (
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Final Grade</p>
                        <p className="text-sm text-gray-600">{certificate.grade}</p>
                      </div>
                    </div>
                  )}
                  {certificate.instructorName && (
                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Instructor</p>
                        <p className="text-sm text-gray-600">{certificate.instructorName}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills Acquired */}
            {certificate.skills.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Skills Acquired</h3>
                  <div className="flex flex-wrap gap-2">
                    {certificate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Verification */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Verification
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Data from Google Sheets</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Real-time verification</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Issuer authenticated</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Certificate ID: {certificate.id}</p>
                  {certificate.verificationCode && (
                    <p className="text-xs text-gray-500">Verification: {certificate.verificationCode}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Download Options */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Download</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
