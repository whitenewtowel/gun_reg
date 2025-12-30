import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
    UserIcon,
    BuildingStorefrontIcon,
    ShieldCheckIcon,
    ChevronRightIcon,
    StarIcon
} from '@heroicons/react/24/outline';
import heroBg from '@/assets/hero-bg.png';

const UserTypeCard = ({
    type,
    selected,
    onSelect,
    onHover,
    index
}: {
    type: any,
    selected: boolean,
    onSelect: () => void,
    onHover: (id: string | null) => void,
    index: number
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="h-[22rem]"
        >
            <button
                onClick={onSelect}
                onMouseEnter={() => onHover(type.id)}
                onMouseLeave={() => onHover(null)}
                className={`
                    relative w-full h-full text-left p-1 group transition-all duration-300
                    ${selected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
                `}
            >
                {/* Tactical Border Container */}
                <div className={`
                    absolute inset-0 clip-chamfer transition-all duration-300
                    ${selected
                        ? 'bg-[#D4AF37] opacity-100'
                        : 'bg-white/5 opacity-50 group-hover:bg-[#D4AF37]/50 group-hover:opacity-100'
                    }
                `} />

                {/* Main Content Card */}
                <div className="relative h-full bg-[#0B1021] clip-chamfer p-6 flex flex-col items-start border border-white/5 group-hover:border-[#D4AF37]/30 transition-colors">
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />

                    {/* Header: Icon & Badge */}
                    <div className="flex justify-between items-start w-full mb-6 relative z-10">
                        <div className={`
                            p-3 rounded-sm border transition-all duration-300
                            ${selected
                                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                                : 'bg-white/5 border-white/10 text-gray-400 group-hover:text-[#D4AF37] group-hover:border-[#D4AF37]/50'
                            }
                        `}>
                            <type.icon className="w-8 h-8" />
                        </div>

                        {type.popular && (
                            <div className="flex items-center gap-1 bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] px-3 py-1 rounded-sm text-[10px] uppercase font-bold tracking-widest">
                                <StarIcon className="w-3 h-3" />
                                Popular
                            </div>
                        )}

                        {type.requirement && (
                            <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1 rounded-sm text-[10px] uppercase font-bold tracking-widest">
                                Requires License
                            </div>
                        )}
                    </div>

                    {/* Text Content */}
                    <div className="relative z-10 mb-8">
                        <h3 className={`
                            text-xl font-stencil mb-3 transition-colors duration-300 tracking-wide
                            ${selected ? 'text-[#D4AF37]' : 'text-white group-hover:text-[#D4AF37]'}
                        `}>
                            {type.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-technical">
                            {type.description}
                        </p>
                    </div>

                    {/* Action Footer */}
                    <div className="mt-auto w-full relative z-10">
                        <div className={`
                            flex items-center justify-between py-2 border-t transition-colors duration-300
                            ${selected ? 'border-[#D4AF37]/30' : 'border-white/10 group-hover:border-[#D4AF37]/20'}
                        `}>
                            <span className={`
                                text-xs uppercase tracking-widest font-bold transition-colors
                                ${selected ? 'text-[#D4AF37]' : 'text-gray-500 group-hover:text-[#D4AF37]'}
                            `}>
                                Initiate Protocol
                            </span>
                            <ChevronRightIcon className={`
                                w-4 h-4 transition-all duration-300
                                ${selected ? 'text-[#D4AF37] translate-x-1' : 'text-gray-600 group-hover:text-[#D4AF37] group-hover:translate-x-1'}
                            `} />
                        </div>
                    </div>
                </div>
            </button>
        </motion.div>
    );
};

export default function SelectUserTypePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const userTypes = [
        {
            id: 'individual',
            icon: UserIcon,
            title: 'New Firearm License Application',
            description: 'Apply for a personal firearm license for self-defense, hunting, or sport shooting. Includes comprehensive background checks.',
            route: '/applications/new?type=INDIVIDUAL',
            popular: true,
        },
        {
            id: 'dealer',
            icon: BuildingStorefrontIcon,
            title: 'Licensed Dealer',
            description: 'Register as an authorized firearms dealer or importer. Manage inventory, sales, and import permits commercially.',
            route: '/dealer-registration', // Updated based on task context
            requirement: true,
        },
        {
            id: 'agency',
            icon: ShieldCheckIcon,
            title: 'Security Agency',
            description: 'Corporate registration for private security firms. Manage personnel vetting and bulk firearm assignments.',
            route: '/agency/register',
        },
    ];

    return (
        <div className="min-h-screen bg-[#0B1021] text-white font-technical relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">

            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[#0B1021]" />
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                    style={{ backgroundImage: `url(${heroBg})` }}
                />
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/10 blur-[150px] rounded-full mix-blend-color-dodge" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full mix-blend-color-dodge" />
                <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-[#D4AF37]/5 blur-[100px] rounded-full mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] mix-blend-overlay" />
            </div>

            <main className="relative z-10 container mx-auto px-4 py-12 md:py-20 max-w-[95rem]">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                        <span className="px-4 text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">System Access</span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-stencil uppercase tracking-wider mb-4 text-white">
                        Access Protocol
                    </h1>

                    <p className="text-gray-400 max-w-xl mx-auto text-lg">
                        Welcome, <span className="text-white font-bold">{user?.firstName || 'User'}</span>.
                        Identify your operating profile to initialize the appropriate licensing workspace.
                    </p>

                    {user?.ghanaCardNumber && (
                        <div className="mt-4 inline-block bg-white/5 border border-white/10 rounded px-4 py-1 text-xs text-gray-500 font-mono">
                            ID: {user.ghanaCardNumber}
                        </div>
                    )}
                </motion.div>

                {/* Grid */}
                <div className="grid md:grid-cols-3 gap-6 md:gap-8 w-full">
                    {userTypes.map((type, index) => (
                        <UserTypeCard
                            key={type.id}
                            type={type}
                            index={index}
                            selected={selectedType === type.id}
                            onSelect={() => navigate(type.route)}
                            onHover={setSelectedType}
                        />
                    ))}
                </div>

                {/* Footer Action */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 text-center"
                >
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-500 hover:text-[#D4AF37] text-xs uppercase tracking-widest transition-colors border-b border-transparent hover:border-[#D4AF37]"
                    >
                        Skip Initialization &rarr;
                    </button>
                    <p className="mt-4 text-[10px] text-gray-600 font-mono">
                        SECURE CONNECTION ESTABLISHED // ENCRYPTED: AES-256
                    </p>
                </motion.div>
            </main>
        </div>
    );
}
