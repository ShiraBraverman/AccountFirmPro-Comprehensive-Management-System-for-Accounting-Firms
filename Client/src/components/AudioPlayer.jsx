import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import englishSong from "../songs/Effortless Connection (1).mp3";
import hebrewSong from "../songs/הכל פשוט.mp3";
import frenchSong from "../songs/Un Monde de Fichiers (1).mp3";

const AudioPlayer = () => {
  const [volume, setVolume] = useState(0.1);  // התחלה מ-10% (0.1)
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const { i18n } = useTranslation();

  const songs = {
    en: englishSong,
    he: hebrewSong,
    fr: frenchSong,
  };

  useEffect(() => {
    audioRef.current.src = songs[i18n.language];
    audioRef.current.volume = volume;
    audioRef.current.play().catch((e) => console.log("Auto-play was prevented"));
  }, [i18n.language]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    if (newVolume > 0) {
      setIsMuted(false);
      audioRef.current.muted = false;
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    audioRef.current.currentTime = time;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const handleEnded = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
        loop
      />
      <button onClick={toggleMute}>
        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
      />
      <input
        type="range"
        min="0"
        max={isNaN(duration) ? 100 : duration}
        value={currentTime}
        onChange={handleSeek}
      />
      <span>
        {Math.floor(currentTime)} / {Math.floor(duration || 0)}
      </span>
    </div>
  );
};

export default AudioPlayer;