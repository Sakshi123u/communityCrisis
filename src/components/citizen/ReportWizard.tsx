import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  MapPin,
  Camera,
  Mic,
  Square,
  FileText,
  Upload,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Brain,
  Download,
  Info,
  Volume2,
  Bell,
  Mail,
  Phone
} from 'lucide-react';
import { IncidentCategory, AIAnalysisResult, IncidentMedia, Incident } from '../../types';
import { SeverityBadge } from '../common/SeverityBadge';
import { generateIncidentPDF } from '../../lib/pdfGenerator';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const floodedStreetImg = '/images/flooded_street_1786431753909.jpg';
const burstWaterPipeImg = '/images/burst_water_pipe_1786431769337.jpg';
const danglingPowerLineImg = '/images/dangling_power_line_1786431734728.jpg';
const roadPotholeImg = '/images/road_pothole_1786431784725.jpg';
const overflowingGarbageImg = '/images/overflowing_garbage_1786431801504.jpg';
const trafficSignalOutageImg = '/images/traffic_signal_outage_1786431819972.jpg';
const darkStreetlightImg = '/images/dark_streetlight_1786431840449.jpg';

export const PUNE_LOCALITIES = [
  { name: 'Shivajinagar / FC Road', lat: 18.5308, lng: 73.8475 },
  { name: 'Kothrud / Karve Road', lat: 18.5074, lng: 73.8077 },
  { name: 'Hadapsar / Magarpatta', lat: 18.5089, lng: 73.9260 },
  { name: 'Hinjawadi IT Park', lat: 18.5913, lng: 73.7389 },
  { name: 'Aundh / Baner', lat: 18.5590, lng: 73.7868 },
  { name: 'Pimpri Chinchwad (PCMC)', lat: 18.6279, lng: 73.7997 },
  { name: 'Swargate / Bibwewadi', lat: 18.5018, lng: 73.8636 },
  { name: 'Viman Nagar / Airport Rd', lat: 18.5679, lng: 73.9143 },
  { name: 'Pune Station / Camp', lat: 18.5284, lng: 73.8744 },
  { name: 'Nigdi / Pradhikaran', lat: 18.6534, lng: 73.7745 },
  { name: 'Wakad / Dange Chowk', lat: 18.5987, lng: 73.7680 },
  { name: 'Kalyani Nagar / KP', lat: 18.5463, lng: 73.9033 },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (incident: Incident) => void;
}

export const ReportWizard: React.FC<Props> = ({ isOpen, onClose, onSubmitSuccess }) => {
  const { t, translateCategory } = useLanguage();
  const { user } = useAuth();
  const [step, setStep] = useState<number>(1);

  // Step 1: Issue Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('Road Damage');
  const [citizenEmail, setCitizenEmail] = useState(user?.email || '');
  const [citizenPhone, setCitizenPhone] = useState('');

  // Step 2: Location
  const [streetAddress, setStreetAddress] = useState('Fergusson College Road');
  const [landmark, setLandmark] = useState('Opposite Goodluck Cafe');
  const [selectedArea, setSelectedArea] = useState('Shivajinagar / FC Road');
  const [latitude, setLatitude] = useState(18.5308);
  const [longitude, setLongitude] = useState(73.8475);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showManualCoords, setShowManualCoords] = useState(false);

  // Step 3: Media & Voice Recording
  const [mediaList, setMediaList] = useState<IncidentMedia[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [, setAudioBlob] = useState<Blob | null>(null);
  const [transcribingAudio, setTranscribingAudio] = useState(false);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<any>(null);

  // Step 4: AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStepLabel, setAnalysisStepLabel] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);

  // Final Submitted Incident
  const [createdIncident, setCreatedIncident] = useState<Incident | null>(null);

  if (!isOpen) return null;

  // Category photos mapping
  const categoryPhotos: Record<string, string> = {
    'Flood': floodedStreetImg,
    'Drainage': floodedStreetImg,
    'Water Leakage': burstWaterPipeImg,
    'Electricity': danglingPowerLineImg,
    'Road Damage': roadPotholeImg,
    'Garbage': overflowingGarbageImg,
    'Traffic Accident': trafficSignalOutageImg,
    'Streetlight': darkStreetlightImg,
  };

  const handleAddCategorySamplePhoto = () => {
    const url = categoryPhotos[category] || categoryPhotos['Road Damage'];
    const sampleMedia: IncidentMedia = {
      id: `med-${Date.now()}`,
      incidentId: '',
      fileName: `${category.toLowerCase().replace(/\s+/g, '_')}_evidence.jpg`,
      fileType: 'image/jpeg',
      fileSize: 1850000,
      downloadURL: url,
      mediaType: 'image',
      createdAt: new Date().toISOString()
    };
    setMediaList((prev) => [...prev, sampleMedia]);
  };

  // Handle GPS location click (optional device detection)
  const handleGetGPS = () => {
    setIsGettingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setStreetAddress(`GPS Location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
          setSelectedArea('Device GPS Detected');
          setIsGettingLocation(false);
        },
        () => {
          setIsGettingLocation(false);
          alert('GPS permission not granted or location unavailable. You can enter your address manually.');
        }
      );
    } else {
      setIsGettingLocation(false);
      alert('Geolocation is not supported by your browser. Please enter your location manually.');
    }
  };

  // Handle Image Upload with base64 conversion
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;
      const newMedia: IncidentMedia = {
        id: `med-${Date.now()}`,
        incidentId: '',
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        downloadURL: base64,
        mediaType: file.type.includes('video') ? 'video' : file.type.includes('pdf') ? 'pdf' : 'image',
        createdAt: new Date().toISOString()
      };
      setMediaList((prev) => [...prev, newMedia]);

      // If PDF or image text document, trigger OCR text extraction
      if (file.type.includes('pdf') || file.type.includes('image')) {
        runOCRExtraction(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  // OCR extraction helper call
  const runOCRExtraction = async (base64Data: string) => {
    setOcrProcessing(true);
    try {
      const res = await fetch('/api/ai/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data })
      });
      const data = await res.json();
      if (data.extractedText) {
        setDescription((prev) => prev ? `${prev}\n\n[Extracted OCR Document Text]: ${data.extractedText}` : `[Extracted OCR Document Text]: ${data.extractedText}`);
      }
    } catch (e) {
      console.error('OCR Error:', e);
    } finally {
      setOcrProcessing(false);
    }
  };

  // Microphone Voice Recording & Speech Dictation Engine
  const startVoiceRecording = async () => {
    setMicError(null);
    let speechActive = false;

    // 1. Try Web Speech API for real-time dictation into description field
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      try {
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              currentTranscript += event.results[i][0].transcript;
            }
          }
          if (currentTranscript.trim()) {
            const newText = currentTranscript.trim();
            setDescription((prev) => {
              if (prev.endsWith(newText)) return prev;
              return prev ? `${prev} ${newText}` : newText;
            });
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition error:', event.error);
        };

        recognition.start();
        speechRecognitionRef.current = recognition;
        speechActive = true;
        setIsRecording(true);
      } catch (e) {
        console.warn('Web Speech API initialization error:', e);
      }
    }

    // 2. Try MediaRecorder for audio recording & Gemini transcription
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        // Stop audio track streams
        stream.getTracks().forEach((track) => track.stop());

        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Convert blob to base64 and transcribe via Gemini API
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          // Only perform server AI transcription if WebSpeech didn't already dictate text or if Gemini is available
          if (!speechActive) {
            setTranscribingAudio(true);
            try {
              const res = await fetch('/api/ai/speech-to-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/wav' })
              });
              const data = await res.json();
              if (data.transcription) {
                setDescription((prev) => {
                  if (prev.toLowerCase().includes(data.transcription.toLowerCase())) return prev;
                  return prev ? `${prev}\n\n${data.transcription}` : data.transcription;
                });
              }
            } catch (err) {
              console.error('Speech transcription failed', err);
            } finally {
              setTranscribingAudio(false);
            }
          }
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Microphone stream access denied/error:', err);
      if (!speechActive) {
        setIsRecording(false);
        setMicError('Microphone permission blocked or mic hardware not accessible in this context.');
      }
    }
  };

  const stopVoiceRecording = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
      speechRecognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleSimulateVoiceDictation = () => {
    setTranscribingAudio(true);
    setMicError(null);
    setTimeout(() => {
      const sampleTranscripts = [
        "Severe water pipeline leakage on the main subway intersection, causing road flooding and hazard to pedestrians.",
        "Deep pothole near the school bus stop with exposed metal rebar, risking tire punctures and vehicle accidents.",
        "Streetlights have been out completely for three blocks, making the sidewalk dark and unsafe at night.",
        "Overflowing garbage containers spilling waste onto the public sidewalk, creating severe health hazard."
      ];
      const text = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
      setDescription((prev) => prev ? `${prev}\n\n${text}` : text);
      setTranscribingAudio(false);
    }, 600);
  };

  // Execute AI Analysis Pipeline
  const runAIAnalysisPipeline = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);
    setAnalysisStepLabel(t('analyzingEvidence', 'Uploading evidence & location data...'));

    setTimeout(() => {
      setAnalysisProgress(40);
      setAnalysisStepLabel(t('extractingText', 'Extracting OCR text & voice transcripts...'));
    }, 800);

    setTimeout(() => {
      setAnalysisProgress(70);
      setAnalysisStepLabel(t('runningEngine', 'Running Gemini Multimodal Crisis Engine...'));
    }, 1600);

    try {
      const combinedAddress = [
        streetAddress.trim(),
        landmark.trim() ? `(Landmark: ${landmark.trim()})` : '',
        selectedArea.trim()
      ].filter(Boolean).join(', ') || streetAddress.trim() || 'Shivajinagar Central Area';

      const imageItem = mediaList.find((m) => m.mediaType === 'image');
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          location: { address: combinedAddress, latitude, longitude },
          imageBase64: imageItem ? imageItem.downloadURL : undefined
        })
      });

      const rawAnalysis = await res.json();
      const analysis: AIAnalysisResult = {
        category: rawAnalysis.category || category || 'Road Damage',
        severity: rawAnalysis.severity || 'MEDIUM',
        confidence: rawAnalysis.confidence || 85,
        summary: rawAnalysis.summary || title || 'Civic infrastructure report',
        detectedEvidence: rawAnalysis.detectedEvidence || ['Visual evidence submitted', 'Location verified'],
        priorityScore: rawAnalysis.priorityScore || 65,
        recommendedDepartment: rawAnalysis.recommendedDepartment || 'Public Works & Engineering',
        potentialImpact: rawAnalysis.potentialImpact || 'Civic infrastructure degradation with moderate civilian impact.',
        recommendedActions: {
          immediate: rawAnalysis.recommendedActions?.immediate || [
            'Dispatch initial safety assessment crew',
            'Place safety barricades around affected perimeter'
          ],
          shortTerm: rawAnalysis.recommendedActions?.shortTerm || [
            'Audit adjacent infrastructure for strain',
            'Schedule preventive maintenance review'
          ],
          longTerm: rawAnalysis.recommendedActions?.longTerm || [
            'Notify municipal traffic coordination'
          ]
        },
        priorityFactors: rawAnalysis.priorityFactors || {
          severity: 65,
          populationImpact: 70,
          locationRisk: 60,
          urgency: 65,
          evidenceConfidence: 80
        },
        reasoning: rawAnalysis.reasoning || 'Triaged via Gemini Multimodal Crisis Engine.',
        modelUsed: rawAnalysis.modelUsed || 'gemini-3.7-flash',
        analyzedAt: new Date().toISOString()
      };

      setAiAnalysis(analysis);
      setAnalysisProgress(100);
      setIsAnalyzing(false);
      setStep(4);
    } catch (err) {
      console.error('Error running AI Analysis, fallback applied', err);
      const fallbackAnalysis: AIAnalysisResult = {
        category: category,
        severity: 'MEDIUM',
        confidence: 80,
        summary: title || 'Civic incident report',
        detectedEvidence: ['User report submitted', 'GPS location mapped'],
        priorityScore: 68,
        recommendedDepartment: 'Public Works & Infrastructure Dept',
        potentialImpact: 'Moderate public infrastructure impact with localized hazard risk.',
        recommendedActions: {
          immediate: ['Dispatch municipal field response team', 'Verify perimeter safety'],
          shortTerm: ['Perform regional infrastructure check'],
          longTerm: ['Coordinate with local ward officer']
        },
        priorityFactors: {
          severity: 65,
          populationImpact: 60,
          locationRisk: 70,
          urgency: 60,
          evidenceConfidence: 75
        },
        reasoning: 'Calculated using local crisis triage matrix.',
        modelUsed: 'Local-Triage-Engine',
        analyzedAt: new Date().toISOString()
      };
      setAiAnalysis(fallbackAnalysis);
      setIsAnalyzing(false);
      setStep(4);
    }
  };

  // Submit Final Report to Database
  const handleFinalSubmit = async () => {
    const combinedAddress = [
      streetAddress.trim(),
      landmark.trim() ? `(Landmark: ${landmark.trim()})` : '',
      selectedArea.trim()
    ].filter(Boolean).join(', ') || streetAddress.trim() || 'Shivajinagar Central Area';

    const payload = {
      title: title || 'Reported Civic Issue',
      description,
      category: aiAnalysis?.category || category,
      severity: aiAnalysis?.severity || 'MEDIUM',
      priorityScore: aiAnalysis?.priorityScore || 65,
      priorityFactors: aiAnalysis?.priorityFactors || {
        severity: 60,
        populationImpact: 60,
        locationRisk: 60,
        urgency: 60,
        evidenceConfidence: 60
      },
      citizenId: user?.id || 'user-citizen-1',
      citizenName: user?.name || 'Citizen',
      citizenEmail: citizenEmail.trim() || user?.email || undefined,
      citizenPhone: citizenPhone.trim() || undefined,
      location: {
        address: combinedAddress,
        latitude,
        longitude
      },
      media: mediaList,
      aiAnalysis,
      assignedDepartmentName: aiAnalysis?.recommendedDepartment
    };

    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const created: Incident = await res.json();
      setCreatedIncident(created);
      onSubmitSuccess(created);

      // Trigger celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setStep(5); // Success step
    } catch (e) {
      console.error('Failed to submit incident', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl text-white shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">{t('reportAnIssue')}</h3>
              <p className="text-xs text-slate-400">{t('multimodalSystem', 'Multimodal AI Crisis Intelligence System')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar Steps (1 to 4) */}
        {step < 5 && (
          <div className="px-6 py-3 bg-slate-900 border-b border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className={step >= 1 ? 'text-blue-400 font-bold' : ''}>1. {t('step1')}</span>
            <span className="text-slate-700">•</span>
            <span className={step >= 2 ? 'text-blue-400 font-bold' : ''}>2. {t('step2')}</span>
            <span className="text-slate-700">•</span>
            <span className={step >= 3 ? 'text-blue-400 font-bold' : ''}>3. {t('step3')}</span>
            <span className="text-slate-700">•</span>
            <span className={step >= 4 ? 'text-blue-400 font-bold' : ''}>4. {t('step4')}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* STEP 1: ISSUE DETAILS */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {t('issueTitleLabel')}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('issueTitlePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {t('categoryPreference')}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="Flood">{translateCategory('Flood')}</option>
                  <option value="Road Damage">{translateCategory('Road Damage')}</option>
                  <option value="Garbage">{translateCategory('Garbage')}</option>
                  <option value="Water Leakage">{translateCategory('Water Leakage')}</option>
                  <option value="Electricity">{translateCategory('Electricity')}</option>
                  <option value="Streetlight">{translateCategory('Streetlight')}</option>
                  <option value="Traffic Accident">{translateCategory('Traffic Accident')}</option>
                  <option value="Drainage">{translateCategory('Drainage')}</option>
                  <option value="Public Safety">{translateCategory('Public Safety')}</option>
                </select>
              </div>

              {/* Detailed Description with Dual Input: Typing or Voice Dictation */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center">
                    <FileText className="w-4 h-4 mr-1.5 text-blue-400" />
                    {t('detailedDescLabel')}
                  </label>
                  <div className="flex items-center space-x-2">
                    {transcribingAudio && (
                      <span className="text-[11px] text-blue-400 font-semibold flex items-center animate-pulse mr-2">
                        <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> {t('transcribingVoice')}
                      </span>
                    )}

                    {!isRecording ? (
                      <>
                        <button
                          type="button"
                          onClick={startVoiceRecording}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all flex items-center shadow-sm cursor-pointer"
                          title="Click to speak your problem description directly"
                        >
                          <Mic className="w-3.5 h-3.5 mr-1.5" />
                          {t('speakDictate')}
                        </button>
                        <button
                          type="button"
                          onClick={handleSimulateVoiceDictation}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition-colors flex items-center cursor-pointer"
                          title="Click to insert a sample voice transcription"
                        >
                          <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
                          {t('sampleVoice')}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={stopVoiceRecording}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs animate-pulse flex items-center shadow-sm cursor-pointer"
                      >
                        <Square className="w-3.5 h-3.5 mr-1.5 fill-slate-950" />
                        {t('stopRecording')}
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  {t('descriptionHelp')}
                </p>

                {isRecording && (
                  <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 flex items-center justify-between text-xs text-rose-300 animate-pulse">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                      <span className="font-semibold">{t('listeningDictating')}</span>
                    </div>
                    <span className="text-[11px] text-rose-400">{t('speakIntoMic')}</span>
                  </div>
                )}

                {micError && (
                  <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800 text-amber-300 text-xs flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{micError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSimulateVoiceDictation}
                      className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[11px] transition-colors"
                    >
                      {t('useSampleVoice')}
                    </button>
                  </div>
                )}

                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('detailedDescPlaceholder')}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                />

                {audioUrl && (
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center">
                      <Volume2 className="w-3.5 h-3.5 mr-1.5 text-rose-400" /> {t('voicePreview')}:
                    </span>
                    <audio src={audioUrl} controls className="h-8 max-w-[220px]" />
                  </div>
                )}
              </div>

              {/* Optional Contact Details for Resolution Notification */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    {t('wantUpdates')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {t('receiveUpdatesSub')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center">
                      <Mail className="w-3 h-3 mr-1 text-slate-500" /> {t('emailAddress')}
                    </label>
                    <input
                      type="email"
                      value={citizenEmail}
                      onChange={(e) => setCitizenEmail(e.target.value)}
                      placeholder="citizen@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center">
                      <Phone className="w-3 h-3 mr-1 text-slate-500" /> {t('mobileNumber')}
                    </label>
                    <input
                      type="tel"
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION (MANUAL ENTRY / NO GPS NEEDED) */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Header Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-sm text-white">{t('customLocation')}</h4>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-300">
                    No GPS Needed
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {t('manualLocationDesc')}
                </p>
              </div>

              {/* 1. Street Address / Specific Spot */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {t('streetAddressLabel')} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. FC Road / Sinhgad Road / Sector 24 Near Bus Stop"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
                />
              </div>

              {/* 2. Landmark */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {t('landmarkLabel')}
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Goodluck Cafe, Near Metro Pillar #48, School Gate 2"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
                />
              </div>

              {/* 3. Quick Locality / Ward Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>{t('popularAreas')}</span>
                  <span className="text-[10px] text-slate-400 font-normal">Click to auto-assign locality</span>
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  {PUNE_LOCALITIES.map((loc) => {
                    const isSelected = selectedArea === loc.name;
                    return (
                      <button
                        key={loc.name}
                        type="button"
                        onClick={() => {
                          setSelectedArea(loc.name);
                          setLatitude(loc.lat);
                          setLongitude(loc.lng);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold border border-blue-400 shadow-sm'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {loc.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Live Resolved Location Summary Card */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-slate-300">Recorded Incident Location:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowManualCoords(!showManualCoords)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 underline font-medium cursor-pointer"
                  >
                    {showManualCoords ? 'Hide Coordinates' : 'Manual Coordinates'}
                  </button>
                </div>
                <p className="text-xs font-semibold text-white">
                  {[streetAddress, landmark ? `(Landmark: ${landmark})` : '', selectedArea].filter(Boolean).join(', ') || 'No address specified'}
                </p>
                <div className="text-[11px] text-slate-400 flex items-center">
                  <Info className="w-3.5 h-3.5 text-blue-400 mr-1.5 shrink-0" />
                  Geo-coords: {latitude.toFixed(4)}, {longitude.toFixed(4)} ({selectedArea})
                </div>

                {showManualCoords && (
                  <div className="pt-3 mt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Latitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={latitude}
                        onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Longitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={longitude}
                        onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Optional GPS button at bottom */}
              <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                <span className="text-[11px] text-slate-500">Want device GPS instead? (Optional):</span>
                <button
                  type="button"
                  onClick={handleGetGPS}
                  disabled={isGettingLocation}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 flex items-center transition-colors cursor-pointer"
                >
                  {isGettingLocation ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-blue-400" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                  )}
                  {t('detectGPS')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PHOTO & MEDIA EVIDENCE */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Media File Upload Area */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {t('uploadMediaEvidence')}
                </label>

                <div className="relative border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 text-center bg-slate-950/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*,video/*,application/pdf"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-200">
                    {t('clickOrDragEvidence')}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {t('supportsMediaTypes')}
                  </p>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleAddCategorySamplePhoto}
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center bg-blue-950/60 border border-blue-800/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> {t('attachSamplePhoto')} {translateCategory(category)}
                  </button>
                  <span className="text-[11px] text-slate-500">{t('autoMatchesCategory')}: {translateCategory(category)}</span>
                </div>

                {ocrProcessing && (
                  <div className="mt-2 text-xs text-amber-400 flex items-center">
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    {t('runningOCR')}
                  </div>
                )}

                {/* Uploaded Media Chips */}
                {mediaList.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {mediaList.map((m) => (
                      <div
                        key={m.id}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 flex items-center space-x-2"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span className="truncate max-w-[150px]">{m.fileName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: AI TRIAGE & ANALYSIS REVIEW */}
          {step === 4 && (
            <div className="space-y-6">
              {isAnalyzing ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center mx-auto text-blue-400 animate-pulse">
                    <Brain className="w-8 h-8 animate-spin" />
                  </div>
                  <h4 className="text-lg font-bold text-white">{t('analyzingCrisis')}</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">{analysisStepLabel}</p>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden max-w-md mx-auto">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                aiAnalysis && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/80 to-slate-950 border border-blue-700/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
                          {t('aiPriorityScore')}
                        </span>
                        <div className="text-3xl font-black text-white mt-1">
                          {aiAnalysis.priorityScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
                        </div>
                      </div>
                      <SeverityBadge severity={aiAnalysis.severity} />
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">{t('detectedCategory')}:</span>
                        <span className="font-bold text-white">{translateCategory(aiAnalysis.category)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">{t('recommendedDepartment')}:</span>
                        <span className="font-bold text-blue-400">{aiAnalysis.recommendedDepartment}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-900">
                        <span className="text-xs font-bold text-slate-300 block mb-1">{t('impactAssessment')}:</span>
                        <p className="text-xs text-slate-400 leading-relaxed">{aiAnalysis.potentialImpact}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-xs font-bold text-slate-300 block mb-2">{t('immediateRecommendedActions')}:</span>
                      <ul className="space-y-1.5 text-xs text-slate-400">
                        {(aiAnalysis.recommendedActions?.immediate || []).map((act, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-blue-400 mr-2">•</span> {act}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* STEP 5: SUCCESS CONFIRMATION */}
          {step === 5 && createdIncident && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h4 className="text-xl font-extrabold text-white">{t('reportSuccessfullyTriaged')}</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Incident Number: <strong className="text-blue-400">{createdIncident.incidentNumber}</strong> {t('hasBeenRoutedTo', 'has been routed to the')} <strong>{createdIncident.assignedDepartmentName}</strong> {t('team', 'team.')}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => generateIncidentPDF(createdIncident)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-1.5 text-blue-400" />
                  {t('downloadComplaintPDF')}
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                >
                  {t('goToDashboard')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step < 5 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> {t('back')}
              </button>
            ) : <div />}

            {step === 1 && (
              <button
                onClick={() => {
                  if (!title.trim() || !description.trim()) {
                    alert(t('enterTitleAndDesc', 'Please enter issue title and description.'));
                    return;
                  }
                  setStep(2);
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center cursor-pointer"
              >
                {t('nextLocation')} <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            )}

            {step === 2 && (
              <button
                onClick={() => {
                  if (!streetAddress.trim() && !selectedArea.trim()) {
                    alert('Please enter your location or select a locality.');
                    return;
                  }
                  setStep(3);
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center cursor-pointer"
              >
                {t('nextMedia')} <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            )}

            {step === 3 && (
              <button
                onClick={runAIAnalysisPipeline}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg flex items-center cursor-pointer"
              >
                {t('runAIAnalysis')} <Brain className="w-4 h-4 ml-1.5" />
              </button>
            )}

            {step === 4 && (
              <button
                onClick={handleFinalSubmit}
                disabled={isAnalyzing}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-xl flex items-center cursor-pointer"
              >
                {t('submitOfficialReport')} <CheckCircle2 className="w-4 h-4 ml-1.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
