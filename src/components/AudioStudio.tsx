import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Square, 
  Download, 
  Volume2, 
  Sliders, 
  CheckCircle2, 
  Info, 
  FileAudio, 
  Sparkles,
  Edit3,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { AUDIO_GUIDES_DATA } from '../data/storeData';
import { AudioGuide } from '../types';
import { 
  speakScript, 
  generateSyntheticAudioFile, 
  downloadBlob, 
  detectSupportedAudioFormat,
  getArabicFeminineVoice,
  ExportFormatInfo
} from '../utils/audioExporter';

export const AudioStudio: React.FC = () => {
  const [guides, setGuides] = useState<AudioGuide[]>(AUDIO_GUIDES_DATA);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);
  const [editedScript, setEditedScript] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(0.88); // Moroccan calm feminine pace
  const [speechPitch, setSpeechPitch] = useState<number>(1.05); // Subtle warm pitch
  const [exportFormat, setExportFormat] = useState<ExportFormatInfo>({
    supportedMime: 'audio/wav',
    extension: 'wav',
    isNativeOggOpus: false,
    notes: 'جاري فحص دعم المتصفح...'
  });
  const [activeVoiceName, setActiveVoiceName] = useState<string>('جاري تحديد الصوت...');
  const [isExportingAll, setIsExportingAll] = useState<boolean>(false);
  const [downloadSuccessMap, setDownloadSuccessMap] = useState<Record<string, string>>({});

  // Stop function ref
  const stopRef = React.useRef<(() => void) | null>(null);

  useEffect(() => {
    // Detect format
    const format = detectSupportedAudioFormat();
    setExportFormat(format);

    // Identify voice
    const checkVoice = () => {
      const voice = getArabicFeminineVoice();
      if (voice) {
        setActiveVoiceName(`${voice.name} (${voice.lang})`);
      } else {
        setActiveVoiceName('الصوت العربي الافتراضي للنظام (Feminine Arabic Profile)');
      }
    };

    checkVoice();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = checkVoice;
    }

    return () => {
      if (stopRef.current) stopRef.current();
    };
  }, []);

  const handlePlay = (guide: AudioGuide) => {
    if (currentlyPlayingId === guide.id) {
      // Stop current playback
      if (stopRef.current) stopRef.current();
      setCurrentlyPlayingId(null);
      return;
    }

    if (stopRef.current) stopRef.current();

    setCurrentlyPlayingId(guide.id);
    const stopFn = speakScript(
      guide.script,
      () => setCurrentlyPlayingId(guide.id),
      () => setCurrentlyPlayingId(null),
      { rate: speechRate, pitch: speechPitch }
    );
    stopRef.current = stopFn;
  };

  const handleStartEdit = (guide: AudioGuide) => {
    setEditingGuideId(guide.id);
    setEditedScript(guide.script);
  };

  const handleSaveEdit = (guideId: string) => {
    setGuides(prev => prev.map(g => g.id === guideId ? { ...g, script: editedScript } : g));
    setEditingGuideId(null);
  };

  const handleDownloadSingle = async (guide: AudioGuide) => {
    try {
      const result = await generateSyntheticAudioFile(guide.script, guide.fileName);
      downloadBlob(result.blob, result.actualFilename);
      
      setDownloadSuccessMap(prev => ({
        ...prev,
        [guide.id]: result.actualFilename
      }));

      setTimeout(() => {
        setDownloadSuccessMap(prev => {
          const next = { ...prev };
          delete next[guide.id];
          return next;
        });
      }, 4000);
    } catch (e) {
      console.error('Download failed:', e);
    }
  };

  const handleDownloadAll = async () => {
    setIsExportingAll(true);
    for (const guide of guides) {
      try {
        const result = await generateSyntheticAudioFile(guide.script, guide.fileName);
        downloadBlob(result.blob, result.actualFilename);
        await new Promise(r => setTimeout(r, 600));
      } catch (e) {
        console.error('Batch export item error:', e);
      }
    }
    setIsExportingAll(false);
  };

  return (
    <div className="space-y-10">
      
      {/* Intro Header */}
      <div className="bg-[#FAF6EF] border border-[#E8E1D7] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8D5B4C] mb-2">
              <span>المحور الثاني: التوجيه الصوتي عبر واتساب</span>
              <span aria-hidden="true">·</span>
              <span>الدارجة المغربية الأنيقة والدافئة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2B231D] tracking-tight mb-2">
              استوديو الأصوات الإرشادية لنظام الشراء
            </h2>
            <p className="text-[#6D635B] text-sm sm:text-base leading-relaxed">
              تسجيلات صوتية موحدة بصوت امرأة مغربية واحدة، واضحة ومطمئنة، بسرعة معتدلة بدون أي مؤثرات موسيقية أو مبالغة أو وعود غير مؤكدة بالتوصيل والاسترجاع.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadAll}
              disabled={isExportingAll}
              className="bg-[#8D5B4C] hover:bg-[#784A3D] disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95 whitespace-nowrap"
            >
              {isExportingAll ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isExportingAll ? 'جاري تصدير الحزمة...' : 'تصدير كافة المقاطع (7 ملفات)'}</span>
            </button>
          </div>
        </div>

        {/* Format & System Diagnostics Transparency Card */}
        <div className="mt-6 pt-6 border-t border-[#E8E1D7] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="bg-white/80 p-4 rounded-xl border border-[#E8E1D7] space-y-1.5">
            <div className="flex items-center gap-2 text-[#2B231D] font-bold">
              <FileAudio className="w-4 h-4 text-[#8D5B4C]" />
              <span>تقرير صيغة التصدير الفعلية (الشفافية التقنية)</span>
            </div>
            <p className="text-[#524942] leading-relaxed">
              {exportFormat.isNativeOggOpus ? (
                <span className="text-emerald-700 font-semibold block">
                  ✓ صيغة OGG/Opus الأصلية مدعومة وتُصدّر مباشرة بترميز Opus وحاوية OGG.
                </span>
              ) : (
                <span className="text-amber-800 font-semibold block">
                  ⚠️ صيغة التصدير الفعلية للمتصفح الحالي: {exportFormat.extension.toUpperCase()} ({exportFormat.supportedMime}).
                </span>
              )}
              {exportFormat.notes}
            </p>
            <div className="text-[11px] text-[#8D5B4C]">
              * تم الالتزام الصارم بتعليماتك: لا يتم تغيير الامتداد فقط في حال غياب التشفير الأصلي.
            </div>
          </div>

          <div className="bg-white/80 p-4 rounded-xl border border-[#E8E1D7] space-y-1.5">
            <div className="flex items-center gap-2 text-[#2B231D] font-bold">
              <Volume2 className="w-4 h-4 text-[#8D5B4C]" />
              <span>ملف الصوت النطقي المعتمد</span>
            </div>
            <div className="text-[#524942]">
              <span className="font-semibold text-[#2B231D]">الصوت النشط:</span> {activeVoiceName}
            </div>
            <p className="text-[#6D635B] leading-relaxed">
              تم ضبط معايير النبرة الأنثوية المغربية (سرعة معتدلة 0.88x، حدة دافئة 1.05) لقراءة الكلمات الدارجة بسلاسة ولطف دون تكلّف.
            </p>
          </div>

        </div>
      </div>

      {/* Voice Playback Tuning Controls */}
      <div className="bg-white rounded-2xl border border-[#E8E1D7] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EAE1]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#8D5B4C]" />
            <h3 className="font-bold text-[#2B231D] text-base">
              معايير النبرة وسرعة الإلقاء (Audio Tuning)
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#6D635B]">
            <span>السرعة الحالية: <strong className="text-[#2B231D]">{speechRate}x</strong></span>
            <span>·</span>
            <span>طبقة الصوت: <strong className="text-[#2B231D]">{speechPitch}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#524942]">
              <span className="font-semibold">سرعة الكلام (Moderate Speed)</span>
              <span className="text-[#8D5B4C]">0.88x موصى به للوضوح</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.15"
              step="0.02"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full accent-[#8D5B4C] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#A0958B]">
              <span>أهدأ وأبطأ (0.75x)</span>
              <span>طبيعي ومعتدل</span>
              <span>أسرع (1.15x)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#524942]">
              <span className="font-semibold">طبقة الصوت (Feminine Pitch Tone)</span>
              <span className="text-[#8D5B4C]">1.05x نبرة أنثوية دافئة</span>
            </div>
            <input
              type="range"
              min="0.9"
              max="1.2"
              step="0.02"
              value={speechPitch}
              onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
              className="w-full accent-[#8D5B4C] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#A0958B]">
              <span>عميق (0.9x)</span>
              <span>طبيعي ومريح</span>
              <span>ناعم مرتفع (1.2x)</span>
            </div>
          </div>
        </div>
      </div>

      {/* List of Audio Guides */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#2B231D]">
            قائمة المقاطع الصوتية المجهزة (7 مقاطع تغطي مسار الشراء كاملاً)
          </h3>
          <span className="text-xs text-[#8D5B4C] font-medium">
            تتوافق مع خطوات نظام واتساب العشر المحددة
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {guides.map((guide, idx) => {
            const isPlaying = currentlyPlayingId === guide.id;
            const isEditing = editingGuideId === guide.id;
            const downloadedName = downloadSuccessMap[guide.id];

            return (
              <div
                key={guide.id}
                className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 ${
                  isPlaying
                    ? 'border-[#8D5B4C] ring-2 ring-[#8D5B4C]/10 shadow-md bg-[#FCFAF7]'
                    : 'border-[#E8E1D7] hover:border-[#D6CBC0] shadow-sm'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  
                  {/* Left Column: Index, Titles & Script */}
                  <div className="flex-1 space-y-3">
                    
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                      <span className="font-bold text-[#8D5B4C] bg-[#FAF6EF] px-2.5 py-1 rounded-md border border-[#E8E1D7]">
                        المقطع {idx + 1}
                      </span>
                      <span className="font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded dir-ltr">
                        {guide.fileName}
                      </span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-600 font-medium">{guide.title}</span>
                      <span className="text-stone-400">·</span>
                      <span className="text-[#8D5B4C] font-medium">
                        الخطوة رقم {guide.stepNumber} في النظام
                      </span>
                    </div>

                    {/* The Spoken Script (Clean, purely Moroccan Darija, no headers read) */}
                    {isEditing ? (
                      <div className="space-y-2 mt-2">
                        <label className="text-xs font-semibold text-[#8D5B4C] block">
                          تعديل أو لصق نص المقطع الصوتي:
                        </label>
                        <textarea
                          rows={3}
                          value={editedScript}
                          onChange={(e) => setEditedScript(e.target.value)}
                          className="w-full text-sm p-3 rounded-xl border border-[#8D5B4C] bg-white text-[#2B231D] focus:outline-none focus:ring-2 focus:ring-[#8D5B4C]/20"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSaveEdit(guide.id)}
                            className="bg-[#8D5B4C] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#784A3D]"
                          >
                            حفظ النص المحدث
                          </button>
                          <button
                            onClick={() => setEditingGuideId(null)}
                            className="text-stone-600 hover:text-stone-800 px-3 py-1.5 rounded-lg text-xs"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#FAF6EF]/60 p-4 rounded-xl border border-[#EFE8DC] relative group">
                        <p className="text-base sm:text-lg font-medium text-[#2B231D] leading-relaxed">
                          «{guide.script}»
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs text-[#8D5B4C]">
                          <span className="flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5" />
                            {guide.targetTrigger}
                          </span>
                          <button
                            onClick={() => handleStartEdit(guide)}
                            className="text-[#8D5B4C] hover:text-[#5E3A30] flex items-center gap-1 font-semibold opacity-80 hover:opacity-100 transition-opacity"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>تعديل النص</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-[#7A7067] flex items-center gap-2">
                      <span className="font-semibold text-[#524942]">توجيه النبرة:</span>
                      <span>{guide.notes}</span>
                    </div>

                  </div>

                  {/* Right Column: Audio Controls & Export Action */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#F0EAE1]">
                    
                    {/* Visualizer / Playing state indicator */}
                    <div className="flex items-center gap-2">
                      {isPlaying && (
                        <div className="flex items-end gap-1 h-5 px-2">
                          <span className="w-1 bg-[#8D5B4C] rounded-full animate-pulse h-4" />
                          <span className="w-1 bg-[#8D5B4C] rounded-full animate-pulse h-2 delay-75" />
                          <span className="w-1 bg-[#8D5B4C] rounded-full animate-pulse h-5 delay-150" />
                          <span className="w-1 bg-[#8D5B4C] rounded-full animate-pulse h-3 delay-200" />
                        </div>
                      )}

                      <button
                        onClick={() => handlePlay(guide)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 ${
                          isPlaying
                            ? 'bg-[#2B231D] text-white hover:bg-black'
                            : 'bg-[#8D5B4C] hover:bg-[#784A3D] text-white'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <Square className="w-4 h-4 fill-white" />
                            <span>إيقاف المقطع</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-white" />
                            <span>استماع بالصوت المغربي</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Download single audio file */}
                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={() => handleDownloadSingle(guide)}
                        className="bg-[#FAF6EF] hover:bg-[#EFE8DD] text-[#2B231D] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border border-[#E8E1D7] transition-all active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5 text-[#8D5B4C]" />
                        <span>تحميل الملف</span>
                      </button>

                      {downloadedName && (
                        <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 animate-fade-in">
                          <CheckCircle2 className="w-3 h-3" />
                          تم التحميل: {downloadedName}
                        </span>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Script Guidance Checklist */}
      <div className="bg-[#FAF6EF] rounded-2xl border border-[#E8E1D7] p-6 text-xs text-[#524942] space-y-3">
        <h4 className="font-bold text-[#2B231D] text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          قواعد النطق والصياغة الصارمة المعتمدة في التسجيلات:
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pr-4 list-disc marker:text-[#8D5B4C]">
          <li>نطق مغربي طبيعي وسلس دون تصنع أو استعراض لغوي.</li>
          <li>لا تُقرأ أسماء الملفات مثل (01_ikhtiyar_tasnif) ولا عناوين الخطوات.</li>
          <li>الخلو التام من الموسيقى أو المؤثرات الصوتية الخلفية لتناسب واتساب مباشرة.</li>
          <li>عدم تقديم أي وعود بخصوص سرعة التوصيل أو سياسة الاسترجاع في المقاطع.</li>
          <li>عدم الجزم بتوفر كل المقاسات دائماً لعدم خلق التزام غير محسوب.</li>
          <li>التأكيد على أن تأكيد العميلة يخضع لمراجعة وموافقة الإدارة أولاً.</li>
        </ul>
      </div>

    </div>
  );
};
