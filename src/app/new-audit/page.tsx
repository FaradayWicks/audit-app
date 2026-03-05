import AuditForm from '@/components/AuditForm'

export const metadata = {
  title: 'New Audit — Audit App',
  description: 'Create a new structural audit project',
}

export default function NewAuditPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-md">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">New Audit Project</h1>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the project details and upload a PDF document to get started.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
          <AuditForm />
        </div>
      </div>
    </main>
  )
}
