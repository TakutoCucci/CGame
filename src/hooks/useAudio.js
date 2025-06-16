import { useRef, useCallback } from "react";

export const useAudio = () => {
  const audioRefs = useRef({});
  const audioContextRef = useRef(null);

  // 簡単な音声を生成する関数
  const generateSimpleSound = useCallback(
    (frequency, duration, type = "sine") => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext ||
            window.webkitAudioContext)();
        }

        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        oscillator.frequency.setValueAtTime(
          frequency,
          audioContextRef.current.currentTime
        );
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContextRef.current.currentTime + duration
        );

        oscillator.start(audioContextRef.current.currentTime);
        oscillator.stop(audioContextRef.current.currentTime + duration);
      } catch (error) {
        console.warn("Failed to generate sound:", error);
      }
    },
    []
  );

  const playSound = useCallback(
    (soundName, volume = 0.5) => {
      try {
        // 音声ファイルのパスを定義
        const soundPaths = {
          drag: "/sounds/drag.mp3",
          drop: "/sounds/drop.mp3",
          correct: "/sounds/correct.mp3",
          incorrect: "/sounds/incorrect.mp3",
          timeUp: "/sounds/timeup.mp3",
          tick: "/sounds/tick.mp3",
          bgm: "/sounds/bgm.mp3",
          start: "/sounds/start.mp3",
          button: "/sounds/button.mp3",
        };

        const audioPath = soundPaths[soundName];
        if (!audioPath) {
          console.warn(`Sound "${soundName}" not found`);
          return;
        }

        // 既存の音声を停止
        if (audioRefs.current[soundName]) {
          audioRefs.current[soundName].pause();
          audioRefs.current[soundName].currentTime = 0;
        }

        // 新しい音声を作成
        const audio = new Audio(audioPath);
        audio.volume = volume;

        // BGMの場合はループ設定
        if (soundName === "bgm") {
          audio.loop = true;
        }

        audioRefs.current[soundName] = audio;

        // 音声再生を試行
        audio.play().catch((error) => {
          console.warn(`Failed to play sound "${soundName}":`, error);

          // フォールバック: 簡単な音声を生成
          const fallbackSounds = {
            drag: () => generateSimpleSound(800, 0.1, "sine"),
            drop: () => generateSimpleSound(600, 0.2, "sine"),
            correct: () => generateSimpleSound(523, 0.3, "sine"), // C5
            incorrect: () => generateSimpleSound(200, 0.5, "sawtooth"),
            timeUp: () => generateSimpleSound(150, 1.0, "sawtooth"),
            tick: () => generateSimpleSound(1000, 0.1, "square"),
            start: () => generateSimpleSound(440, 0.5, "sine"), // A4
            button: () => generateSimpleSound(400, 0.2, "sine"),
          };

          if (fallbackSounds[soundName]) {
            fallbackSounds[soundName]();
          }
        });
      } catch (error) {
        console.warn(`Error playing sound "${soundName}":`, error);

        // フォールバック: 簡単な音声を生成
        const fallbackSounds = {
          drag: () => generateSimpleSound(800, 0.1, "sine"),
          drop: () => generateSimpleSound(600, 0.2, "sine"),
          correct: () => generateSimpleSound(523, 0.3, "sine"),
          incorrect: () => generateSimpleSound(200, 0.5, "sawtooth"),
          timeUp: () => generateSimpleSound(150, 1.0, "sawtooth"),
          tick: () => generateSimpleSound(1000, 0.1, "square"),
          start: () => generateSimpleSound(440, 0.5, "sine"),
          button: () => generateSimpleSound(400, 0.2, "sine"),
        };

        if (fallbackSounds[soundName]) {
          fallbackSounds[soundName]();
        }
      }
    },
    [generateSimpleSound]
  );

  const stopSound = useCallback((soundName) => {
    if (audioRefs.current[soundName]) {
      audioRefs.current[soundName].pause();
      audioRefs.current[soundName].currentTime = 0;
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }, []);

  const setVolume = useCallback((soundName, volume) => {
    if (audioRefs.current[soundName]) {
      audioRefs.current[soundName].volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  return {
    playSound,
    stopSound,
    stopAllSounds,
    setVolume,
  };
};
