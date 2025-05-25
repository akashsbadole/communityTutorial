import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Mail, 
  Calendar, 
  User, 
  MessageSquare,
  Tag,
  Clock
} from "lucide-react"
import fs from "fs"
import path from "path"

// This would normally come from the database, but we'll read from JSON as fallback
async function getContacts() {
  try {
    const contactsPath = path.join(process.cwd(), "data", "contacts.json")
    if (fs.existsSync(contactsPath)) {
      const contactsData = fs.readFileSync(contactsPath, "utf8")
      const contacts = JSON.parse(contactsData)
      return contacts.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    }
  } catch (error) {
    console.error("Error reading contacts:", error)
  }
  return []
}

function getCategoryColor(category: string) {
  switch (category) {
    case "general":
      return "bg-blue-100 text-blue-800"
    case "technical":
      return "bg-red-100 text-red-800"
    case "billing":
      return "bg-green-100 text-green-800"
    case "course":
      return "bg-purple-100 text-purple-800"
    case "partnership":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "new":
      return "bg-yellow-100 text-yellow-800"
    case "in-progress":
      return "bg-blue-100 text-blue-800"
    case "resolved":
      return "bg-green-100 text-green-800"
    case "closed":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default async function AdminContactsPage() {
  const contacts = await getContacts()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Submissions</h1>
            <p className="text-gray-600">
              Manage and respond to contact form submissions
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {contacts.length} total submissions
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Last updated: {new Date().toLocaleString()}
              </span>
            </div>
          </div>

          {/* Contacts List */}
          {contacts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No contact submissions yet
                </h3>
                <p className="text-gray-600">
                  Contact form submissions will appear here when users submit the form.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {contacts.map((contact: any) => (
                <Card key={contact.id} className="bg-white">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg">
                            {contact.subject || "No Subject"}
                          </CardTitle>
                          <Badge className={getCategoryColor(contact.category)}>
                            {contact.category}
                          </Badge>
                          <Badge className={getStatusColor(contact.status)}>
                            {contact.status}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {contact.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {contact.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(contact.submittedAt).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        ID: {contact.id}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Message:</h4>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {contact.message}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        Submitted: {new Date(contact.submittedAt).toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                        <Button variant="outline" size="sm">
                          Mark as Resolved
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          {contacts.length > 0 && (
            <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {contacts.filter((c: any) => c.status === "new").length}
                    </div>
                    <div className="text-sm text-gray-600">New</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {contacts.filter((c: any) => c.status === "in-progress").length}
                    </div>
                    <div className="text-sm text-gray-600">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {contacts.filter((c: any) => c.status === "resolved").length}
                    </div>
                    <div className="text-sm text-gray-600">Resolved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {contacts.length}
                    </div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
