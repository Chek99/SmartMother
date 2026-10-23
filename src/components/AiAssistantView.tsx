import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Trash2, 
  AlertTriangle, 
  ShieldCheck, 
  User, 
  Bot,
  HelpCircle
} from 'lucide-react';
import { AppLanguage, Child } from '../types';

interface AiAssistantViewProps {
  child: Child;
  language: AppLanguage;
  onTriggerEmergency: (dangerSigns: string[], advice: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  dangerSignDetected?: boolean;
  time: string;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  child,
  language,
  onTriggerEmergency
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: language === 'sw'
        ? `Habari mama! Mimi ni MamaCare+, msaidizi wako wa afya ya uzazi na malezi ya mtoto wako ${child.fullName}. Unaweza kuniuliza maswali kuhusu kunyonyesha, vyakula vya lishe, chanjo za KEPI, au dalili zozote za mtoto kwa Kiswahili au Kiingereza.`
        : `Hello mama! I am MamaCare+, your maternal and child health assistant for baby ${child.fullName}. Feel free to ask me anything about breastfeeding, complementary feeding, KEPI vaccinations, or infant wellbeing in English or Kiswahili.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Web Speech API Voice Recognition (STT)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(language === 'sw' ? 'Kivinjari chako hakiauni utambuzi wa sauti.' : 'Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'sw' ? 'sw-KE' : 'en-KE';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Text-to-Speech (TTS)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'sw' ? 'sw-KE' : 'en-GB';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          childId: child._id,
          preferredLanguage: language
        })
      });

      const data = await res.json();

      const assistantMsg: Message = {
        id: `reply-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        dangerSignDetected: data.dangerSignDetected,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);

      // If danger sign was flagged, trigger emergency modal automatically
      if (data.dangerSignDetected && data.emergencyData) {
        onTriggerEmergency(
          data.emergencyData.matchedRules.map((r: any) => r.nameEn),
          language === 'sw' ? data.emergencyData.immediateAdviceSw : data.emergencyData.immediateAdviceEn
        );
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: language === 'sw'
            ? 'Pole sana, kumetokea hitilafu ya mtandao. Tafadhali hakikisha umebeba kitabu cha kliniki na kumuona mhudumu wa afya.'
            : 'Apologies, network connection error. Please consult your healthcare worker with your paper booklet.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'new-chat',
        sender: 'assistant',
        text: language === 'sw' 
          ? 'Mazungumzo yamefutwa. Ninawezaje kukusaidia leo?' 
          : 'Conversation cleared. How can I assist you and your baby today?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const samplePrompts = language === 'sw' ? [
    'Mtoto ana homa baada ya chanjo nifanye nini?',
    'Kwa nini maziwa ya kwanza colostrum ni muhimu?',
    'Jinsi ya kupika uji mzito wa lishe kwa mtoto wa miezi 6',
    'Dalili za hatari zinazohitaji daktari mara moja'
  ] : [
    'What should I do if baby has mild fever after vaccines?',
    'Why is colostrum called baby’s first immunization?',
    'How do I prepare nutritious complementary porridge at 6 months?',
    'What are urgent danger signs requiring immediate hospital care?'
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner with Safety Guardrails */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
            <Sparkles className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {language === 'sw' ? 'MamaCare+ Msaidizi Mahiri' : 'MamaCare+ AI Assistant'}
            </h2>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>{language === 'sw' ? 'Miongozo ya Wizara ya Afya (MoH Kenya)' : 'Kenya MoH & WHO Grounded'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-teal-700 font-medium">{child.fullName}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-700 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded-xl flex items-center gap-1 transition-colors"
            title="Delete conversation log"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{language === 'sw' ? 'Futa Gumzo' : 'Clear Chat'}</span>
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
        <span className="leading-tight">
          {language === 'sw'
            ? 'Kumbuka: Msaidizi huyu hatoi vipimo vya matibabu au kuandika dawa. Daima shauriana na daktari au muuguzi kliniki.'
            : 'Clinical Safety: MamaCare+ provides vetted health education, not diagnoses or prescriptions. Always consult your health worker.'}
        </span>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 min-h-[360px] max-h-[500px] overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                isUser ? 'bg-slate-900 text-white' : 'bg-teal-600 text-white'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                isUser 
                  ? 'bg-slate-900 text-white' 
                  : m.dangerSignDetected 
                    ? 'bg-red-50 border-2 border-red-400 text-red-950 font-medium' 
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
              }`}>
                {m.dangerSignDetected && (
                  <div className="flex items-center gap-1 text-red-600 font-bold mb-1 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{language === 'sw' ? 'HATARI YA MATIBABU IMEGUNDULIKA' : 'CRITICAL DANGER SIGN DETECTED'}</span>
                  </div>
                )}
                <div className="whitespace-pre-line">{m.text}</div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/40">
                  <span>{m.time}</span>
                  {!isUser && (
                    <button
                      onClick={() => speakText(m.text)}
                      className="text-teal-700 hover:text-teal-900 flex items-center gap-1 font-semibold"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? 'Soma kwa Sauti' : 'Listen'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium p-3 bg-slate-50 rounded-2xl w-fit">
            <Sparkles className="w-4 h-4 text-teal-600 animate-spin" />
            <span>{language === 'sw' ? 'MamaCare+ inachakata jibu lako...' : 'MamaCare+ is consulting MoH guidelines...'}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Fast Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 text-[11px] shrink-0 font-medium">
          {language === 'sw' ? 'Uliza Haraka:' : 'Quick Questions:'}
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-teal-400 text-slate-700 rounded-xl whitespace-nowrap text-xs transition-colors shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box with Voice Mic Trigger */}
      <div className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-2xl shadow-xs">
        <button
          onClick={toggleSpeechRecognition}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
            isListening 
              ? 'bg-red-600 text-white animate-pulse' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
          title={isListening ? 'Listening...' : 'Voice Input (STT)'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-teal-600" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={
            isListening 
              ? (language === 'sw' ? 'Ongea sasa... inasikiliza...' : 'Listening to your voice...') 
              : (language === 'sw' ? 'Andika swali lako hapa kwa Kiswahili au Kiingereza...' : 'Type parenting, nutrition, or vaccine question...')
          }
          className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent focus:outline-none text-slate-800"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white flex items-center justify-center transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
