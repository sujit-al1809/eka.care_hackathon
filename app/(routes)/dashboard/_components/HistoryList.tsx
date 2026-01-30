"use client"
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import AddNewSession from './AddNewSession'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, FileText, User, Globe, ChevronDown, ChevronUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface SessionData {
  id: number;
  sessionId: string;
  notes: string;
  selectedDocter: any;
  conversation: any;
  report: any;
  detectedLanguage?: string;
  createdBy: string;
  createdOn: string;
}

// Language display mapping
const LANGUAGE_DISPLAY: Record<string, { name: string; nativeName: string; flag: string }> = {
  hindi: { name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  marathi: { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  tamil: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  telugu: { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  kannada: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  bengali: { name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  gujarati: { name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  malayalam: { name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  english: { name: 'English', nativeName: 'English', flag: '🌐' }
};

type SortOption = 'newest' | 'oldest' | 'status';

function HistoryList() {
  const [history, setHistory] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchConsultationHistory()
  }, [])

  const fetchConsultationHistory = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/sessions')
      if (response.data.success) {
        setHistory(response.data.sessions || [])
      }
    } catch (error) {
      console.error('Error fetching consultation history:', error)
    } finally {
      setLoading(false)
    }
  }

  // Sort consultations based on selected option
  const getSortedHistory = () => {
    const sorted = [...history];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
        );
      case 'oldest':
        return sorted.sort((a, b) => 
          new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime()
        );
      case 'status':
        // Completed first, then In Progress
        return sorted.sort((a, b) => {
          if (a.report && !b.report) return -1;
          if (!a.report && b.report) return 1;
          return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
        });
      default:
        return sorted;
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  }

  const handleViewSession = (sessionId: string) => {
    router.push(`/dashboard/medical-agent/${sessionId}`)
  }

  const getLanguageDisplay = (lang?: string) => {
    if (!lang) return null;
    const langInfo = LANGUAGE_DISPLAY[lang.toLowerCase()];
    return langInfo || { name: lang, nativeName: lang, flag: '🌐' };
  }

  if (loading) {
    return (
      <div className='mt-10'>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading consultations...</span>
        </div>
      </div>
    )
  }

  const sortedHistory = getSortedHistory();

  return (
    <div className='mt-10'>
      {
        history.length == 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 mt-5 p-7 border-2 border-dashed border-gray-200 rounded-2xl">
            <Image
              src="/medical-assistance.png"
              alt="No consultations"
              width={150}
              height={150}
            />
            <h2 className="font-bold">No Consultations Yet</h2>
            <p className="text-gray-500">You don&apos;t have any consultations with any doctor yet.</p>
            <AddNewSession />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold">Recent Consultations</h3>
                <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  {history.length} total
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center gap-2"
                  >
                    Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : 'Status'}
                    {showSortMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                  {showSortMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                      <button
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${sortBy === 'newest' ? 'bg-primary/10 text-primary' : ''}`}
                        onClick={() => { setSortBy('newest'); setShowSortMenu(false); }}
                      >
                        Newest First
                      </button>
                      <button
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${sortBy === 'oldest' ? 'bg-primary/10 text-primary' : ''}`}
                        onClick={() => { setSortBy('oldest'); setShowSortMenu(false); }}
                      >
                        Oldest First
                      </button>
                      <button
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${sortBy === 'status' ? 'bg-primary/10 text-primary' : ''}`}
                        onClick={() => { setSortBy('status'); setShowSortMenu(false); }}
                      >
                        By Status
                      </button>
                    </div>
                  )}
                </div>
                <AddNewSession />
              </div>
            </div>
            
            {/* Consultation List */}
            <div className="space-y-4">
              {sortedHistory.map((session, index) => {
                const langInfo = getLanguageDisplay(session.detectedLanguage);
                
                return (
                  <div 
                    key={session.id} 
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer bg-white dark:bg-gray-900"
                    onClick={() => handleViewSession(session.sessionId)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="p-2.5 bg-primary/10 rounded-lg">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          {/* Order number badge */}
                          <div className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-base">
                            {session.selectedDocter?.name || 'General Consultation'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {session.selectedDocter?.specialization || 'General Medicine'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{getRelativeTime(session.createdOn)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Language Badge */}
                          {langInfo && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              <Globe className="w-3 h-3" />
                              <span>{langInfo.flag} {langInfo.nativeName}</span>
                            </div>
                          )}
                          {/* Status Badge */}
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            session.report 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            {session.report ? 'Completed' : 'In Progress'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {session.notes && (
                      <div className="mt-3 mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          <span className="font-medium">Notes:</span> {session.notes}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>ID: {session.sessionId.slice(0, 8)}...</span>
                      </div>
                      {session.report && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <FileText className="w-4 h-4" />
                          <span>Report Available</span>
                        </div>
                      )}
                      <div className="ml-auto">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="hover:bg-primary hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewSession(session.sessionId);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      }
    </div>
  )
}

export default HistoryList
