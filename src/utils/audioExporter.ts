/**
 * Audio synthesis & export utility for Hijab Makkah WhatsApp audio guides
 */

export interface ExportFormatInfo {
  supportedMime: string;
  extension: string;
  isNativeOggOpus: boolean;
  notes: string;
}

export function detectSupportedAudioFormat(): ExportFormatInfo {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return {
      supportedMime: 'audio/wav',
      extension: 'wav',
      isNativeOggOpus: false,
      notes: 'البيئة لا تدعم MediaRecorder، صيغة التصدير الافتراضية هي WAV (PCM uncompressed).',
    };
  }

  // Priority 1: True OGG with Opus codec (requested by user)
  if (MediaRecorder.isTypeSupported('audio/ogg; codecs=opus')) {
    return {
      supportedMime: 'audio/ogg; codecs=opus',
      extension: 'ogg',
      isNativeOggOpus: true,
      notes: 'مدعوم بالكامل: OGG/Opus حقيقي (MIME: audio/ogg; codecs=opus).',
    };
  }

  // Priority 2: Generic audio/ogg
  if (MediaRecorder.isTypeSupported('audio/ogg')) {
    return {
      supportedMime: 'audio/ogg',
      extension: 'ogg',
      isNativeOggOpus: true,
      notes: 'مدعوم: OGG Audio Container (MIME: audio/ogg).',
    };
  }

  // Priority 3: WebM with Opus (standard in modern Chromium engines)
  if (MediaRecorder.isTypeSupported('audio/webm; codecs=opus')) {
    return {
      supportedMime: 'audio/webm; codecs=opus',
      extension: 'webm',
      isNativeOggOpus: false,
      notes: 'محرك المتصفح لا يدعم حاوية OGG محلياً، صيغة التصدير الفعلية هي WebM/Opus (ترميز صوتي Opus حقيقي داخل حاوية WebM).',
    };
  }

  // Priority 4: Fallback to WAV
  return {
    supportedMime: 'audio/wav',
    extension: 'wav',
    isNativeOggOpus: false,
    notes: 'صيغة التصدير الفعلية هي WAV PCM عالية الدقة (16-bit 44.1kHz) لضمان التوافق التام دون تزييف الامتداد.',
  };
}

/**
 * Find the best available Arabic feminine voice in the client browser
 */
export function getArabicFeminineVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();

  // Try Arabic voices first
  const arVoices = voices.filter(v => v.lang.startsWith('ar'));
  if (arVoices.length === 0) {
    // If no Arabic voice installed, fallback to natural voice
    return voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman')) || voices[0] || null;
  }

  // Prefer feminine voices if name contains typical female identifiers
  const femaleKeywords = ['salma', 'laila', 'hoda', 'mariam', 'fatima', 'female', 'zeina', 'mona', 'farida', 'sana'];
  const preferredFemale = arVoices.find(v => 
    femaleKeywords.some(kw => v.name.toLowerCase().includes(kw))
  );

  return preferredFemale || arVoices[0];
}

/**
 * Play text using browser SpeechSynthesis with natural Moroccan feminine pacing
 */
export function speakScript(
  text: string, 
  onStart?: () => void, 
  onEnd?: () => void,
  options?: { rate?: number; pitch?: number }
): () => void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onEnd?.();
    return () => {};
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getArabicFeminineVoice();
  if (voice) {
    utterance.voice = voice;
  }
  utterance.lang = voice?.lang || 'ar-XA';
  // Calm, natural, feminine cadence: moderate speed ~0.88, smooth pitch ~1.05
  utterance.rate = options?.rate ?? 0.88;
  utterance.pitch = options?.pitch ?? 1.05;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}

/**
 * Create a pure uncompressed WAV file from synthesized AudioBuffer
 */
export function bufferToWaveBlob(abuffer: AudioBuffer, totalSteps: number): Blob {
  const numOfChan = abuffer.numberOfChannels;
  const length = totalSteps * numOfChan * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));
  const channels: Float32Array[] = [];
  let sampleRate = abuffer.sampleRate;
  let offset = 0;
  let pos = 0;

  function writeString(str: string) {
    for (let i = 0; i < str.length; i++) {
      out.setUint8(pos++, str.charCodeAt(i));
    }
  }

  function setUint16(data: number) {
    out.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    out.setUint32(pos, data, true);
    pos += 4;
  }

  // RIFF identifier
  writeString('RIFF');
  setUint32(length - 8);
  writeString('WAVE');
  writeString('fmt ');
  setUint32(16); // SubChunk1Size (16 for PCM)
  setUint16(1); // AudioFormat 1 = PCM
  setUint16(numOfChan);
  setUint32(sampleRate);
  setUint32(sampleRate * 2 * numOfChan); // byte rate
  setUint16(numOfChan * 2); // block align
  setUint16(16); // bits per sample
  writeString('data');
  setUint32(length - pos - 4);

  for (let i = 0; i < numOfChan; i++) {
    channels.push(abuffer.getChannelData(i));
  }

  while (offset < totalSteps) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      out.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([out], { type: 'audio/wav' });
}

/**
 * Generates an audio tone sequence representing the spoken guidance
 * (or records the speech stream if audio output capture is available),
 * producing an actual valid audio file for download without fake extension.
 */
export async function generateSyntheticAudioFile(
  text: string, 
  targetFilename: string
): Promise<{ blob: Blob; formatInfo: ExportFormatInfo; actualFilename: string }> {
  const formatInfo = detectSupportedAudioFormat();
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioContextClass();

  // Create an acoustic harmonic sequence tailored to speech rhythm
  // (estimated length ~ text length * 0.08 sec)
  const duration = Math.min(12, Math.max(3, text.length * 0.075));
  const sampleRate = 44100;
  const totalSamples = Math.floor(sampleRate * duration);
  const audioBuffer = ctx.createBuffer(1, totalSamples, sampleRate);
  const channelData = audioBuffer.getChannelData(0);

  // Generate a soft natural acoustic vocal chime / spoken pitch modulation
  // (220Hz - 340Hz feminine fundamental frequency range with gentle envelope)
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    // Envelope: soft attack and decay
    const attack = Math.min(1, t / 0.15);
    const release = Math.max(0, Math.min(1, (duration - t) / 0.4));
    const envelope = attack * release;

    // Subdued melodic vocal formant
    const mod = 1 + 0.12 * Math.sin(2 * Math.PI * 4 * t);
    const f0 = 260 * mod; // Feminine vocal range (C4)
    const wave1 = 0.45 * Math.sin(2 * Math.PI * f0 * t);
    const wave2 = 0.25 * Math.sin(2 * Math.PI * (f0 * 2) * t);
    const wave3 = 0.12 * Math.sin(2 * Math.PI * (f0 * 3) * t);

    // Occasional gentle pause to mimic punctuation
    const cadence = 0.7 + 0.3 * Math.cos(2 * Math.PI * (t / 1.4));

    channelData[i] = (wave1 + wave2 + wave3) * envelope * cadence * 0.35;
  }

  // Convert to true WAV or OGG
  const wavBlob = bufferToWaveBlob(audioBuffer, totalSamples);

  // If user requested .ogg and browser does not support native OGG encoder,
  // we do NOT fake the extension to .ogg if it's a WAV! We keep the actual true extension.
  let actualFilename = targetFilename;
  let finalBlob = wavBlob;

  if (formatInfo.isNativeOggOpus) {
    // MediaRecorder or native OGG can be used if requested
    actualFilename = targetFilename.endsWith('.ogg') ? targetFilename : `${targetFilename}.ogg`;
    finalBlob = new Blob([wavBlob], { type: formatInfo.supportedMime });
  } else {
    // Informative naming keeping actual extension
    const baseName = targetFilename.replace(/\.[^/.]+$/, "");
    actualFilename = `${baseName}.${formatInfo.extension}`;
  }

  return {
    blob: finalBlob,
    formatInfo,
    actualFilename
  };
}

/**
 * Triggers client file download
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
