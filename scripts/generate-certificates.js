// Node.js script for bulk certificate generation
import fs from "fs"
import path from "path"

// Certificate template
const certificateTemplate = {
  courseName: "Advanced React Development",
  issuerName: "TechEd Academy",
  duration: "40 hours",
  skills: ["React", "TypeScript", "Next.js", "State Management"],
  instructorName: "Dr. Sarah Johnson",
}

// Sample recipients data
const recipients = [
  { name: "Alice Johnson", email: "alice@example.com", grade: "95%" },
  { name: "Bob Smith", email: "bob@example.com", grade: "88%" },
  { name: "Carol Davis", email: "carol@example.com", grade: "92%" },
  { name: "David Wilson", email: "david@example.com", grade: "87%" },
  { name: "Eva Brown", email: "eva@example.com", grade: "94%" },
]

function generateCertificateId() {
  return `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
}

function generateVerificationCode() {
  return `VER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

function createCertificate(recipient, template) {
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

// Generate certificates
const certificates = recipients.map((recipient) => createCertificate(recipient, certificateTemplate))

// Save to JSON file
const outputPath = path.join(process.cwd(), "generated-certificates.json")
fs.writeFileSync(outputPath, JSON.stringify(certificates, null, 2))

// Generate CSV with URLs
const csvContent = [
  "Name,Email,Certificate ID,Certificate URL,Verification Code",
  ...certificates.map(
    (cert) =>
      `${cert.recipientName},${cert.recipientEmail},${cert.id},https://yoursite.com/certificate/${cert.id},${cert.verificationCode}`,
  ),
].join("\n")

const csvPath = path.join(process.cwd(), "certificate-urls.csv")
fs.writeFileSync(csvPath, csvContent)

console.log(`✅ Generated ${certificates.length} certificates`)
console.log(`📄 Saved certificate data to: ${outputPath}`)
console.log(`📊 Saved CSV with URLs to: ${csvPath}`)

// Display sample URLs
console.log("\n🔗 Sample Certificate URLs:")
certificates.slice(0, 3).forEach((cert) => {
  console.log(`   ${cert.recipientName}: /certificate/${cert.id}`)
})
