

interface GhanaCardProps {
    fullName: string;
    ghanaCardNumber: string;
    dateOfBirth: string;
    sex?: string;
    nationality?: string;
    region?: string;
    district?: string;
    address?: string;
    issueDate?: string;
    expiryDate?: string;
    photoUrl?: string;
}

export default function GhanaCard({
    fullName,
    ghanaCardNumber,
    dateOfBirth,
    sex = 'M',
    nationality = 'Ghanaian',
    region = 'Greater Accra',
    district = 'Accra Metropolis',
    address,
    issueDate = '2020-01-01',
    expiryDate = '2030-01-01',
    photoUrl
}: GhanaCardProps) {
    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Ghana Card */}
            <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                {/* Ghana Flag Header */}
                <div className="h-3 flex">
                    <div className="flex-1 bg-[#CE1126]" /> {/* Red */}
                    <div className="flex-1 bg-[#FCD116]" /> {/* Gold */}
                    <div className="flex-1 bg-[#006B3F]" /> {/* Green */}
                </div>

                {/* Card Content */}
                <div className="p-6">
                    {/* Header */}
                    <div className="text-center mb-4">
                        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Republic of Ghana
                        </h2>
                        <p className="text-xs text-gray-600">National Identification Card</p>
                    </div>

                    {/* Main Content */}
                    <div className="flex gap-6">
                        {/* Photo */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-40 bg-gray-200 rounded border-2 border-gray-300 overflow-hidden">
                                {photoUrl ? (
                                    <img
                                        src={photoUrl}
                                        alt="ID Photo"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-3 text-sm">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Personal ID Number</p>
                                <p className="font-bold text-gray-900 font-mono">{ghanaCardNumber}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Full Name</p>
                                <p className="font-bold text-gray-900 uppercase">{fullName}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Date of Birth</p>
                                    <p className="font-semibold text-gray-900">{new Date(dateOfBirth).toLocaleDateString('en-GB')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Sex</p>
                                    <p className="font-semibold text-gray-900">{sex}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Nationality</p>
                                    <p className="font-semibold text-gray-900">{nationality}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Region</p>
                                    <p className="font-semibold text-gray-900">{region}</p>
                                </div>
                            </div>

                            {district && (
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">District</p>
                                    <p className="font-semibold text-gray-900">{district}</p>
                                </div>
                            )}

                            {address && (
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Residential Address</p>
                                    <p className="font-semibold text-gray-900 text-xs">{address}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Issue Date</p>
                                    <p className="font-semibold text-gray-900 text-xs">{new Date(issueDate).toLocaleDateString('en-GB')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Valid Until</p>
                                    <p className="font-semibold text-gray-900 text-xs">{new Date(expiryDate).toLocaleDateString('en-GB')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                        This card remains the property of the Government of Ghana
                    </p>
                </div>
            </div>
        </div>
    );
}
