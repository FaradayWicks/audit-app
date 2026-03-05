'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import DropZone from '@/components/DropZone'
import type { ProjectFormData, ProjectType, StructuralSystem } from '@/types/project'

const PROJECT_TYPES: ProjectType[] = ['Residential', 'Commercial', 'Industrial']
const STRUCTURAL_SYSTEMS: StructuralSystem[] = ['Timber', 'Steel', 'Concrete']

const INITIAL_FORM: ProjectFormData = {
  projectName: '',
  projectType: '',
  structuralSystem: '',
  file: null,
}

type SubmitState = 'idle' | 'uploading' | 'saving' | 'success' | 'error'

export default function AuditForm() {
  const [form, setForm] = useState<ProjectFormData>(INITIAL_FORM)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isLoading = submitState === 'uploading' || submitState === 'saving'

  function handleField(field: keyof ProjectFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)

    if (!form.projectName.trim()) {
      setErrorMessage('Project name is required.')
      return
    }
    if (!form.projectType) {
      setErrorMessage('Please select a project type.')
      return
    }
    if (!form.structuralSystem) {
      setErrorMessage('Please select a structural system.')
      return
    }
    if (!form.file) {
      setErrorMessage('Please upload a PDF file.')
      return
    }

    try {
      // Step 1: Upload PDF to Supabase Storage
      setSubmitState('uploading')
      const timestamp = Date.now()
      const safeName = form.file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `pdfs/${timestamp}_${safeName}`

      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, form.file, {
          contentType: 'application/pdf',
          upsert: false,
        })

      if (uploadError) throw new Error(`File upload failed: ${uploadError.message}`)

      // Step 2: Insert project record into the database
      setSubmitState('saving')
      const { error: insertError } = await supabase.from('projects').insert({
        project_name: form.projectName.trim(),
        project_type: form.projectType,
        structural_system: form.structuralSystem,
        file_path: filePath,
        status: 'queued',
      })

      if (insertError) throw new Error(`Database insert failed: ${insertError.message}`)

      setSubmitState('success')
      setForm(INITIAL_FORM)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setErrorMessage(message)
      setSubmitState('error')
    }
  }

  if (submitState === 'success') {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-green-800">Audit project created successfully</h2>
        <p className="mt-2 text-green-700">
          Status: <span className="font-medium">queued</span>
        </p>
        <button
          onClick={() => setSubmitState('idle')}
          className="mt-6 rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
        >
          Create another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Project Name */}
      <div className="space-y-1.5">
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
          Project Name <span className="text-red-500">*</span>
        </label>
        <input
          id="projectName"
          type="text"
          value={form.projectName}
          onChange={(e) => handleField('projectName', e.target.value)}
          placeholder="e.g. Riverside Office Complex"
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400
            shadow-sm outline-none transition
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
            disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>

      {/* Project Type */}
      <div className="space-y-1.5">
        <label htmlFor="projectType" className="block text-sm font-medium text-gray-700">
          Project Type <span className="text-red-500">*</span>
        </label>
        <select
          id="projectType"
          value={form.projectType}
          onChange={(e) => handleField('projectType', e.target.value)}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900
            shadow-sm outline-none transition appearance-none
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
            disabled:bg-gray-50 disabled:text-gray-500"
        >
          <option value="">Select project type</option>
          {PROJECT_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Structural System */}
      <div className="space-y-1.5">
        <label htmlFor="structuralSystem" className="block text-sm font-medium text-gray-700">
          Structural System <span className="text-red-500">*</span>
        </label>
        <select
          id="structuralSystem"
          value={form.structuralSystem}
          onChange={(e) => handleField('structuralSystem', e.target.value)}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900
            shadow-sm outline-none transition appearance-none
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
            disabled:bg-gray-50 disabled:text-gray-500"
        >
          <option value="">Select structural system</option>
          {STRUCTURAL_SYSTEMS.map((system) => (
            <option key={system} value={system}>{system}</option>
          ))}
        </select>
      </div>

      {/* PDF Upload */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          PDF Document <span className="text-red-500">*</span>
        </label>
        <DropZone
          file={form.file}
          onChange={(file) => setForm((prev) => ({ ...prev, file }))}
          disabled={isLoading}
        />
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="relative w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm
          transition hover:bg-blue-700 active:bg-blue-800
          disabled:cursor-not-allowed disabled:opacity-70
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {submitState === 'uploading' ? 'Uploading PDF…' : 'Saving record…'}
          </span>
        ) : (
          'Create Audit Project'
        )}
      </button>
    </form>
  )
}
