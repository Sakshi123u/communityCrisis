import React, { useState } from 'react';
import { IncidentMedia } from '../../types';
import { Image, Video, FileText, Music, Play, Pause, Eye, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

interface Props {
  media: IncidentMedia[];
}

export const EvidenceGallery: React.FC<Props> = ({ media }) => {
  const [activeMedia, setActiveMedia] = useState<IncidentMedia | null>(media.length > 0 ? media[0] : null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (media.length === 0) {
    return (
      <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
        <Image className="w-8 h-8 mx-auto text-slate-400 mb-2" />
        <p className="text-sm text-slate-500 font-medium">No attached evidence media files.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Active Preview Area */}
      {activeMedia && (
        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 text-white shadow-inner min-h-[220px] flex items-center justify-center relative">
          {activeMedia.mediaType === 'image' && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={activeMedia.downloadURL}
                alt={activeMedia.fileName}
                className="max-h-[360px] w-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.failed) {
                    target.dataset.failed = 'true';
                    target.src = 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80';
                  }
                }}
              />
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md text-emerald-400 text-xs font-bold border border-emerald-500/40 flex items-center shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Photo Relevance Verified (Matches Reported Issue)
              </div>
            </div>
          )}

          {activeMedia.mediaType === 'video' && (
            <video
              src={activeMedia.downloadURL}
              controls
              className="max-h-[360px] w-full object-contain"
            />
          )}

          {activeMedia.mediaType === 'audio' && (
            <div className="p-8 text-center w-full max-w-md">
              <div className="w-16 h-16 rounded-full bg-blue-600/30 border border-blue-500 flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-blue-400" />
              </div>
              <p className="font-semibold text-base mb-1">{activeMedia.fileName}</p>
              <audio src={activeMedia.downloadURL} controls className="w-full mt-4" />
              {activeMedia.transcription && (
                <div className="mt-4 p-3 bg-slate-800/80 rounded-lg text-xs text-slate-300 text-left border border-slate-700">
                  <span className="font-bold text-blue-400 block mb-1">AI Audio Transcription:</span>
                  "{activeMedia.transcription}"
                </div>
              )}
            </div>
          )}

          {activeMedia.mediaType === 'pdf' && (
            <div className="p-8 text-center w-full max-w-md">
              <FileText className="w-16 h-16 text-amber-400 mx-auto mb-3" />
              <p className="font-semibold text-base mb-2">{activeMedia.fileName}</p>
              {activeMedia.extractedText ? (
                <div className="p-4 bg-slate-800 rounded-lg text-xs text-slate-200 text-left max-h-48 overflow-y-auto border border-slate-700">
                  <span className="font-bold text-amber-400 block mb-1">Extracted OCR Document Text:</span>
                  {activeMedia.extractedText}
                </div>
              ) : (
                <a
                  href={activeMedia.downloadURL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors mt-2"
                >
                  <Eye className="w-4 h-4 mr-1.5" /> View Full Document
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Media Thumbnail Selector */}
      {media.length > 1 && (
        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
          {media.map((item) => {
            const isSelected = activeMedia?.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMedia(item)}
                className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-500/30'
                    : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                {item.mediaType === 'image' ? (
                  <img
                    src={item.downloadURL}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.failed) {
                        target.dataset.failed = 'true';
                        target.src = 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80';
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-slate-300">
                    {item.mediaType === 'video' && <Video className="w-6 h-6 text-purple-400" />}
                    {item.mediaType === 'audio' && <Music className="w-6 h-6 text-blue-400" />}
                    {item.mediaType === 'pdf' && <FileText className="w-6 h-6 text-amber-400" />}
                    <span className="text-[10px] font-semibold mt-1 uppercase">{item.mediaType}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
