export type ProjectType = 'Residential' | 'Commercial' | 'Industrial'
export type StructuralSystem = 'Timber' | 'Steel' | 'Concrete'
export type ProjectStatus = 'queued' | 'processing' | 'completed'

export interface ProjectFormData {
  projectName: string
  projectType: ProjectType | ''
  structuralSystem: StructuralSystem | ''
  file: File | null
}

export interface ProjectRecord {
  id: string
  project_name: string
  project_type: ProjectType
  structural_system: StructuralSystem
  file_path: string | null
  status: ProjectStatus
  created_at: string
}
