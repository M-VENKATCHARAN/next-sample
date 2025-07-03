import type { Certificate, CertificateTemplate } from "@/types/certificate"

function generateCertificateId() {
  return `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
}

function generateVerificationCode() {
  return `VER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

function createCertificate(
  recipient: { name: string; email: string; grade: string },
  template: CertificateTemplate,
): Certificate {
  const now = new Date()
  const completionDate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) // 5 days ago

  return {
    id: generateCertificateId(),
    recipientName: recipient.name,
    recipientEmail: recipient.email,
    courseName: template.courseName,
    issuerName: template.issuerName,
    issueDate: now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    completionDate: completionDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    duration: template.duration,
    grade: recipient.grade,
    skills: template.skills,
    instructorName: template.instructorName,
    verificationCode: generateVerificationCode(),
    isVerified: true,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }
}

export async function generateCertificatesFromTemplate(
  template: CertificateTemplate,
  recipients: { name: string; email: string; grade: string }[],
): Promise<Certificate[]> {
  return recipients.map((recipient) => createCertificate(recipient, template))
}
