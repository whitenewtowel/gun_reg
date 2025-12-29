import { useState } from 'react'
import { Check, ChevronLeft, X, Info } from 'lucide-react'
import { IMAGES } from '../assets/images'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const dealerSchema = z.object({
  // Step 0: Company Details
  companyName: z.string().min(1, 'Company Name is required'),
  tin: z.string().min(1, 'TIN is required'),
  location: z.string().min(1, 'Location is required'),
  directorGhanaCard: z.string().regex(/^GHA-\d{9}-\d$/, 'Invalid Ghana Card format (e.g., GHA-123456789-0)'),

  // Step 1: Document Verification
  businessCertificate: z.any().refine((file) => file instanceof File, 'Business Certificate is required'),
  permitDocument: z.any().refine((file) => file instanceof File, 'Permit Document is required'),

  // Step 2: Police Licensing Verification
  is18Plus: z.boolean().refine(val => val === true, 'Must be at least 18 years old'),
  isIdMatch: z.boolean().refine(val => val === true, 'ID details must match'),
  noCriminalRecord: z.boolean().refine(val => val === true, 'Must confirm no criminal record'),
  noPendingCases: z.boolean().refine(val => val === true, 'Must confirm no pending cases'),
  noDismissal: z.boolean().refine(val => val === true, 'Must confirm no dismissal history'),

  // Step 3: Operations
  operationType: z.enum(['import', 'sell']),
  totalFee: z.string().optional(),
  importFees: z.string().optional(),
  supportingDocument: z.any().optional(),
  weaponFee: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.operationType === 'import') {
    if (!data.totalFee) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Total Fee is required',
        path: ['totalFee'],
      })
    }
    if (!data.supportingDocument || !(data.supportingDocument instanceof File)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Supporting Document is required',
        path: ['supportingDocument'],
      })
    }
  }
})

type DealerFormValues = z.infer<typeof dealerSchema>

const steps = [
  {
    title: 'Dealer Registration',
    subtitle: 'Company details',
    fields: ['companyName', 'tin', 'location', 'directorGhanaCard'],
  },
  {
    title: 'Document Verification',
    subtitle: 'Upload relevant documents',
    fields: ['businessCertificate', 'permitDocument'],
  },
  {
    title: 'Police Licensing Verification',
    subtitle: 'Confirm your eligibility',
    fields: ['is18Plus', 'isIdMatch', 'noCriminalRecord', 'noPendingCases', 'noDismissal'],
  },
  {
    title: 'Operations',
    subtitle: 'Select between import/ sale operations',
    fields: ['operationType', 'totalFee', 'importFees', 'supportingDocument', 'weaponFee'],
  },
]

const FileUploadField = ({
  label,
  name,
  setValue,
  watch,
  errors
}: {
  label: string
  name: keyof DealerFormValues
  setValue: any
  watch: any
  errors: any
}) => {
  const file = watch(name)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue(name, file, { shouldValidate: true })
    }
  }

  const removeFile = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setValue(name, null, { shouldValidate: true })
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <Info size={14} className="text-gray-400" />
      </div>
      <div className={`relative flex flex-col items-center justify-center rounded-xl border border-dashed p-8 transition-colors ${errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
        }`}>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={handleFileChange}
        />

        {file ? (
          <div className="flex items-center gap-2 z-10">
            <span className="text-sm font-medium text-gray-900">{file.name}</span>
            <button onClick={removeFile} className="p-1 hover:bg-gray-200 rounded-full">
              <X size={16} className="text-gray-500" />
            </button>
          </div>
        ) : (
          <>
            <p className="text-center text-sm mb-1">
              <span className="font-semibold text-[#9D7000]">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 800x400px)</p>
          </>
        )}
      </div>
      {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]?.message as string}</p>}
    </div>
  )
}

export default function DealerRegistration() {
  const [currentStep, setCurrentStep] = useState(0)
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const navigate = useNavigate()

  const {
    register,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DealerFormValues>({
    resolver: zodResolver(dealerSchema),
    mode: 'onChange',
    defaultValues: {
      operationType: 'import',
      totalFee: '',
      importFees: 'GHS 509.00',
      weaponFee: 'GHS 2,100',
    },
  })

  const operationType = watch('operationType')

  const nextStep = async () => {
    const fields = steps[currentStep].fields
    const isStepValid = await trigger(fields as any)

    if (isStepValid) {
      if (currentStep === steps.length - 1) {
        // Submit logic
        setSubmissionStatus('submitting')
        await new Promise(resolve => setTimeout(resolve, 2000))
        setSubmissionStatus('success')
        toast.success('Application Submitted!')
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
      }
    }
  }

  const handleDashboard = () => {
    navigate('/')
  }

  const handleLogout = () => {
    navigate('/')
  }

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  return (
    <div className="flex min-h-screen w-full relative">
      {/* Submission Processing Overlay */}
      {submissionStatus === 'submitting' && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md"
        >
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-8 border-t-[#9D7000] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-4 rounded-full bg-[#9D7000]/10 animate-ping"></div>
            <div className="absolute inset-6 rounded-full bg-[#9D7000]/20 animate-pulse"></div>
            <img src={IMAGES.LOGO} alt="Logo" className="absolute inset-0 m-auto w-12 h-12 object-contain opacity-50" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Submitting Application</h2>
          <p className="text-gray-600 text-center max-w-xs px-6">
            Please wait while we process your registration details.
          </p>
        </div>
      )}

      {/* Success Overlay */}
      {submissionStatus === 'success' && (
        <div
          role="alertdialog"
          aria-labelledby="success-title"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-white to-emerald-50"
        >
          <div className="relative mb-10">
            <svg width="140" height="140" viewBox="0 0 140 140" className="drop-shadow-2xl">
              <motion.circle
                cx="70" cy="70" r="62"
                fill="none"
                stroke="#9D7000"
                strokeWidth="8"
                strokeLinecap="round"
                className="stroke-current text-amber-500"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="1"
                initial={{ strokeDashoffset: 1 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              <motion.polyline
                points="38,70 60,92 102,48"
                fill="none"
                stroke="#9D7000"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-600"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="1"
                initial={{ strokeDashoffset: 1 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              />
            </svg>

            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-3 h-3 bg-amber-400 rounded-full animate-ping origin-center"
                style={{
                  transform: `rotate(${i * 45}deg) translateX(80px)`,
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </div>

          <h2 id="success-title" className="text-4xl font-black text-[#2C1402] mb-3">
            Application Submitted!
          </h2>
          <p className="text-gray-600 text-center max-w-md px-8 leading-relaxed">
            Your dealer registration application has been received. We will review your documents and get back to you shortly.
          </p>

          <div className="flex gap-4 mt-10">
            <button
              onClick={handleDashboard}
              className="px-10 py-4 bg-[#9D7000] text-white font-bold rounded-2xl shadow-lg hover:bg-[#856000] hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-amber-300"
            >
              Go to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-10 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transform hover:-translate-y-1 transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <div className="hidden w-1/3 flex-col bg-[#2C1402] p-12 text-white lg:flex">
        <div className="mb-16">
          <div className="flex items-center gap-3">
            <img src={IMAGES.LOGO} alt="Ministry of Interior" className="h-24 w-auto" />
          </div>
        </div>

        <div className="relative flex flex-col gap-12">
          {/* Vertical Line */}
          <div className="absolute left-[15px] top-2 h-[calc(100%-40px)] w-[2px] bg-[#FCEDDC]">
            <div
              className="absolute top-0 w-full bg-[#FCEDDC] transition-all duration-500"
              style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex items-start gap-6">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#FCEDDC] transition-all duration-300 ${index <= currentStep
                    ? 'border-yellow-500 bg-[#FCEDDC] text-[#2C1402]'
                    : 'border-white/40 bg-[#2C1402]'
                  }`}
              >
                {index < currentStep ? (
                  <Check size={16} strokeWidth={3} />
                ) : (
                  <div className={`h-2.5 w-2.5 rounded-full ${index === currentStep ? 'bg-yellow-500' : 'bg-white'}`} />
                )}
              </div>
              <div className={`flex flex-col transition-opacity duration-300 ${index <= currentStep ? 'opacity-100' : 'opacity-50'}`}>
                <span className="font-normal">{step.title}</span>
                <span className="text-sm text-white/60">{step.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex w-full flex-col items-center bg-white p-4 sm:p-6 lg:p-8 lg:w-2/3 min-h-screen">
        <div className={`flex h-full w-full max-w-lg lg:max-w-3xl ${currentStep >= 1 ? 'max-w-full lg:max-w-3xl' : 'max-w-lg'} flex-col`}>

          <div className="my-auto w-full">
            <div className="mb-12 flex flex-col items-center text-center">
              <img src={IMAGES.LOGIN2} alt="Coat of Arms" className="mb-6 h-18 w-auto" />
              <h1 className="mb-2 text-3xl font-medium text-gray-900">{steps[currentStep].title}</h1>
              <p className="text-sm font-normal text-gray-500">
                {currentStep === 0 && 'Verify company details'}
                {currentStep === 1 && 'Fill with correct information pertaining to you only.'}
                {currentStep === 2 && 'Confirm your eligibility and proceed'}
                {currentStep === 3 && 'Select between import/ sale operations'}
              </p>
            </div>

            {/* Step 0: Company Details */}
            {currentStep === 0 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                      type="text"
                      placeholder="Enter your company name"
                      {...register('companyName')}
                      className={`w-full rounded-lg border bg-white px-4 py-3 outline-none ${errors.companyName ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.companyName && <p className="mt-1 text-sm text-red-500">{errors.companyName.message}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">TIN</label>
                    <input
                      type="text"
                      placeholder="Enter your TIN"
                      {...register('tin')}
                      className={`w-full rounded-lg border bg-white px-4 py-3 outline-none ${errors.tin ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.tin && <p className="mt-1 text-sm text-red-500">{errors.tin.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      placeholder="Enter your company location"
                      {...register('location')}
                      className={`w-full rounded-lg border bg-white px-4 py-3 outline-none ${errors.location ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Ghana Card Number of Director</label>
                    <input
                      type="text"
                      placeholder="GHA-123456789-0"
                      {...register('directorGhanaCard')}
                      className={`w-full rounded-lg border bg-white px-4 py-3 outline-none ${errors.directorGhanaCard ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.directorGhanaCard && <p className="mt-1 text-sm text-red-500">{errors.directorGhanaCard.message}</p>}
                  </div>
                </div>

                <button
                  onClick={nextStep}
                  className="w-full rounded-lg bg-[#9D7000] py-4 font-semibold text-white transition-colors hover:bg-[#856000]"
                >
                  Proceed
                </button>
              </div>
            )}

            {/* Step 1: Document Verification */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <FileUploadField
                  label="Business Registration Certificate"
                  name="businessCertificate"
                  setValue={setValue}
                  watch={watch}
                  errors={errors}
                />

                <FileUploadField
                  label="Permit Document"
                  name="permitDocument"
                  setValue={setValue}
                  watch={watch}
                  errors={errors}
                />

                <button
                  onClick={nextStep}
                  className="w-full rounded-lg bg-[#9D7000] py-4 font-semibold text-white transition-colors hover:bg-[#856000]"
                >
                  Proceed
                </button>
              </div>
            )}

            {/* Step 2: Police Licensing Verification */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Eligibility</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('is18Plus')}
                        className="h-5 w-5 rounded border-gray-300 text-[#9D7000] focus:ring-[#9D7000]"
                      />
                      <span className="text-sm text-gray-600">You're at least 18 years old</span>
                    </label>
                    {errors.is18Plus && <p className="text-xs text-red-500 ml-8">{errors.is18Plus.message}</p>}

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('isIdMatch')}
                        className="h-5 w-5 rounded border-gray-300 text-[#9D7000] focus:ring-[#9D7000]"
                      />
                      <span className="text-sm text-gray-600">Your ID and personal details match what you put on the application</span>
                    </label>
                    {errors.isIdMatch && <p className="text-xs text-red-500 ml-8">{errors.isIdMatch.message}</p>}
                  </div>
                </div>

                <div className="h-px bg-gray-200" />

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Legal / Discipline</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('noCriminalRecord')}
                        className="h-5 w-5 rounded border-gray-300 text-[#9D7000] focus:ring-[#9D7000]"
                      />
                      <span className="text-sm text-gray-600">I have once been convicted of a criminal offence</span>
                    </label>
                    {errors.noCriminalRecord && <p className="text-xs text-red-500 ml-8">{errors.noCriminalRecord.message}</p>}

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('noPendingCases')}
                        className="h-5 w-5 rounded border-gray-300 text-[#9D7000] focus:ring-[#9D7000]"
                      />
                      <span className="text-sm text-gray-600">I have pending court cases against me</span>
                    </label>
                    {errors.noPendingCases && <p className="text-xs text-red-500 ml-8">{errors.noPendingCases.message}</p>}

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('noDismissal')}
                        className="h-5 w-5 rounded border-gray-300 text-[#9D7000] focus:ring-[#9D7000]"
                      />
                      <span className="text-sm text-gray-600">I have once been dismissed from employment or school for misconduct</span>
                    </label>
                    {errors.noDismissal && <p className="text-xs text-red-500 ml-8">{errors.noDismissal.message}</p>}
                  </div>
                </div>

                <button
                  onClick={nextStep}
                  className="w-full rounded-lg bg-[#9D7000] py-4 font-semibold text-white transition-colors hover:bg-[#856000]"
                >
                  Proceed
                </button>
              </div>
            )}

            {/* Step 3: Operations */}
            {currentStep === 3 && (
              <div className="space-y-8">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setValue('operationType', 'import')}
                    className={`flex-1 pb-4 text-sm font-medium transition-colors ${operationType === 'import'
                        ? 'border-b-2 border-[#9D7000] text-[#9D7000]'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Register Imported Firearms
                  </button>
                  <button
                    onClick={() => setValue('operationType', 'sell')}
                    className={`flex-1 pb-4 text-sm font-medium transition-colors ${operationType === 'sell'
                        ? 'border-b-2 border-[#9D7000] text-[#9D7000]'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Sell / Transfer Firearm
                  </button>
                </div>

                {operationType === 'import' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Total Fee</label>
                        <input
                          type="text"
                          placeholder="Enter total fee"
                          {...register('totalFee')}
                          className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#9D7000] focus:ring-1 focus:ring-[#9D7000]"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Import Fees</label>
                        <input
                          type="text"
                          {...register('importFees')}
                          readOnly
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 outline-none text-gray-500"
                        />
                      </div>
                    </div>

                    <FileUploadField
                      label="Supporting Document"
                      name="supportingDocument"
                      setValue={setValue}
                      watch={watch}
                      errors={errors}
                    />

                    <div className="rounded-lg bg-[#FFF9EB] p-4 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Weapon Fee</span>
                      <span className="font-semibold text-gray-900">GHS 2,100</span>
                    </div>
                  </div>
                )}

                {operationType === 'sell' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-center text-gray-500 py-8">Sell / Transfer functionality coming soon.</p>
                  </div>
                )}

                <button
                  onClick={nextStep}
                  className="w-full rounded-lg bg-[#9D7000] py-4 font-semibold text-white transition-colors hover:bg-[#856000]"
                >
                  Proceed
                </button>
              </div>
            )}
          </div>

          {/* Pagination Dots & Navigation */}
          <div className="mt-12 flex items-center justify-center gap-4 pb-8">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <ChevronLeft size={16} />
              </button>
            )}

            <div className="flex gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={async () => {
                    if (index < currentStep) {
                      setCurrentStep(index)
                    } else if (index > currentStep) {
                      const fields = steps[currentStep].fields
                      const isStepValid = await trigger(fields as any)
                      if (isStepValid && index === currentStep + 1) {
                        setCurrentStep(index)
                      }
                    }
                  }}
                  disabled={index > currentStep + 1}
                  className={`h-1.5 w-12 rounded-full transition-colors ${index === currentStep ? 'bg-[#9D7000]' : 'bg-gray-200'
                    } ${index < currentStep ? 'cursor-pointer hover:bg-[#9D7000]/70' : ''} ${index === currentStep + 1 ? 'cursor-pointer hover:bg-gray-300' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
