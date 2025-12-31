
import { useState } from 'react'
import { Check, ChevronDown, Upload, Loader2, ChevronLeft, X } from 'lucide-react'
import { IMAGES } from '../assets/images'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import * as z from 'zod'
import { motion } from 'framer-motion'


const renewalSchema = z.object({
  // Step 0
  serialNumber: z.string().min(1, 'Serial Number is required'),

  // Step 1
  ghanaCardNumber: z.string().min(1, 'Ghana Card Number is required'),
  name: z.string().min(1, 'Name is required'),
  expiryDate: z.string().min(1, 'Expiry Date is required'),

  // Step 2
  policeReport: z.any().optional(), // File validation can be complex, keeping simple for now
  medicalClearance: z.any().optional(),
  address: z.string().min(1, 'Address is required'),
  region: z.string().min(1, 'Region is required'),

  // Step 3
  paymentOption: z.string().min(1, 'Payment Option is required'),
  amount: z.string().min(1, 'Amount is required'),

  // Mobile Money
  mobileNetwork: z.string().optional(),
  mobileNumber: z.string().optional(),

  // Card
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  cardHolderName: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentOption === 'Mobile Money') {
    if (!data.mobileNetwork) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Network is required',
        path: ['mobileNetwork'],
      })
    }
    if (!data.mobileNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Phone number is required',
        path: ['mobileNumber'],
      })
    }
  }

  if (data.paymentOption === 'Card') {
    if (!data.cardNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Card number is required',
        path: ['cardNumber'],
      })
    }
    if (!data.cardExpiry) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Expiry date is required',
        path: ['cardExpiry'],
      })
    }
    if (!data.cardCvv) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CVV is required',
        path: ['cardCvv'],
      })
    }
    if (!data.cardHolderName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Card holder name is required',
        path: ['cardHolderName'],
      })
    }
  }
})

type RenewalFormValues = z.infer<typeof renewalSchema>

const steps = [
  {
    title: 'New Licence Application',
    subtitle: 'Confirm weapon details',
    fields: ['serialNumber'],
  },
  {
    title: 'Identity Verification',
    subtitle: 'Confirm personal details',
    fields: ['ghanaCardNumber', 'name', 'expiryDate'],
  },
  {
    title: 'Document Verification',
    subtitle: 'Upload relevant documents',
    fields: ['policeReport', 'medicalClearance', 'address', 'region'],
  },
  {
    title: 'Payment',
    subtitle: 'Make payment to complete',
    fields: ['paymentOption', 'amount', 'mobileNetwork', 'mobileNumber', 'cardNumber', 'cardExpiry', 'cardCvv', 'cardHolderName'],
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
  name: keyof RenewalFormValues
  register: any
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
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
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
            <div className="mb-3 rounded-full bg-gray-100 p-2 text-gray-400">
              <Upload size={20} />
            </div>
            <p className="text-center text-sm">
              <span className="font-bold text-[#9D7000]">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 800x400px)</p>
          </>
        )}
      </div>
      {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]?.message as string}</p>}
    </div>
  )
}

export default function Renewal() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showGunDetails, setShowGunDetails] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const navigate = useNavigate()

  const {
    register,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RenewalFormValues>({
    resolver: zodResolver(renewalSchema),
    mode: 'onChange',
    defaultValues: {
      amount: 'GHS 2,300', // Default value
    },
  })

  const serialNumber = watch('serialNumber')
  const paymentOption = watch('paymentOption')

  const nextStep = async () => {
    const fields = steps[currentStep].fields
    const isStepValid = await trigger(fields as any)

    if (isStepValid) {
      if (currentStep === steps.length - 1) {
        handlePayment()
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
      }
    }
  }

  const handlePayment = async () => {
    setPaymentStatus('processing')
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    setPaymentStatus('success')
  }

  const handleLogout = () => {
    // Add logout logic here if needed
    navigate('/')
  }

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const handleVerify = async () => {
    const isValid = await trigger('serialNumber')
    if (!isValid) return

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setShowGunDetails(true)
  }

  const handleStep0Action = () => {
    if (!showGunDetails) {
      handleVerify()
    } else {
      nextStep()
    }
  }

  return (
    <div className="flex min-h-screen w-full relative">
      {/* Payment Processing Overlay */}
      {/* Payment Processing Overlay – Pure Tailwind */}
      {paymentStatus === 'processing' && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md"
        >
          <div className="relative w-32 h-32 mb-8">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-8 border-t-[#9D7000] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>

            {/* Inner pulsing circle */}
            <div className="absolute inset-4 rounded-full bg-[#9D7000]/10 animate-ping"></div>
            <div className="absolute inset-6 rounded-full bg-[#9D7000]/20 animate-pulse"></div>

            {/* Lock icon in center */}
            <svg className="absolute inset-0 m-auto w-12 h-12 text-[#9D7000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
          <p className="text-gray-600 text-center max-w-xs px-6">
            We’re securely renewing your license. This won’t take long.
          </p>
          <p className="text-sm text-gray-400 mt-4 animate-pulse">Do not close or refresh this page</p>
        </div>
      )}

      {/* Payment Success Overlay – Pure Tailwind + Inline SVG Morph */}
      {paymentStatus === 'success' && (
        <div
          role="alertdialog"
          aria-labelledby="success-title"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-white to-emerald-50"
        >
          {/* Animated Checkmark SVG (morphs from circle → check) */}
          <div className="relative mb-10">
            <svg width="140" height="140" viewBox="0 0 140 140" className="drop-shadow-2xl">
              {/* Circle → Check stroke animation */}
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

            {/* Success burst particles (pure CSS/Tailwind) */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                // @ts-ignore – Tailwind supports arbitrary values
                className={`animate-ping absolute top-1/2 left-1/2 w-3 h-3 bg-amber-400 rounded-full origin-center`}
                style={{
                  transform: `rotate(${i * 45}deg) translateX(80px)`,
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </div>

          <h2 id="success-title" className="text-4xl font-black text-[#2C1402] mb-3">
            Payment Successful!
          </h2>
          <p className="text-gray-600 text-center max-w-md px-8 leading-relaxed">
            Your license has been renewed. A confirmation email is on its way.
          </p>

          <div className="flex gap-4 mt-10">
            <button
              // onClick={handleViewLicense}
              className="px-10 py-4 bg-[#9D7000] text-white font-bold rounded-2xl shadow-lg hover:bg-[#856000] hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-amber-300"
            >
              View License
            </button>
            <button
              onClick={handleLogout}
              className="px-10 py-4 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transform hover:-translate-y-1 transition-all duration-200"
            >
              Sign Out
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-8 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            256-bit encryption • PCI DSS compliant
          </p>
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
              className="absolute top-0 w-full bg-yellow-500 transition-all duration-500"
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
                <span className="font-bold">{step.title}</span>
                <span className="text-sm text-white/60">{step.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex w-full flex-col items-center bg-white p-4 sm:p-6 lg:p-8 lg:w-2/3 min-h-screen ">
        <div className={`flex h-full w-full max-w-lg ${currentStep === 1 ? 'max-w-full lg:max-w-3xl' : currentStep === 2 ? 'max-w-full lg:max-w-3xl' : 'max-w-lg'}  flex-col`}>

          <div className="my-auto w-full">
            <div className="mb-12 flex flex-col items-center text-center">
              <img src={IMAGES.LOGIN2} alt="Coat of Arms" className="mb-6 h-18 w-auto" />
              <h1 className="mb-2 text-3xl font-semibold text-gray-900">{steps[currentStep].title}</h1>
              <p className="text-sm font-normal text-gray-500">
                {currentStep === 0 && 'Verify your weapon licence'}
                {currentStep === 1 && 'Fill with correct information pertaining to you only.'}
                {currentStep === 2 && 'Upload relevant documents to proceed'}
                {currentStep === 3 && 'Complete payment flow to validate renewal'}
              </p>
            </div>

            {/* Step 1: Renew Licence */}
            {currentStep === 0 && (
              <div className="space-y-8">
                <div>
                  <label className="mb-2 block text-sm font-normal text-gray-700">Gun Serial Number</label>
                  <input
                    type="text"
                    placeholder="Enter your Serial Number"
                    {...register('serialNumber')}
                    className={`focus:ring-primary w-full rounded-lg border px-4 py-3 outline-none focus:border-primary focus:ring-1 ${errors.serialNumber ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.serialNumber && <p className="mt-1 text-sm text-red-500">{errors.serialNumber.message}</p>}
                </div>

                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <Loader2 className="mb-2 h-8 w-8 animate-spin text-[#9D7000]" />
                    <p className="text-sm">Fetching weapon details...</p>
                  </div>
                )}

                {!isLoading && showGunDetails && (
                  <div className="rounded-xl bg-[#FFF6DF] p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid gap-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-light">Type</span>
                        <span className="font-medium text-[#344054]">Rifle, bolt-action</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-light">Model</span>
                        <span className="font-medium text-[#344054]">Ruger American</span>
                      </div>
                      <div className="my-2 h-px bg-gray-200/50" />
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-light">Owner Name</span>
                        <span className="font-medium text-[#344054]">Samuel Levi</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-light">Previous Status</span>
                        <span className="font-medium text-[#344054]">N/A</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-light">Expiry Date</span>
                        <span className="font-medium text-[#344054]">20/01/2026</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleStep0Action}
                  disabled={!serialNumber || isLoading || !!errors.serialNumber}
                  className={`w-full rounded-lg py-4 font-semibold text-white transition-colors ${!serialNumber || isLoading || !!errors.serialNumber
                    ? 'bg-[#959595] cursor-not-allowed'
                    : 'bg-[#9D7000] hover:bg-[#856000]'
                    }`}
                >
                  {isLoading ? 'Verifying...' : showGunDetails ? 'Proceed' : 'Verify'}
                </button>
              </div>
            )}

            {/* Step 2: Identity Verification */}
            {currentStep === 1 && (
              <div className="space-y-8 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Ghana Card Number</label>
                    <input
                      type="text"
                      placeholder='GHA-034739743943'
                      {...register('ghanaCardNumber')}
                      className={`w-full rounded-lg border bg-gray-50 px-4 py-3 outline-none ${errors.ghanaCardNumber ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.ghanaCardNumber && <p className="mt-1 text-sm text-red-500">{errors.ghanaCardNumber.message}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      placeholder='Samuel Levi'
                      {...register('name')}
                      className={`w-full rounded-lg border bg-gray-50 px-4 py-3 outline-none ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="date"
                    {...register('expiryDate')}
                    className={`w-1/2 rounded-lg border bg-gray-50 px-4 py-3 outline-none ${errors.expiryDate ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {errors.expiryDate && <p className="mt-1 text-sm text-red-500">{errors.expiryDate.message}</p>}
                </div>

                <button
                  onClick={nextStep}
                  className="w-full rounded-lg bg-[#9D7000] py-4 font-bold text-white transition-colors hover:bg-[#856000]"
                >
                  Save & proceed
                </button>

                <button className="w-full text-center text-sm text-gray-500 hover:text-gray-700">
                  Save & continue later
                </button>
              </div>
            )}

            {/* Step 3: Document Verification */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <FileUploadField
                  label="Police Report"
                  name="policeReport"
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  errors={errors}
                />

                <FileUploadField
                  label="Medical Clearance"
                  name="medicalClearance"
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  errors={errors}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      placeholder="East Legon, Accra"
                      {...register('address')}
                      className={`focus:border-primary focus:ring-primary w-full rounded-lg border px-4 py-3 outline-none focus:ring-1 ${errors.address ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Region for verification</label>
                    <div className="relative">
                      <select
                        {...register('region')}
                        className={`focus:border-primary focus:ring-primary w-full appearance-none rounded-lg border bg-white px-4 py-3 outline-none focus:ring-1 ${errors.region ? 'border-red-500' : 'border-gray-200'}`}
                      >
                        <option value="">Select region</option>
                        <option value="Greater Accra">Greater Accra</option>
                        <option value="Ashanti">Ashanti</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                    {errors.region && <p className="mt-1 text-sm text-red-500">{errors.region.message}</p>}
                  </div>
                </div>

                <button
                  onClick={nextStep}
                  className="w-full rounded-lg bg-[#9D7000] py-4 font-bold text-white transition-colors hover:bg-[#856000]"
                >
                  Save & proceed
                </button>

                <button className="w-full text-center text-sm text-gray-500 hover:text-gray-700">
                  Save & continue later
                </button>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="rounded-xl bg-[#FFF8E7] p-6">
                  <div className="grid gap-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-light ">Weapon Fee</span>
                      <span className="font-bold text-[#344054]">GHS 2,100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-light">Tax</span>
                      <span className="font-bold text-[#344054]">GHS 120</span>
                    </div>
                    <div className="my-2 h-px bg-gray-200/50" />
                    <div className="flex justify-between text-lg">
                      <span className="font-medium text-gray-500 font-light">Total</span>
                      <span className="font-bold text-[#344054]">GHS 2,300</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Payment Option</label>
                  <div className="relative">
                    <select
                      {...register('paymentOption')}
                      className={`focus:border-primary focus:ring-primary w-full appearance-none rounded-lg border bg-white px-4 py-3 outline-none focus:ring-1 ${errors.paymentOption ? 'border-red-500' : 'border-gray-200'}`}
                    >
                      <option value="">Select option</option>
                      <option value="Mobile Money">Mobile Money</option>
                      <option value="Card">Card</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                  {errors.paymentOption && <p className="mt-1 text-sm text-red-500">{errors.paymentOption.message}</p>}
                </div>

                {paymentOption === 'Mobile Money' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Network</label>
                      <div className="relative">
                        <select
                          {...register('mobileNetwork')}
                          className={`focus:border-primary focus:ring-primary w-full appearance-none rounded-lg border bg-white px-4 py-3 outline-none focus:ring-1 ${errors.mobileNetwork ? 'border-red-500' : 'border-gray-200'}`}
                        >
                          <option value="">Select network</option>
                          <option value="MTN">MTN</option>
                          <option value="Vodafone">Vodafone</option>
                          <option value="AirtelTigo">AirtelTigo</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      </div>
                      {errors.mobileNetwork && <p className="mt-1 text-sm text-red-500">{errors.mobileNetwork.message}</p>}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="024XXXXXXX"
                        {...register('mobileNumber')}
                        className={`focus:border-primary focus:ring-primary w-full rounded-lg border px-4 py-3 outline-none focus:ring-1 ${errors.mobileNumber ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      {errors.mobileNumber && <p className="mt-1 text-sm text-red-500">{errors.mobileNumber.message}</p>}
                    </div>
                  </div>
                )}

                {paymentOption === 'Card' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Card Number</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        {...register('cardNumber')}
                        className={`focus:border-primary focus:ring-primary w-full rounded-lg border px-4 py-3 outline-none focus:ring-1 ${errors.cardNumber ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          {...register('cardExpiry')}
                          className={`focus:border-primary focus:ring-primary w-full rounded-lg border px-4 py-3 outline-none focus:ring-1 ${errors.cardExpiry ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {errors.cardExpiry && <p className="mt-1 text-sm text-red-500">{errors.cardExpiry.message}</p>}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          {...register('cardCvv')}
                          className={`focus:border-primary focus:ring-primary w-full rounded-lg border px-4 py-3 outline-none focus:ring-1 ${errors.cardCvv ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {errors.cardCvv && <p className="mt-1 text-sm text-red-500">{errors.cardCvv.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Card Holder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        {...register('cardHolderName')}
                        className={`focus:border-primary focus:ring-primary w-full rounded-lg border px-4 py-3 outline-none focus:ring-1 ${errors.cardHolderName ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      {errors.cardHolderName && <p className="mt-1 text-sm text-red-500">{errors.cardHolderName.message}</p>}
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="text"
                    {...register('amount')}
                    readOnly
                    className="focus:border-primary focus:ring-primary w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:ring-1"
                  />
                </div>

                <button
                  onClick={nextStep}
                  className="w-full rounded-lg bg-[#9D7000] py-4 font-bold text-white transition-colors hover:bg-[#856000]"
                >
                  Pay
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
                      // Only allow jumping forward if current step is valid
                      const fields = steps[currentStep].fields
                      const isStepValid = await trigger(fields as any)
                      if (isStepValid && index === currentStep + 1) {
                        setCurrentStep(index)
                      }
                    }
                  }}
                  disabled={index > currentStep + 1} // Can only go to next step or previous steps
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
