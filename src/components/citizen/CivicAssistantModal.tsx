import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, Loader2, BookOpen, Bot, User, Globe } from 'lucide-react';
import { useLanguage, Language } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: string[];
  timestamp: string;
}

export const CivicAssistantModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { role } = useAuth();
  const isAuthorityOrAdmin = role === 'AUTHORITY' || role === 'ADMIN';
  const { language, setLanguage } = useLanguage();
  const [activeLang, setActiveLang] = useState<Language | 'es'>(isAuthorityOrAdmin ? 'en' : (language || 'en'));

  useEffect(() => {
    if (isAuthorityOrAdmin) {
      setActiveLang('en');
    } else {
      setActiveLang(language || 'en');
    }
  }, [isAuthorityOrAdmin, language]);

  const greetings: Record<string, string> = {
    en: 'Hello! I am CivicAI, your intelligent community assistant. How can I help you today? You can ask about your complaint status, department SLAs, water or road maintenance rules, or emergency guidance.',
    hi: 'नमस्कार! मैं CivicAI हूँ, आपका बुद्धिमान नागरिक सहायक। आज मैं आपकी क्या मदद कर सकता हूँ? आप अपनी शिकायत की स्थिति, विभाग के नियम (SLA), पानी या सड़क मरम्मत के नियम या आपातकालीन मार्गदर्शन के बारे में पूछ सकते हैं।',
    mr: 'नमस्कार! मी CivicAI आहे, तुमचा डिजिटल नागरिक सहाय्यक. मी आज तुम्हाला कशी मदत करू शकतो? तुम्ही तुमच्या तक्रारीची स्थिती, विभाग वेळ मर्यादा (SLA), पाणी व रस्ता दुरुस्तीचे नियम किंवा आपत्कालीन मार्गदर्शनाबद्दल विचारू शकता.',
    es: '¡Hola! Soy CivicAI, tu asistente comunitario inteligente. ¿Cómo puedo ayudarte hoy? Puedes preguntar sobre el estado de tu queja, acuerdos de nivel de servicio (SLA), normas de mantenimiento o emergencias.'
  };

  const initialSources: Record<string, string[]> = {
    en: ['City Civic Rules & Standard Operating Procedures'],
    hi: ['नगर निगम नागरिक नियम एवं मानक संचालन प्रक्रिया (SOP)'],
    mr: ['महापालिका नागरी नियम आणि मानके (SOP)'],
    es: ['Reglamento Cívico Municipal y Procedimientos Normalizados']
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: greetings[activeLang] || greetings.en,
      sources: initialSources[activeLang] || initialSources.en,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: greetings[activeLang] || greetings.en,
        sources: initialSources[activeLang] || initialSources.en,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInput('');
    onClose();
  };

  if (!isOpen) return null;

  const handleLangChange = (newLang: Language | 'es') => {
    setActiveLang(newLang);
    if (newLang === 'en' || newLang === 'hi' || newLang === 'mr') {
      setLanguage(newLang);
    }
    // Add system message acknowledging language change
    const langNames: Record<string, string> = {
      en: 'English',
      hi: 'हिंदी (Hindi)',
      mr: 'मराठी (Marathi)',
      es: 'Español (Spanish)'
    };
    
    const switchNotice: Message = {
      id: `sys-${Date.now()}`,
      sender: 'assistant',
      text: newLang === 'hi'
        ? `भाषा बदलकर ${langNames[newLang]} कर दी गई है। आप किसी भी प्रश्न के लिए हिंदी में बात कर सकते हैं।`
        : newLang === 'mr'
        ? `भाषा बदलून ${langNames[newLang]} करण्यात आली आहे. तुम्ही आता मराठीत प्रश्न विचारू शकता.`
        : newLang === 'es'
        ? `Idioma cambiado a ${langNames[newLang]}. Puedes preguntar en español.`
        : `Language switched to ${langNames[newLang]}. You can ask questions in English.`,
      sources: [initialSources[newLang]?.[0] || 'Civic AI Language Selector'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, switchNotice]);
  };

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || input;
    if (!promptText.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          language: activeLang
        })
      });

      const data = await res.json();

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'I am happy to assist you with your civic questions.',
        sources: data.sources || ['Municipal Code Document'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Assistant error', err);
    } finally {
      setLoading(false);
    }
  };

  const quickChipsByLang: Record<string, string[]> = {
    en: [
      'How is AI Priority Score calculated?',
      'What is the SLA for fixing deep potholes?',
      'Water pipe burst emergency response procedure?',
      'How do I track my submitted complaint?'
    ],
    hi: [
      'AI प्राथमिकता स्कोर की गणना कैसे की जाती है?',
      'गहरे गड्ढों की मरम्मत की SLA समय सीमा क्या है?',
      'पानी की पाइप फटने की आपातकालीन प्रक्रिया क्या है?',
      'अपनी दर्ज शिकायत की स्थिति कैसे ट्रैक करें?'
    ],
    mr: [
      'AI प्राधान्यक्रम गुण (Priority Score) कसा ठरवला जातो?',
      'खड्डे दुरुस्तीसाठी SLA वेळ मर्यादा काय आहे?',
      'पाण्याची पाईपलाईन फुटल्यास काय उपाय आहेत?',
      'माझ्या तक्रारीची स्थिती कशी ट्रॅक करावी?'
    ],
    es: [
      '¿Cómo se calcula la puntuación de prioridad IA?',
      '¿Cuál es el SLA para reparar baches profundos?',
      '¿Procedimiento para rotura de tubería de agua?',
      '¿Cómo hago el seguimiento de mi queja?'
    ]
  };

  const currentChips = quickChipsByLang[activeLang] || quickChipsByLang.en;

  const placeholders: Record<string, string> = {
    en: 'Ask CivicAI in English...',
    hi: 'CivicAI से हिंदी में सवाल पूछें...',
    mr: 'CivicAI ला मराठीत प्रश्न विचारा...',
    es: 'Pregunta a CivicAI en español...'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl text-white shadow-2xl overflow-hidden flex flex-col h-[88vh] max-h-[620px]">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm sm:text-base leading-tight">CivicAI Assistant</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">Grounded in Official Municipal Guidelines & SOPs</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Selector - Citizens Only */}
            {!isAuthorityOrAdmin && (
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
                <Globe className="w-3.5 h-3.5 text-indigo-400 ml-1.5 mr-1 shrink-0" />
                <button
                  onClick={() => handleLangChange('en')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                    activeLang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => handleLangChange('hi')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                    activeLang === 'hi' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => handleLangChange('mr')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                    activeLang === 'mr' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  मराठी
                </button>
                <button
                  onClick={() => handleLangChange('es')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                    activeLang === 'es' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ES
                </button>
              </div>
            )}

            <button
              onClick={handleCloseModal}
              className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto flex items-center space-x-2 shrink-0 scrollbar-thin">
          <span className="text-[10px] text-slate-400 uppercase font-bold shrink-0 mr-1">
            {activeLang === 'hi' ? 'सुझाव:' : activeLang === 'mr' ? 'प्रश्न:' : activeLang === 'es' ? 'Rápido:' : 'Quick:'}
          </span>
          {currentChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] sm:text-xs font-medium shrink-0 border border-slate-700 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${
                m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-indigo-950 border border-indigo-700 text-indigo-300'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>

                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <span className="font-bold text-indigo-400 flex items-center mb-1">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {activeLang === 'hi' ? 'उद्धृत स्रोत:' : activeLang === 'mr' ? 'संदर्भित स्रोत:' : activeLang === 'es' ? 'Fuentes citadas:' : 'Cited Knowledge Sources:'}
                    </span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {m.sources.map((src, i) => (
                        <li key={i}>{src}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <span className="text-[9px] text-slate-400 block mt-1 text-right">{m.timestamp}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-indigo-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>
                {activeLang === 'hi'
                  ? 'नगर निगम दिशानिर्देशों से उत्तर तैयार किया जा रहा है...'
                  : activeLang === 'mr'
                  ? 'महापालिका मार्गदर्शक तत्त्वांमधून उत्तर शोधत आहे...'
                  : activeLang === 'es'
                  ? 'Consultando normativas municipales y generando respuesta...'
                  : 'Retrieving municipal guidelines & generating response...'}
              </span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholders[activeLang] || placeholders.en}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

