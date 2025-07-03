export interface Certificate {
  id: string
  recipientName: string
  recipientEmail: string
  courseName: string
  issuerName: string
  issueDate: string
  completionDate: string
  duration: string
  grade: string
  skills: string[]
  instructorName?: string
  verificationCode: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface CertificateTemplate {
  id: string
  name: string
  courseName: string
  issuerName: string
  duration: string
  skills: string[]
  instructorName?: string
}
