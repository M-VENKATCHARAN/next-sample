"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Upload, Download, Users, Award, Settings } from "lucide-react"
import { generateCertificatesFromTemplate } from "@/lib/certificates"
import type { CertificateTemplate } from "@/types/certificate"

export default function AdminPage() {
  const [template, setTemplate] = useState<CertificateTemplate>({
    id: "",
    name: "",
    courseName: "",
    issuerName: "",
    duration: "",
    skills: [],
    instructorName: "",
  })

  const [recipients, setRecipients] = useState("")
  const [skillInput, setSkillInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCount, setGeneratedCount] = useState(0)

  const addSkill = () => {
    if (skillInput.trim() && !template.skills.includes(skillInput.trim())) {
      setTemplate((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }))
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setTemplate((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleBulkGeneration = async () => {
    if (!template.courseName || !recipients.trim()) return

    setIsGenerating(true)

    try {
      // Parse recipients (expecting format: "Name,Email,Grade" per line)
      const recipientList = recipients
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const [name, email, grade] = line.split(",").map((item) => item.trim())
          return { name, email, grade: grade || "Pass" }
        })

      const certificates = await generateCertificatesFromTemplate(template, recipientList)
      setGeneratedCount(certificates.length)

      // In a real app, you might want to send emails or save to database here
      console.log("Generated certificates:", certificates)
    } catch (error) {
      console.error("Error generating certificates:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Administration</h1>
          <p className="text-gray-600">Create and manage certificates in bulk</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Template Configuration */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Certificate Template
                </CardTitle>
                <CardDescription>Configure the template for bulk certificate generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={template.name}
                    onChange={(e) => setTemplate((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., React Development Course"
                  />
                </div>

                <div>
                  <Label htmlFor="course-name">Course Name</Label>
                  <Input
                    id="course-name"
                    value={template.courseName}
                    onChange={(e) => setTemplate((prev) => ({ ...prev, courseName: e.target.value }))}
                    placeholder="e.g., Advanced React Development"
                  />
                </div>

                <div>
                  <Label htmlFor="issuer-name">Issuer Name</Label>
                  <Input
                    id="issuer-name"
                    value={template.issuerName}
                    onChange={(e) => setTemplate((prev) => ({ ...prev, issuerName: e.target.value }))}
                    placeholder="e.g., TechEd Academy"
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Course Duration</Label>
                  <Input
                    id="duration"
                    value={template.duration}
                    onChange={(e) => setTemplate((prev) => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 40 hours"
                  />
                </div>

                <div>
                  <Label htmlFor="instructor">Instructor Name (Optional)</Label>
                  <Input
                    id="instructor"
                    value={template.instructorName || ""}
                    onChange={(e) => setTemplate((prev) => ({ ...prev, instructorName: e.target.value }))}
                    placeholder="e.g., Dr. Sarah Johnson"
                  />
                </div>

                <div>
                  <Label>Skills</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    />
                    <Button onClick={addSkill} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {template.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Generation */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Bulk Certificate Generation
                </CardTitle>
                <CardDescription>Generate certificates for multiple recipients</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recipients">Recipients</Label>
                  <Textarea
                    id="recipients"
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    placeholder="Enter recipients in format:&#10;John Smith,john@example.com,95%&#10;Jane Doe,jane@example.com,88%&#10;Bob Johnson,bob@example.com,92%"
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: Name,Email,Grade (one per line)</p>
                </div>

                <Button
                  onClick={handleBulkGeneration}
                  disabled={isGenerating || !template.courseName || !recipients.trim()}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4 mr-2" />
                      Generate Certificates
                    </>
                  )}
                </Button>

                {generatedCount > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                      ✅ Successfully generated {generatedCount} certificates!
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      Recipients can access their certificates at: /certificate/[ID]
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Recipients from CSV
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export Certificate URLs
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Send Email Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sample URLs */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Sample Certificate URLs</CardTitle>
            <CardDescription>Test the generated certificate pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-mono text-sm">/certificate/CERT-2024-001</span>
                <Button size="sm" variant="outline" asChild>
                  <a href="/certificate/CERT-2024-001" target="_blank" rel="noreferrer">
                    View
                  </a>
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-mono text-sm">/certificate/CERT-2024-002</span>
                <Button size="sm" variant="outline" asChild>
                  <a href="/certificate/CERT-2024-002" target="_blank" rel="noreferrer">
                    View
                  </a>
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-mono text-sm">/certificate/CERT-2024-003</span>
                <Button size="sm" variant="outline" asChild>
                  <a href="/certificate/CERT-2024-003" target="_blank" rel="noreferrer">
                    View
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
