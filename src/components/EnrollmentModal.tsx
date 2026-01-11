import { useState } from 'react'
import { supabase } from '../lib/supabase'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input'
import type { Country } from 'react-phone-number-input'

interface EnrollmentModalProps {
  isOpen: boolean
  onClose: () => void
  courseTitle: string
  courseId?: string
}

interface EnrollmentData {
  // Step 1: Personal Information
  name: string
  address: string
  phone: string
  email: string
  dateOfBirth: string
  nationality: string
  languages: string
  maritalStatus: string
  
  // Step 2: Church & Training Information
  churchName: string
  churchPosition: string
  pastorOverseerAwareness: string
  previousBibleSchool: string
  
  // Step 3: Documents
  eSignature: File | null
  photoCopy: File | null
}

const EnrollmentModal = ({ isOpen, onClose, courseTitle, courseId }: EnrollmentModalProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [phoneError, setPhoneError] = useState<string>('')
  const [selectedCountry, setSelectedCountry] = useState<Country>('IN')
  
  const [formData, setFormData] = useState<EnrollmentData>({
    name: '',
    address: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    nationality: '',
    languages: '',
    maritalStatus: '',
    churchName: '',
    churchPosition: '',
    pastorOverseerAwareness: '',
    previousBibleSchool: '',
    eSignature: null,
    photoCopy: null
  })

  if (!isOpen) return null

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  const validateDateOfBirth = (date: string): boolean => {
    if (!date) return false
    const birthDate = new Date(date)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    // Must be at least 16 years old and not future date
    if (age < 16 || (age === 16 && monthDiff < 0) || birthDate > today) {
      return false
    }
    
    // Not too old (reasonable limit: 100 years)
    if (age > 100) {
      return false
    }
    
    return true
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name.trim())) {
      newErrors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes'
    }
    
    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Address must be at least 10 characters'
    }
    
    // Phone validation
    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else {
      try {
        if (!isValidPhoneNumber(formData.phone)) {
          newErrors.phone = 'Please enter a valid phone number with country code'
        }
      } catch (error) {
        newErrors.phone = 'Please enter a valid phone number with country code'
      }
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g., name@example.com)'
    }
    
    // Date of Birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of Birth is required'
    } else if (!validateDateOfBirth(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Please enter a valid date of birth (must be at least 16 years old)'
    }
    
    // Nationality validation
    if (!formData.nationality.trim()) {
      newErrors.nationality = 'Nationality is required'
    } else if (formData.nationality.trim().length < 2) {
      newErrors.nationality = 'Nationality must be at least 2 characters'
    }
    
    // Languages validation
    if (!formData.languages.trim()) {
      newErrors.languages = 'Languages are required'
    } else if (formData.languages.trim().length < 2) {
      newErrors.languages = 'Please specify at least one language'
    }
    
    // Marital Status validation
    if (!formData.maritalStatus) {
      newErrors.maritalStatus = 'Marital Status is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    
    // Church name validation
    if (!formData.churchName.trim()) {
      newErrors.churchName = 'Church name is required'
    } else if (formData.churchName.trim().length < 2) {
      newErrors.churchName = 'Church name must be at least 2 characters'
    }
    
    // Church position (optional field, but if filled should be valid)
    if (formData.churchPosition && formData.churchPosition.trim().length > 0 && formData.churchPosition.trim().length < 2) {
      newErrors.churchPosition = 'Church position must be at least 2 characters if provided'
    }
    
    // Pastor/Overseer awareness validation
    if (!formData.pastorOverseerAwareness) {
      newErrors.pastorOverseerAwareness = 'Please select whether your Pastor/Overseer is aware'
    }
    
    // Previous Bible School validation
    if (!formData.previousBibleSchool) {
      newErrors.previousBibleSchool = 'Please select whether you have previous Bible School experience'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Helper function to validate file uploads (used in both validation and onChange)
  const validateFile = (file: File | null, fieldName: string): string | null => {
    if (!file) {
      return `${fieldName} is required`
    }

    // Check file type - only images allowed
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validImageTypes.includes(file.type)) {
      return `${fieldName} must be an image file (JPG, PNG, GIF, or WEBP)`
    }

    // Check file size - max 2MB
    const maxSize = 2 * 1024 * 1024 // 2MB in bytes
    if (file.size > maxSize) {
      return `${fieldName} must be less than 2MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
    }

    return null
  }

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {}
    
    // E-Signature validation
    const eSignatureError = validateFile(formData.eSignature, 'E-Signature')
    if (eSignatureError) {
      newErrors.eSignature = eSignatureError
    }
    
    // Photo copy validation
    const photoCopyError = validateFile(formData.photoCopy, 'Photo copy')
    if (photoCopyError) {
      newErrors.photoCopy = photoCopyError
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop()
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const fileName = `${timestamp}_${randomStr}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('enrollments')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      // Preserve the original error message for better debugging
      const errorMsg = uploadError.message || 'Unknown upload error'
      throw new Error(errorMsg)
    }

    if (!uploadData) {
      throw new Error('Upload succeeded but no data returned')
    }

    const { data: urlData } = supabase.storage
      .from('enrollments')
      .getPublicUrl(filePath)

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file')
    }

    return urlData.publicUrl
  }

  const handleSubmit = async () => {
    if (!validateStep3()) return

    setLoading(true)
    try {
      // Upload files
      let eSignatureUrl: string | null = null
      let photoCopyUrl: string | null = null

      try {
        if (formData.eSignature) {
          eSignatureUrl = await uploadFile(formData.eSignature, 'e-signatures')
        }
        if (formData.photoCopy) {
          photoCopyUrl = await uploadFile(formData.photoCopy, 'photo-copies')
        }
      } catch (uploadError: any) {
        console.error('File upload error:', uploadError)
        const errorMessage = uploadError.message || 'Unknown error'
        
        if (errorMessage.includes('Bucket not found') || errorMessage.includes('not found')) {
          alert(
            'Storage bucket not found. Please create the "enrollments" bucket in Supabase Storage:\n\n' +
            '1. Go to your Supabase Dashboard\n' +
            '2. Navigate to Storage\n' +
            '3. Click "New bucket"\n' +
            '4. Name it "enrollments"\n' +
            '5. Make it PUBLIC\n' +
            '6. Click "Create bucket"\n\n' +
            'After creating the bucket, please try submitting again.'
          )
        } else {
          alert(`Error uploading files: ${errorMessage}\n\nPlease try again or contact support if the issue persists.`)
        }
        setLoading(false)
        return
      }

      if (!eSignatureUrl || !photoCopyUrl) {
        alert('Error uploading files. Please try again.')
        setLoading(false)
        return
      }

      // Debug: Log everything to help diagnose the issue
      console.log('=== ENROLLMENT SUBMISSION DEBUG ===')
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
      console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
      console.log('Anon Key prefix:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 15))
      console.log('Inserting data:', {
        course_id: courseId || null,
        course_title: courseTitle,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      })
      
      // Save to database
      console.log('=== ATTEMPTING DATABASE INSERT ===')
      console.log('Files uploaded successfully:', { eSignatureUrl, photoCopyUrl })
      
      const insertPayload = {
        course_id: courseId || null,
        course_title: courseTitle,
        // Step 1
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        date_of_birth: formData.dateOfBirth,
        nationality: formData.nationality,
        languages: formData.languages,
        marital_status: formData.maritalStatus,
        // Step 2
        church_name: formData.churchName,
        church_position: formData.churchPosition || null,
        pastor_overseer_awareness: formData.pastorOverseerAwareness === 'yes',
        previous_bible_school: formData.previousBibleSchool === 'yes',
        // Step 3
        e_signature_url: eSignatureUrl,
        photo_copy_url: photoCopyUrl
      }
      
      console.log('Insert payload:', insertPayload)
      console.log('Supabase client config:', {
        url: import.meta.env.VITE_SUPABASE_URL,
        hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
      })
      
      // Make the insert request
      console.log('Making insert request to:', `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/enrollments`)
      
      const insertResponse = await supabase
        .from('enrollments')
        .insert(insertPayload)
        .select()

      console.log('=== INSERT RESPONSE ===')
      console.log('Response data:', insertResponse.data)
      console.log('Response error:', insertResponse.error)
      
      const { data: insertData, error } = insertResponse

      if (error) {
        console.error('=== INSERT FAILED ===')
        console.error('Error object:', JSON.stringify(error, null, 2))
      }

      if (error) {
        console.error('=== DATABASE INSERT ERROR ===')
        console.error('Error code:', error.code)
        console.error('Error message:', error.message)
        console.error('Error details:', error.details)
        console.error('Error hint:', error.hint)
        console.error('Full error object:', error)
        
        // Check if it's an RLS policy error
        if (error.code === '42501' || error.message?.includes('row-level security') || error.message?.includes('violates row-level security')) {
          const rlsError = new Error(
            '❌ RLS POLICY ERROR: Row Level Security is blocking the insert.\n\n' +
            'Please verify:\n' +
            '1. Run the simple_rls_fix.sql script in Supabase SQL Editor\n' +
            '2. Check that policy "anon_insert_enrollments" exists for role "anon"\n' +
            '3. Verify in Dashboard: Table Editor > enrollments > Policies tab\n' +
            '4. Make sure you\'re using VITE_SUPABASE_ANON_KEY (not service_role key)'
          )
          console.error(rlsError.message)
          throw rlsError
        }
        throw error
      }
      
      console.log('✅ Insert successful!', insertData)

      alert('Enrollment submitted successfully! We will contact you soon.')
      handleClose()
    } catch (error: any) {
      console.error('Error submitting enrollment:', error)
      
      let errorMessage = error.message || 'Failed to submit enrollment. Please try again.'
      
      // Provide helpful guidance for RLS errors
      if (errorMessage.includes('row-level security') || errorMessage.includes('RLS')) {
        errorMessage += '\n\nSolution: Run the fix_rls_policies.sql file in your Supabase SQL Editor to fix this issue.'
      }
      
      alert(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCurrentStep(1)
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      dateOfBirth: '',
      nationality: '',
      languages: '',
      maritalStatus: '',
      churchName: '',
      churchPosition: '',
      pastorOverseerAwareness: '',
      previousBibleSchool: '',
      eSignature: null,
      photoCopy: null
    })
    setErrors({})
    setPhoneError('')
    setSelectedCountry('IN')
    onClose()
  }

  const handleFileChange = (field: 'eSignature' | 'photoCopy', file: File | null) => {
    // Clear previous error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    if (!file) {
      setFormData(prev => ({ ...prev, [field]: null }))
      return
    }

    // Validate file immediately on selection
    const fieldName = field === 'eSignature' ? 'E-Signature' : 'Photo copy'
    const validationError = validateFile(file, fieldName)
    
    if (validationError) {
      setErrors(prev => ({ ...prev, [field]: validationError }))
      return
    }

    // File is valid, update form data
    setFormData(prev => ({ ...prev, [field]: file }))
  }

  const handleInputChange = (field: keyof EnrollmentData, value: string | File | null) => {
    // Special handling for phone field with length validation
    if (field === 'phone' && typeof value === 'string') {
      setPhoneError('') // Clear error on change
      
      if (!value) {
        setFormData(prev => ({ ...prev, [field]: '' }))
        if (errors[field]) {
          setErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[field]
            return newErrors
          })
        }
        return
      }

      // Try to parse phone number to get country
      let country: Country | undefined
      try {
        const phoneNumber = parsePhoneNumber(value)
        country = phoneNumber?.country as Country
        if (country) {
          setSelectedCountry(country)
        }
      } catch (e) {
        // If parsing fails, try to detect from country code
        if (value.startsWith('+91')) {
          country = 'IN'
          setSelectedCountry('IN')
        } else if (value.startsWith('+1')) {
          country = 'US'
          setSelectedCountry('US')
        } else if (value.startsWith('+44')) {
          country = 'GB'
          setSelectedCountry('GB')
        }
      }

      // Extract phone number without country code
      const phoneDigits = value.replace(/\D/g, '') // Get all digits
      let phoneNumber = phoneDigits
      
      // Remove country code based on detected country
      if (country === 'IN') {
        phoneNumber = phoneDigits.startsWith('91') ? phoneDigits.substring(2) : phoneDigits
      } else if (country === 'US' || country === 'CA') {
        phoneNumber = phoneDigits.startsWith('1') ? phoneDigits.substring(1) : phoneDigits
      } else if (country === 'GB') {
        phoneNumber = phoneDigits.startsWith('44') ? phoneDigits.substring(2) : phoneDigits
      } else {
        // For other countries, try to detect country code length
        if (phoneDigits.startsWith('91')) {
          phoneNumber = phoneDigits.substring(2)
          country = 'IN'
          setSelectedCountry('IN')
        } else if (phoneDigits.startsWith('1') && phoneDigits.length > 10) {
          phoneNumber = phoneDigits.substring(1)
        } else if (phoneDigits.startsWith('44')) {
          phoneNumber = phoneDigits.substring(2)
          country = 'GB'
          setSelectedCountry('GB')
        }
      }
      
      // Country-specific limits with error messages
      let maxLength = 15 // Default international max
      let errorMessage = ''
      
      if (country === 'IN') {
        maxLength = 10
        if (phoneNumber.length > 10) {
          errorMessage = 'Should not exceed 10 numbers'
          setPhoneError(errorMessage)
          return // Don't update the value
        }
      } else if (country === 'US' || country === 'CA') {
        maxLength = 10
        if (phoneNumber.length > 10) {
          errorMessage = 'Should not exceed 10 numbers'
          setPhoneError(errorMessage)
          return
        }
      } else if (country === 'GB') {
        maxLength = 10
        if (phoneNumber.length > 10) {
          errorMessage = 'Should not exceed 10 numbers'
          setPhoneError(errorMessage)
          return
        }
      } else {
        // For other countries, use international standard
        maxLength = 15
        if (phoneNumber.length > 15) {
          errorMessage = 'Should not exceed 15 numbers'
          setPhoneError(errorMessage)
          return
        }
      }
      
      // If within limit, update the value
      if (phoneNumber.length <= maxLength) {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
          setErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[field]
            return newErrors
          })
        }
      }
      return
    }

    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Course Enrollment</h2>
            <p className="text-sm text-gray-600 mt-1">{courseTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-6 border-b bg-gradient-to-r from-[#15133D] via-[#1a1650] to-[#15133D]">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative">
            {/* Background connector line - behind everything */}
            <div className="absolute top-7 left-1/4 right-1/4 h-1.5 bg-white/20 rounded-full z-0" />
            {/* Progress connector line - behind everything */}
            <div 
              className="absolute top-7 h-1.5 bg-gradient-to-r from-white/90 to-white/70 shadow-lg shadow-white/50 rounded-full transition-all duration-700 ease-out z-0"
              style={{ 
                left: '25%',
                width: currentStep === 1 ? '0%' : currentStep === 2 ? '25%' : '50%',
                transition: 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
            
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center flex-1 relative z-10">
                <div className="relative">
                  {/* Background circle to fully cover the connector line - sits above lines but below step circle */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0 w-16 h-16 rounded-full bg-[#15133D] z-[1]" />
                  {/* Outer glow ring for active step */}
                  {currentStep === step && (
                    <div className="absolute inset-0 rounded-full bg-white/30 blur-lg animate-pulse z-10" />
                  )}
                  {/* Step circle */}
                  <div
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 transform z-20 ${
                      currentStep === step
                        ? 'bg-white text-[#15133D] shadow-xl scale-110 ring-4 ring-white/30'
                        : currentStep > step
                        ? 'bg-white text-[#15133D] shadow-lg scale-105'
                        : 'bg-[#1a1650] text-white/60 border-2 border-white/40'
                    }`}
                  >
                    {currentStep > step ? (
                      <svg className="w-6 h-6 text-[#15133D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{step}</span>
                    )}
                  </div>
                </div>
                {/* Step label */}
                <span className={`text-sm mt-3 font-medium transition-all duration-300 text-center ${
                  currentStep >= step 
                    ? 'text-white font-semibold' 
                    : 'text-white/60'
                }`}>
                  {step === 1 && 'Personal Info'}
                  {step === 2 && 'Church & Training'}
                  {step === 3 && 'Documents'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Home / Mobile) *</label>
                  <div className={`phone-input ${errors.phone || phoneError ? 'error' : ''}`}>
                    <PhoneInput
                      international
                      defaultCountry="IN"
                      country={selectedCountry}
                      value={formData.phone}
                      onChange={(value) => handleInputChange('phone', value || '')}
                      className="w-full"
                    />
                  </div>
                  {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                  {errors.phone && !phoneError && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  <p className="text-xs text-gray-500 mt-1">Select country code and enter your phone number</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality *</label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] ${
                      errors.nationality ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Languages *</label>
                  <input
                    type="text"
                    value={formData.languages}
                    onChange={(e) => handleInputChange('languages', e.target.value)}
                    placeholder="e.g., English, Tamil, Hindi"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] ${
                      errors.languages ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.languages && <p className="text-red-500 text-sm mt-1">{errors.languages}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status *</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] ${
                      errors.maritalStatus ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select...</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                  </select>
                  {errors.maritalStatus && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Church & Training Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Church & Training Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Church Name *</label>
                <input
                  type="text"
                  value={formData.churchName}
                  onChange={(e) => handleInputChange('churchName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] ${
                    errors.churchName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.churchName && <p className="text-red-500 text-sm mt-1">{errors.churchName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Church Position (if any)</label>
                <input
                  type="text"
                  value={formData.churchPosition}
                  onChange={(e) => handleInputChange('churchPosition', e.target.value)}
                  placeholder="e.g., Pastor, Deacon, Member"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pastor/Overseer Awareness *</label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pastorOverseerAwareness"
                      value="yes"
                      checked={formData.pastorOverseerAwareness === 'yes'}
                      onChange={(e) => handleInputChange('pastorOverseerAwareness', e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pastorOverseerAwareness"
                      value="no"
                      checked={formData.pastorOverseerAwareness === 'no'}
                      onChange={(e) => handleInputChange('pastorOverseerAwareness', e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
                {errors.pastorOverseerAwareness && <p className="text-red-500 text-sm mt-1">{errors.pastorOverseerAwareness}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Previous Bible School / College / Seminary *</label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="previousBibleSchool"
                      value="yes"
                      checked={formData.previousBibleSchool === 'yes'}
                      onChange={(e) => handleInputChange('previousBibleSchool', e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="previousBibleSchool"
                      value="no"
                      checked={formData.previousBibleSchool === 'no'}
                      onChange={(e) => handleInputChange('previousBibleSchool', e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
                {errors.previousBibleSchool && <p className="text-red-500 text-sm mt-1">{errors.previousBibleSchool}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Documents & Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Documents & Confirmation</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-Signature Upload *</label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={(e) => handleFileChange('eSignature', e.target.files?.[0] || null)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] ${
                    errors.eSignature ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.eSignature && <p className="text-red-500 text-sm mt-1">{errors.eSignature}</p>}
                {formData.eSignature && !errors.eSignature && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>✓ Selected: {formData.eSignature.name}</p>
                    <p className="text-xs">Size: {(formData.eSignature.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Accepted formats: JPG, PNG, GIF, WEBP (Max 2MB)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo Copy Upload *</label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={(e) => handleFileChange('photoCopy', e.target.files?.[0] || null)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] ${
                    errors.photoCopy ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.photoCopy && <p className="text-red-500 text-sm mt-1">{errors.photoCopy}</p>}
                {formData.photoCopy && !errors.photoCopy && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>✓ Selected: {formData.photoCopy.name}</p>
                    <p className="text-xs">Size: {(formData.photoCopy.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Accepted formats: JPG, PNG, GIF, WEBP (Max 2MB)</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  Please review all your information before submitting. Once submitted, you will receive a confirmation email.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Back
          </button>
          
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-[#15133D] text-white rounded-lg font-medium hover:opacity-90 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-2 bg-[#15133D] text-white rounded-lg font-medium hover:opacity-90 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Enrollment'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EnrollmentModal

