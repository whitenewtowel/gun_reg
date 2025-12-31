import { useState } from 'react'
import Layout from '../components/Layout'
import { MoreVertical, X, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const alerts = [
  {
    id: 1,
    user: 'James Arthur',
    action: 'uploaded',
    subject: 'RUG1234567',
    time: '15h',
    status: 'pending', // pending, accepted, rejected
    type: 'alert',
  },
  {
    id: 2,
    user: 'James Arthur',
    action: 'uploaded',
    subject: 'RUG1234567',
    time: '15h',
    status: 'accepted',
    type: 'alert',
  },
  {
    id: 3,
    user: 'James Arthur',
    action: 'uploaded',
    subject: 'RUG1234567',
    time: '15h',
    status: 'rejected',
    type: 'alert',
  },
  {
    id: 4,
    user: 'James Arthur',
    action: 'uploaded',
    subject: 'RUG1234567',
    time: '15h',
    status: 'pending',
    type: 'alert',
  },
]

export default function Alerts() {
  const [activeTab, setActiveTab] = useState('All')

  return (
    <Layout>
      <div className="rounded-xl bg-white p-4 sm:p-6 lg:p-8 shadow-sm min-h-[80vh]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#1A2035]">Alerts & Reporting</h1>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-[#1A2035] hover:text-[#2c3554]">Mark all as read</button>
            <button className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-0 flex border-b border-gray-100">
          {['All', 'Alerts', 'Reporting'].map((tab) => (
            <button
              key={tab}
              className={`mr-8 border-b-2 pb-4 text-sm font-medium transition-colors ${activeTab === tab
                  ? 'border-[#1A2035] text-[#1A2035]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab === 'All' && <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">2</span>}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-4 border-b border-gray-100 p-6 transition-colors ${alert.status === 'pending' ? 'bg-gray-50' : 'bg-white'
                }`}
            >
              {/* Unread Indicator */}
              <div className="pt-2">
                {alert.status === 'pending' && (
                  <div className="h-2 w-2 rounded-full bg-[#1A2035]" />
                )}
              </div>

              {/* Avatar */}
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#E2E8F0] text-sm font-medium text-[#73839B]">
                AB
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      <span className="font-bold text-[#1A2035]">{alert.subject}</span> has been {alert.action} by {alert.user}.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      {alert.status === 'pending' ? (
                        <>
                          <button className="rounded-xl bg-[#1A2035] px-6 py-1.5 text-sm font-medium text-white hover:bg-[#2c3554]">
                            Accept
                          </button>
                          <button className="rounded-md border border-gray-200 bg-white px-6 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Reject
                          </button>
                          <button className="text-sm font-medium text-gray-500 underline hover:text-gray-700">
                            View
                          </button>
                        </>
                      ) : alert.status === 'accepted' ? (
                        <>
                          <span className="rounded bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                            Accepted
                          </span>
                          <button className="text-sm font-medium text-gray-500 underline hover:text-gray-700">
                            View
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="rounded bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
                            Rejected
                          </span>
                          <button className="text-sm font-medium text-gray-500 underline hover:text-gray-700">
                            View
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-400">{alert.time}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="text-gray-400 hover:text-[#1A2035] outline-none">
                        <MoreVertical size={20} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white border-gray-200">
                        <DropdownMenuItem className="flex items-center justify-between text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
                          Mark as read
                          <Check size={14} className="text-[#1A2035]" />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Turn off notifications
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
