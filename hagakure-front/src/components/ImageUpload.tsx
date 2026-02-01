import { useState, useRef } from 'react'
import './ImageUpload.css'

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string>(value || '')
  const [fileName, setFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image')
      return
    }

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 800
        
        let width = img.width
        let height = img.height
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = height * (MAX_WIDTH / width)
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = width * (MAX_HEIGHT / height)
            height = MAX_HEIGHT
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        ctx?.drawImage(img, 0, 0, width, height)
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)
        
        const sizeKB = (compressedBase64.length / 1024).toFixed(2)
        console.log(`Image "${file.name}" compressée: ${sizeKB} KB (originale: ${(file.size / 1024).toFixed(2)} KB)`)
        
        setPreview(compressedBase64)
        onChange(compressedBase64)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    setPreview('')
    setFileName('')
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="image-upload-container">
      <label className="image-upload-label">{label}</label>
      
      {preview ? (
        <div className="image-preview-container">
          <img src={preview} alt="Preview" className="image-preview" />
          {fileName && (
            <div className="image-filename">
              📁 {fileName}
            </div>
          )}
          <div className="image-preview-actions">
            <button 
              type="button" 
              className="btn-change-image"
              onClick={handleClick}
            >
              Changer l'image
            </button>
            <button 
              type="button" 
              className="btn-remove-image"
              onClick={handleRemove}
            >
              Supprimer
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`image-dropzone ${isDragging ? 'dragging' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="dropzone-icon">📁</div>
          <p className="dropzone-text">
            Glissez-déposez une image ici
          </p>
          <p className="dropzone-subtext">
            ou cliquez pour sélectionner
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default ImageUpload

