/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import "./index.css";


const albumData = [
  {
    id: 1,
    image: 'src/images/shape_of_you.jpeg',
    name: "Shape of you",
    artist_name: "Ed Sheeran",
    time: '3:22',
    prio: 1,
    path: "src/sounds/shape_of_you.mp3"
  },
  {
    id: 2,
    image: 'src/images/believer.jpg',
    name: "Believer",
    artist_name: "Imagine Dragons",
    time: '3:11',
    prio: 5,
    path: "src/sounds/believer.mp3"
  },
  {
    id: 3,
    image: 'src/images/fairy_tale.webp',
    name: "Fairy tale",
    artist_name: "Alexander Rybak",
    time: '2:56',
    prio: 3,
    path: "src/sounds/fairy_tail.mp3"
  },
  {
    id: 4,
    image: 'src/images/old_town_road.png',
    name: "Old town road",
    artist_name: "Lil Nas X",
    time: '2:22',
    prio: 10,
    path: "src/sounds/old_town.mp3"
  },
  {
    id: 5,
    image: 'src/images/devil_eyes.webp',
    name: "Devil eyes",
    artist_name: "Hippie Sabotage",
    time: '3:00',
    prio: 6,
    path: "src/sounds/devil_eyes.mp3"
  },
  {
    id: 6,
    image: 'src/images/the_nights.jpg',
    name: "The Nights",
    artist_name: "Avicii - The days",
    time: '4:22',
    prio: 8,
    path: "src/sounds/the_nights.mp3"
  },
  {
    id: 7,
    image: 'src/images/thrift_shop.jpg',
    name: "Thirft shops",
    artist_name: "The BossHoss",
    time: '4:22',
    prio: 2,
    path: "src/sounds/thrift_shop.mp3"
  },
  {
    id: 8,
    image: 'src/images/venom.jpg',
    name: "Venom",
    artist_name: "Eminem",
    time: '4:22',
    prio: 9,
    path: "src/sounds/venom.mp3"
  }
];


const App = () => {
  const [queue, setQueue] = useState([...albumData]);
  const [favorites, setFavorites] = useState([]);
  const [mode, setMode] = useState("normal");
  const [currentSong, setCurrentSong] = useState(albumData[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentSong && isPlaying) {
      playSong();
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.ontimeupdate = () => {
        const progressValue = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(progressValue || 0);
      };
    }
  }, [currentSong, isPlaying]);

  const playSong = () => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.path;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const playNextSong = () => {
    let nextSong;

    if (mode === "normal") {
      const currentIndex = queue.findIndex(song => song.id === currentSong.id);
      nextSong = queue[(currentIndex + 1) % queue.length];
    } else if (mode === "circular") {
      const currentIndex = queue.findIndex(song => song.id === currentSong.id);
      nextSong = queue[(currentIndex + 1) % queue.length];
    } else if (mode === "priority") {
      const sortedQueue = [...queue].sort((a, b) => a.prio - b.prio);
      const currentIndex = sortedQueue.findIndex(song => song.id === currentSong.id);
      nextSong = sortedQueue[(currentIndex + 1) % sortedQueue.length]; 
    }

    setCurrentSong(nextSong);
  };

  const playSpecificSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const addToFavorites = (song) => {
    if (!favorites.includes(song)) {
      setFavorites([...favorites, song]);
    }
  };

  const setPrevSong = () => {
    const currentIndex = queue.findIndex((song) => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentSong(queue[prevIndex]);
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="mb-4 text-2xl font-bold text-center">Music - Queue</div>
      <div className="flex flex-row">
        <div className="w-1/4 p-4 bg-white rounded-lg shadow-md">
          <div className="mb-2 font-bold">Mode</div>
          <ul className="mb-4 space-y-2">
            <li>
              <button className={`w-full p-2 text-white rounded ${mode === "normal" ? "bg-blue-600" : "bg-blue-500"}`} onClick={() => setMode("normal")}>Normal</button>
            </li>
            <li>
              <button className={`w-full p-2 text-white rounded ${mode === "circular" ? "bg-blue-600" : "bg-blue-500"}`} onClick={() => setMode("circular")}>Circular</button>
            </li>
            <li>
              <button className={`w-full p-2 text-white rounded ${mode === "priority" ? "bg-blue-600" : "bg-blue-500"}`} onClick={() => setMode("priority")}>Priority</button>
            </li>
          </ul>
          <div className="mb-2 font-bold">Volume</div>
          <input type="range" min="0" max="100" value={volume} className="w-full" onChange={(e) => handleVolumeChange(e.target.value)} />
        </div>
        <div className="flex-grow mx-4 border-l border-gray-300"></div>
        <div className="w-3/4 p-4 bg-white rounded-lg shadow-md">
          <div className="mb-4 music_player">
            <div className="flex items-center mb-4">
              <img className="w-32 h-32 rounded-lg hero_img" src={currentSong ? currentSong.image : ""} alt="" />
              <div className="ml-4">
                <div className="text-xl font-bold song_name">{currentSong ? currentSong.name : "No song"}</div>
                <div className="text-gray-600 artist_name">{currentSong ? currentSong.artist_name : ""}</div>
                <div className="mt-2">
                  <button onClick={() => addToFavorites(currentSong)} className="px-4 py-2 text-white bg-green-500 rounded">Add to Favorites</button>
                  <button className="px-4 py-2 ml-2 text-white bg-yellow-500 rounded">Prio {currentSong ? currentSong.prio : 0}</button>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-4 button_list">
              <button onClick={setPrevSong} className="p-2 bg-gray-200 rounded">Prev</button>
              <button onClick={isPlaying ? pauseSong : playSong} className="p-2 text-white bg-blue-500 rounded">{isPlaying ? "Pause" : "Play"}</button>
              <button onClick={playNextSong} className="p-2 bg-gray-200 rounded">Next</button>
            </div>
          </div>
          <div className="album_list">
            <div className="mb-2 text-xl font-bold">All Songs</div>
            <ul className="music_container">
              {queue.map((song, index) => (
                <li key={index} className={`flex items-center p-2 border-b border-gray-300 ${currentSong.id === song.id ? 'bg-blue-100' : ''}`}>
                  <img className="w-12 h-12 rounded image_song" src={song.image} alt="" />
                  <div className="flex-grow ml-4">
                    <div className="font-semibold song_name_info">{song.name}</div>
                    <div className="text-gray-600 artist_info">{song.artist_name}</div>
                  </div>
                  <div className="text-gray-500 song_time">{song.time}</div>
                  <div className="text-gray-500">Prio: {song.prio}</div>
                  <button onClick={() => playSpecificSong(song)} className="px-2 py-1 ml-4 text-white bg-blue-500 rounded">{currentSong.id === song.id && isPlaying ? 'Playing' : 'Play'}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 favorites_list">
            <div className="mb-2 text-xl font-bold">Favorites</div>
            <ul className="music_container">
              {favorites.map((song, index) => (
                <li key={index} className={`flex items-center p-2 border-b border-gray-300 ${currentSong.id === song.id ? 'bg-blue-100' : ''}`}>
                  <img className="w-12 h-12 rounded image_song" src={song.image} alt="" />
                  <div className="flex-grow ml-4">
                    <div className="font-semibold song_name_info">{song.name}</div>
                    <div className="text-gray-600 artist_info">{song.artist_name}</div>
                  </div>
                  <div className="text-gray-500 song_time">{song.time}</div>
                  <div className="text-gray-500">Prio: {song.prio}</div>
                  <button onClick={() => playSpecificSong(song)} className="px-2 py-1 ml-4 text-white bg-blue-500 rounded">{currentSong.id === song.id && isPlaying ? 'Playing' : 'Play'}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <audio ref={audioRef}></audio>
    </div>
  );
};

export default App;
