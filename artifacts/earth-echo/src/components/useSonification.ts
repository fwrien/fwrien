import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { EarthDataPoint } from '@/data/types';
import { getPointFrequency } from '@/data/series';

export function useSonification(points: EarthDataPoint[], index: number, setIndex: Dispatch<SetStateAction<number>>) {
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState('');
  const contextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const indexRef = useRef(index);
  const playingRef = useRef(false);
  indexRef.current = index;

  const playTone = useCallback(async (at: number) => {
    const Context = window.AudioContext;
    if (!Context) throw new Error('Web Audio is unavailable in this browser. Visual and text modes remain available.');
    if (!contextRef.current || contextRef.current.state === 'closed') contextRef.current = new Context();
    const context = contextRef.current;
    if (context.state === 'suspended') await context.resume();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = getPointFrequency(points, at);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.055, context.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.58);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.6);
  }, [points]);

  const pause = useCallback(() => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    playingRef.current = false;
    setPlaying(false);
  }, []);

  const play = useCallback(async () => {
    pause();
    setAudioError('');
    try {
      await playTone(indexRef.current);
      playingRef.current = true;
      setPlaying(true);
      timerRef.current = window.setInterval(() => {
        const next = (indexRef.current + 1) % points.length;
        indexRef.current = next;
        setIndex(next);
        void playTone(next).catch((error: unknown) => {
          pause();
          setAudioError(error instanceof Error ? error.message : 'Audio playback could not continue.');
        });
      }, 760);
    } catch (error) {
      pause();
      setAudioError(error instanceof Error ? error.message : 'Audio could not be started. Try again or use visual/text mode.');
    }
  }, [pause, playTone, points.length, setIndex]);

  const stop = useCallback(() => {
    pause();
    indexRef.current = 0;
    setIndex(0);
    setAudioError('');
  }, [pause, setIndex]);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    playingRef.current = false;
    if (contextRef.current && contextRef.current.state !== 'closed') void contextRef.current.close();
  }, []);

  return { playing, audioError, play, pause, stop };
}
