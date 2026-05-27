import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechSynthesisOptions {
  language: string;
  onEnd: () => void;
}

interface SpeechSynthesisReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
}

export function useSpeechSynthesis(options: SpeechSynthesisOptions): SpeechSynthesisReturn {
  const { language, onEnd } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  // Load available voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, [isSupported]);

  const getVoiceForLanguage = useCallback(
    (lang: string): SpeechSynthesisVoice | undefined => {
      const normalized = lang.toLowerCase();

      // Exact match first
      const exact = voices.find(
        (v) => v.lang.toLowerCase() === normalized || v.lang.toLowerCase().startsWith(normalized),
      );
      if (exact) return exact;

      // Partial match (e.g., "en" matches "en-US")
      const partial = voices.find((v) => v.lang.toLowerCase().startsWith(normalized.split("-")[0]));
      return partial;
    },
    [voices],
  );

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text.trim()) return;

      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = getVoiceForLanguage(language);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = language;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
        onEndRef.current();
      };

      utterance.onerror = (event) => {
        // "canceled" is expected when we call cancel() ourselves
        if (event.error !== "canceled") {
          console.warn("[SpeechSynthesis] Error:", event.error);
        }
        setIsSpeaking(false);
        utteranceRef.current = null;
        onEndRef.current();
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, language, getVoiceForLanguage],
  );

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    utteranceRef.current = null;
  }, [isSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
      utteranceRef.current = null;
    };
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported, voices };
}
