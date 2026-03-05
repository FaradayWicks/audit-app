'use client'

import { useRef, useState, DragEvent, ChangeEvent } from 'react'

interface DropZoneProps {
  file: File | null
  onChange: (file: File | null) => void
  disabled?: boolean
}

export default function DropZone({ file, onChange, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function validateAndSet(selected: File) {
    if (selected.type !== 'application/pdf') {
      setError('Only PDF files are accepted.')
      onChange(null)
      return
    }
    setError(null)
    onChange(selected)
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    const dropped = e.dataTransfer.files[0]
    if (dropped) validateAndSet(dropped)
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) validateAndSet(selected)
  }

  function handleRemove() {
    onChange(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10
          transition-colors cursor-pointer select-none
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${file ? 'border-green-400 bg-green-50' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />

        {file ? (
          <>
            <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-medium text-green-700 truncate max-w-xs">{file.name}</p>
              <p className="text-xs text-green-600 mt-0.5">
                {(file.size / 1024 / 1024).toFixed(2)} MB — PDF ready to upload
              </p>
            </div>
          </>
        ) : (
          <>
            <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                Drag & drop your PDF here
              </p>
              <p className="text-xs text-gray-500 mt-0.5">or click to browse</p>
            </div>
            <span className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs text-gray-500 shadow-sm">
              PDF only
            </span>
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      {file && !disabled && (
        <button
          type="button"
          onClick={handleRemove}
          className="text-xs text-gray-500 hover:text-red-500 underline underline-offset-2 transition-colors"
        >
          Remove file
        </button>
      )}
    </div>
  )
}
