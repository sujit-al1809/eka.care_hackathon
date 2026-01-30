import { useEffect, useState, useRef } from 'react';
import { Message } from './ConversationManager';
import { Mic, MicOff, Volume2, User, Stethoscope } from 'lucide-react';

interface ConversationDisplayProps {
  messages: Message[];
  userCaption: string;
  assistantCaption: string;
  isCallActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
}

const ConversationDisplay = ({
  messages,
  userCaption,
  assistantCaption,
  isCallActive,
  isListening,
  isSpeaking
}: ConversationDisplayProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If empty, just clear
    if (!assistantCaption) {
      setDisplayedText("");
      return;
    }

    // If text changed, determine if we need to animate
    if (assistantCaption !== displayedText) {
      // If the new text starts with the old text (streaming), append
      // But here we likely get full chunks or full updates.
      // Let's just animate the difference if possible, or reset if completely new.

      // Simple approach: clear timeout, determine if we are starting new or continuing
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      // If fully new message (length diff is large or content mismatch), reset
      // Actually, simplified typewriter: just animate towards target.

      let currentIndex = 0;

      // Optimization: if we already have some text displayed and it matches the start of new text, keep it
      if (assistantCaption.startsWith(displayedText) && displayedText.length > 0) {
        currentIndex = displayedText.length;
      } else {
        setDisplayedText("");
        currentIndex = 0;
      }

      const animateTyping = () => {
        if (currentIndex < assistantCaption.length) {
          setDisplayedText(assistantCaption.slice(0, currentIndex + 1));
          currentIndex++;
          // Dynamic speed: faster for long text, punctuation pauses
          let delay = 30;
          const char = assistantCaption[currentIndex - 1];
          if (['.', '!', '?'].includes(char)) delay = 300;
          else if (['.', ','].includes(char)) delay = 150;

          typingTimeoutRef.current = setTimeout(animateTyping, delay);
        }
      };
      animateTyping();
    }

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [assistantCaption]);

  // Fallback: if not speaking, ensure full text is shown (in case user looks at history)
  useEffect(() => {
    if (!isSpeaking && assistantCaption) {
      setDisplayedText(assistantCaption);
    }
  }, [isSpeaking, assistantCaption]);

  return (
    <div className='flex flex-col gap-4 mt-8 w-full'>
      {/* Doctor Message Card */}
      <div className={`relative p-4 rounded-2xl transition-all duration-300 ${isSpeaking
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-200 dark:border-blue-700 shadow-lg shadow-blue-100 dark:shadow-blue-900/20'
          : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
        }`}>
        <div className='flex items-start gap-3'>
          <div className={`p-2 rounded-full flex-shrink-0 ${isSpeaking
              ? 'bg-blue-100 dark:bg-blue-800'
              : 'bg-gray-100 dark:bg-gray-700'
            }`}>
            <Stethoscope className={`w-5 h-5 ${isSpeaking ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
              }`} />
          </div>
          <div className='flex-1 min-h-[40px]'>
            <div className='flex items-center gap-2 mb-1'>
              <span className='text-xs font-semibold text-blue-600 dark:text-blue-400'>Doctor</span>
              {isCallActive && isSpeaking && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-800/50 rounded-full">
                  <Volume2 className="w-3 h-3 text-blue-500 animate-pulse" />
                  <span className="text-[10px] text-blue-600 dark:text-blue-400">Speaking</span>
                </div>
              )}
            </div>
            <p className={`text-sm leading-relaxed ${isSpeaking
                ? 'text-gray-800 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-300'
              }`}>
              {displayedText || (isCallActive ? 'Listening to your symptoms...' : 'Waiting for consultation to begin...')}
              {isSpeaking && displayedText.length < assistantCaption.length && <span className="animate-pulse">|</span>}
            </p>
          </div>
          {isCallActive && isSpeaking && (
            <div className="flex items-center gap-1 ml-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-blue-500 rounded-full animate-pulse"
                  style={{
                    height: `${12 + Math.random() * 8}px`,
                    animationDelay: `${i * 100}ms`,
                    animationDuration: '0.5s'
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Message Card */}
      <div className={`relative p-4 rounded-2xl transition-all duration-300 ${isListening
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-700 shadow-lg shadow-green-100 dark:shadow-green-900/20'
          : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
        }`}>
        <div className='flex items-start gap-3'>
          <div className={`p-2 rounded-full flex-shrink-0 ${isListening
              ? 'bg-green-100 dark:bg-green-800'
              : 'bg-gray-100 dark:bg-gray-700'
            }`}>
            <User className={`w-5 h-5 ${isListening ? 'text-green-600 dark:text-green-400' : 'text-gray-500'
              }`} />
          </div>
          <div className='flex-1 min-h-[40px]'>
            <div className='flex items-center gap-2 mb-1'>
              <span className='text-xs font-semibold text-green-600 dark:text-green-400'>You</span>
              {isCallActive && isListening && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-800/50 rounded-full">
                  <Mic className="w-3 h-3 text-green-500 animate-pulse" />
                  <span className="text-[10px] text-green-600 dark:text-green-400">Listening</span>
                </div>
              )}
            </div>
            <p className={`text-sm leading-relaxed ${isListening
                ? 'text-gray-800 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-300'
              }`}>
              {userCaption || (isCallActive ? 'Speak to share your symptoms...' : 'Start a call to begin')}
            </p>
          </div>
          {isCallActive && (
            <div className="flex items-center ml-2">
              {isListening ? (
                <div className='relative'>
                  <div className='absolute inset-0 bg-green-500/30 rounded-full animate-ping'></div>
                  <Mic className="w-5 h-5 text-green-500 relative z-10" />
                </div>
              ) : (
                <MicOff className="w-5 h-5 text-gray-400" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationDisplay; 