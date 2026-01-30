"use client"
import { Loader2, Sparkles } from 'lucide-react'

interface TranscriptionLoadingProps {
  isLoading: boolean
}

const TranscriptionLoading = ({ isLoading }: TranscriptionLoadingProps) => {
  if (!isLoading) return null

  return (
    <div className="flex items-center justify-center gap-3 mt-4 p-3 px-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-xl">
      <div className="relative">
        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        <Sparkles className="h-3 w-3 text-blue-400 absolute -top-1 -right-1" />
      </div>
      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
        Processing your speech...
      </span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

export default TranscriptionLoading 