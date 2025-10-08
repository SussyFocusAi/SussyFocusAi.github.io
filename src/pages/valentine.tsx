import React, { useState, useEffect, useRef } from "react";
import { Heart, Sparkles, Music, Volume2, VolumeX, Zap, Star, Gift, Camera, MessageCircle, Lock, Key, Rocket, Crown, Flame } from "lucide-react";

export const getLayout = (page: React.ReactElement) => page;

const startDate = new Date(2025, 5, 4);
const noMessages = [
  "Are you sure, baby? 😢",
  "Please, pookie 💖",
  "Don't be mean 😘",
  "Just say yes 😏",
  "Aww, come on ❤️",
  "You're breaking my heart 💔",
  "Please say yes 🥺",
  "Nooo, I love you 😭",
  "Don't make me sad 😢",
  "Say yes, pookie! 💕",
  "My heart is dying 💀",
  "You're killing me 😩",
  "Pretty please? 🥹",
  "I'll cry 😿",
  "The button is right there! 👉",
  "Why are you like this? 😤",
  "Okay but seriously... 🥺",
  "Last chance! 💔"
];

const memories = [
  { emoji: "🎮", text: "Our first Valorant game together", color: "from-purple-400 to-pink-400" },
  { emoji: "🍕", text: "That late night pizza run", color: "from-orange-400 to-red-400" },
  { emoji: "🌙", text: "Stargazing and deep talks", color: "from-blue-400 to-indigo-400" },
  { emoji: "😂", text: "Laughing until we cried", color: "from-yellow-400 to-pink-400" },
  { emoji: "🎬", text: "Movie marathons on the couch", color: "from-green-400 to-teal-400" },
  { emoji: "☕", text: "Morning coffee dates", color: "from-amber-400 to-orange-400" }
];

const loveReasons = [
  "Your smile lights up my world ✨",
  "You make me laugh every day 😊",
  "Your kindness inspires me 💝",
  "You're my best friend 🤝",
  "You understand me like no one else 🫂",
  "Your hugs are my safe place 🏡",
  "You make every moment special 🌟",
  "Your passion for life is contagious 🔥"
];

const riddles = [
  { 
    question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", 
    answer: "map",
    hint: "Think about what you use for directions 🗺️"
  },
  { 
    question: "What has keys but no locks, space but no room, and you can enter but can't go inside?", 
    answer: "keyboard",
    hint: "You're using one right now ⌨️"
  },
  { 
    question: "The more you take, the more you leave behind. What am I?", 
    answer: "footsteps",
    hint: "Think about walking 👣"
  }
];

export default function ValentinePage() {
  const [step, setStep] = useState(0);
  const [daysTogether, setDaysTogether] = useState(0);
  const [showHearts, setShowHearts] = useState(false);
  const [yesSize, setYesSize] = useState(1);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [showButtons, setShowButtons] = useState(false);
  const [noText, setNoText] = useState("No 😢");
  const [celebrate, setCelebrate] = useState(false);
  const [showMemories, setShowMemories] = useState(false);
  const [currentMemory, setCurrentMemory] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [confetti, setConfetti] = useState(false);
  const [showLoveReasons, setShowLoveReasons] = useState(false);
  const [currentReason, setCurrentReason] = useState(0);
  const [riddleStep, setRiddleStep] = useState(0);
  const [riddleAnswer, setRiddleAnswer] = useState("");
  const [riddleUnlocked, setRiddleUnlocked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [photoGallery, setPhotoGallery] = useState(false);
  const [secretMessage, setSecretMessage] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [hearts3D, setHearts3D] = useState<Array<{x: number, y: number, z: number}>>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const fullMessage = "Emily, from the moment I met you, my life changed. Every day with you is an adventure, every moment is precious. You're not just my Valentine - you're my forever. I love you more than words can express. 💖";

  // Typewriter effect
  useEffect(() => {
    if (secretMessage && typewriterText.length < fullMessage.length) {
      const timer = setTimeout(() => {
        setTypewriterText(fullMessage.slice(0, typewriterText.length + 1));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [secretMessage, typewriterText]);

  // Generate 3D hearts
  useEffect(() => {
    if (celebrate) {
      const newHearts = Array.from({ length: 20 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 100
      }));
      setHearts3D(newHearts);
    }
  }, [celebrate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 0) timer = setTimeout(() => setStep(1), 6000);
    else if (step === 1) {
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - startDate.getTime());
      setDaysTogether(Math.floor(diffTime / (1000 * 60 * 60 * 24)));
      setShowHearts(true);
      timer = setTimeout(() => {
        setShowLoveReasons(true);
        setStep(2);
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (showLoveReasons && step === 2) {
      const interval = setInterval(() => {
        setCurrentReason(prev => (prev + 1) % loveReasons.length);
      }, 2500);
      
      const timer = setTimeout(() => {
        setShowMemories(true);
        setStep(3);
      }, 20000);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [showLoveReasons, step]);

  useEffect(() => {
    if (showMemories && step === 3) {
      const interval = setInterval(() => {
        setCurrentMemory(prev => (prev + 1) % memories.length);
      }, 2500);
      
      const timer = setTimeout(() => setStep(4), 15000);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [showMemories, step]);

  // Scratch card logic
  useEffect(() => {
    if (step !== 5) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = 350;
    canvas.height = 150;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#FF6F61");
    gradient.addColorStop(0.5, "#FF1493");
    gradient.addColorStop(1, "#FF9A8B");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Scratch Here ✨", canvas.width / 2, canvas.height / 2);

    let scratched = false;
    const handleMove = (e: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparentPixels = 0;
      for (let i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] === 0) transparentPixels++;
      }
      if (transparentPixels > canvas.width * canvas.height * 0.35 && !scratched) {
        scratched = true;
        setTimeout(() => setShowButtons(true), 500);
      }
    };

    const mouseMove = (e: MouseEvent) => handleMove(e);
    const touchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0]);
    };

    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("touchmove", touchMove);

    return () => {
      canvas.removeEventListener("mousemove", mouseMove);
      canvas.removeEventListener("touchmove", touchMove);
    };
  }, [step]);

  const handleNoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const randMsg = noMessages[Math.floor(Math.random() * noMessages.length)];
    setNoText(randMsg);
    setYesSize(prev => Math.min(prev + Math.random() * 0.4 + 0.2, 4));
    
    // Make No button run away
    const button = noButtonRef.current;
    if (button) {
      const maxX = window.innerWidth - button.offsetWidth - 50;
      const maxY = window.innerHeight - button.offsetHeight - 50;
      setNoPosition({
        x: Math.random() * maxX,
        y: Math.random() * maxY
      });
    }
  };

  const handleYesClick = () => {
    setCelebrate(true);
    setConfetti(true);
    setTimeout(() => setPhotoGallery(true), 3000);
    setTimeout(() => setSecretMessage(true), 6000);
    if (audioRef.current && !isMuted) {
      audioRef.current.play();
    }
  };

  const handleRiddleSubmit = () => {
    if (riddleAnswer.toLowerCase().trim() === riddles[riddleStep].answer) {
      if (riddleStep < riddles.length - 1) {
        setRiddleStep(prev => prev + 1);
        setRiddleAnswer("");
        setShowHint(false);
      } else {
        setRiddleUnlocked(true);
        setTimeout(() => setStep(5), 1000);
      }
    } else {
      setRiddleAnswer("");
      alert("Not quite! Try again 💭");
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const skipToCard = () => setStep(5);

  useEffect(() => {
    const handleContext = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", handleContext);
    return () => document.removeEventListener("contextmenu", handleContext);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-pink-300 via-red-200 to-pink-400 flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Controls */}
      <button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        {isMuted ? <VolumeX className="w-5 h-5 text-pink-600" /> : <Volume2 className="w-5 h-5 text-pink-600" />}
      </button>

      {step < 5 && !celebrate && (
        <button
          onClick={skipToCard}
          className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-pink-600 font-semibold hover:scale-110 transition-transform text-sm"
        >
          Skip to Question →
        </button>
      )}

      <audio ref={audioRef} loop muted={isMuted}>
        <source src="/romantic-music.mp3" type="audio/mpeg" />
      </audio>

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-400/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-pink-300/30 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Step 0: Initial Message */}
      {!celebrate && step === 0 && (
        <div className="relative z-10 text-center max-w-2xl animate-in fade-in slide-in-from-bottom duration-1000 p-4">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 animate-ping bg-pink-500/50 rounded-full"></div>
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-500 to-red-500 rounded-full shadow-2xl animate-bounce">
              <Heart className="w-12 h-12 text-white fill-white" />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg animate-pulse">
            Valentine's Bbg 😏
          </h1>
          <p className="text-xl sm:text-2xl text-white/95 leading-relaxed drop-shadow-md">
            Emily, my heart races every time I think of you. You light up my world,
            and each moment with you is a cherished memory. 💖
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Crown className="w-8 h-8 text-yellow-300 animate-bounce" />
            <Flame className="w-8 h-8 text-orange-300 animate-pulse" />
            <Star className="w-8 h-8 text-yellow-300 animate-spin-slow" />
          </div>
        </div>
      )}

      {/* Step 1: Days Together */}
      {!celebrate && step === 1 && (
        <div className="relative z-10 text-center max-w-2xl animate-in fade-in slide-in-from-bottom duration-1000 p-4">
          <Sparkles className="w-16 h-16 text-yellow-300 mx-auto mb-6 animate-spin-slow" />
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-8 drop-shadow-lg">
            Our Journey Together
          </h1>
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-white/30 shadow-2xl">
            <div className="mb-8">
              <p className="text-3xl sm:text-4xl font-bold text-white mb-4">
                <span className="text-6xl sm:text-7xl bg-gradient-to-r from-pink-200 to-yellow-200 bg-clip-text text-transparent animate-pulse">
                  {daysTogether}
                </span>
              </p>
              <p className="text-2xl font-bold text-white">days of pure magic ✨</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold text-white">{Math.floor(daysTogether / 30)}</div>
                <div className="text-sm text-white/80">Months</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold text-white">{daysTogether * 24}</div>
                <div className="text-sm text-white/80">Hours</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold text-white">{(daysTogether * 1440).toLocaleString()}</div>
                <div className="text-sm text-white/80">Minutes</div>
              </div>
            </div>
            <p className="text-lg text-white/80 italic">
              That's basically <strong>{daysTogether * 24} hours</strong> in Valorant ☠️
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Why I Love You */}
      {!celebrate && step === 2 && showLoveReasons && (
        <div className="relative z-10 text-center max-w-3xl animate-in fade-in duration-1000 p-4">
          <MessageCircle className="w-16 h-16 text-pink-300 mx-auto mb-6 animate-bounce" />
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-12 drop-shadow-lg">
            Why I Love You
          </h1>
          <div className="relative h-80 flex items-center justify-center">
            {loveReasons.map((reason, index) => (
              <div
                key={index}
                className={`absolute transition-all duration-700 ${
                  index === currentReason 
                    ? 'opacity-100 scale-100 z-10' 
                    : 'opacity-0 scale-75 z-0'
                }`}
              >
                <div className="bg-gradient-to-br from-pink-500 to-red-500 p-12 rounded-3xl shadow-2xl border-4 border-white/50 backdrop-blur-lg">
                  <p className="text-3xl sm:text-4xl font-bold text-white">
                    {reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-center mt-8">
            {loveReasons.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentReason ? 'bg-white w-8' : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Memories */}
      {!celebrate && step === 3 && showMemories && (
        <div className="relative z-10 text-center max-w-2xl animate-in fade-in duration-1000 p-4">
          <Gift className="w-16 h-16 text-yellow-300 mx-auto mb-6 animate-bounce" />
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-8 drop-shadow-lg">
            Our Favorite Moments
          </h1>
          <div className="relative h-72 flex items-center justify-center">
            {memories.map((memory, index) => (
              <div
                key={index}
                className={`absolute transition-all duration-700 ${
                  index === currentMemory 
                    ? 'opacity-100 scale-100 rotate-0 z-10' 
                    : 'opacity-0 scale-75 rotate-12 z-0'
                }`}
              >
                <div className={`bg-gradient-to-br ${memory.color} p-10 rounded-3xl shadow-2xl border-4 border-white/50 transform hover:rotate-3 transition-transform`}>
                  <div className="text-6xl mb-4">{memory.emoji}</div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {memory.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-center mt-8">
            {memories.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentMemory ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Riddle */}
      {!celebrate && step === 4 && !riddleUnlocked && (
        <div className="relative z-10 text-center max-w-2xl animate-in fade-in slide-in-from-bottom duration-1000 p-4">
          <Lock className="w-16 h-16 text-yellow-300 mx-auto mb-6 animate-pulse" />
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Unlock the Question
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Solve this riddle to continue... 🧩
          </p>
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl">
            <p className="text-2xl font-semibold text-white mb-6">
              {riddles[riddleStep].question}
            </p>
            <input
              type="text"
              value={riddleAnswer}
              onChange={(e) => setRiddleAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleRiddleSubmit()}
              placeholder="Type your answer..."
              className="w-full px-6 py-4 rounded-xl text-lg text-center font-semibold bg-white/90 focus:outline-none focus:ring-4 focus:ring-pink-500 mb-4"
            />
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRiddleSubmit}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-full shadow-lg hover:scale-110 transition-all"
              >
                Submit Answer
              </button>
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-8 py-3 bg-white/20 text-white font-bold rounded-full backdrop-blur-sm hover:bg-white/30 transition-all"
              >
                {showHint ? '🙈 Hide Hint' : '💡 Need a Hint?'}
              </button>
            </div>
            {showHint && (
              <p className="mt-4 text-lg text-yellow-200 animate-pulse">
                {riddles[riddleStep].hint}
              </p>
            )}
            <p className="mt-4 text-sm text-white/70">
              Riddle {riddleStep + 1} of {riddles.length}
            </p>
          </div>
        </div>
      )}

      {riddleUnlocked && step === 4 && (
        <div className="relative z-10 text-center animate-in zoom-in duration-1000">
          <Key className="w-24 h-24 text-yellow-300 mx-auto mb-6 animate-bounce" />
          <h1 className="text-6xl font-bold text-white mb-4">
            Unlocked! 🎉
          </h1>
        </div>
      )}

      {/* Step 5: Scratch Card */}
      {!celebrate && step === 5 && (
        <div className="relative z-10 text-center max-w-2xl animate-in fade-in slide-in-from-bottom duration-1000 p-4">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Emily…
          </h1>
          <h3 className="text-2xl sm:text-3xl text-white/90 mb-8 drop-shadow-md flex items-center justify-center gap-2">
            <Zap className="w-8 h-8 text-yellow-300 animate-pulse" />
            Scratch the card hehe 💌
            <Zap className="w-8 h-8 text-yellow-300 animate-pulse" />
          </h3>
          
          <div className="relative w-full max-w-md mx-auto mb-8">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-2xl">
              <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-inner">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 z-0">
                  <p className="text-2xl sm:text-3xl font-bold text-white text-center px-4 animate-pulse">
                    💌 Will You Be MY VALENTINEEEEEE 💌
                  </p>
                </div>
                <canvas 
                  ref={canvasRef} 
                  className="absolute inset-0 w-full h-full cursor-pointer z-10"
                  style={{ touchAction: 'none' }}
                />
              </div>
            </div>
          </div>

          {showButtons && (
            <div className="relative flex gap-6 justify-center items-center animate-in fade-in slide-in-from-bottom duration-500">
              <button
                onClick={handleYesClick}
                style={{ transform: `scale(${yesSize})` }}
                className="px-10 py-5 bg-gradient-to-r from-pink-500 via-red-500 to-pink-500 text-white text-2xl font-bold rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 active:scale-95 relative overflow-hidden group animate-pulse"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Heart className="w-6 h-6 fill-white" />
                  Yes ❤️
                  <Heart className="w-6 h-6 fill-white" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
              <button
                ref={noButtonRef}
                onClick={handleNoClick}
                style={{
                  position: noPosition.x || noPosition.y ? 'fixed' : 'relative',
                  left: noPosition.x ? `${noPosition.x}px` : 'auto',
                  top: noPosition.y ? `${noPosition.y}px` : 'auto'
                }}
                className="px-8 py-4 bg-white text-pink-600 text-xl font-bold rounded-full border-2 border-pink-500 shadow-xl hover:bg-pink-500 hover:text-white transition-all duration-300 active:scale-95"
              >
                {noText}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Celebration */}
      {celebrate && (
        <div className="relative z-10 text-center max-w-4xl animate-in zoom-in duration-1000 p-4">
          <div className="mb-8 relative">
            <div className="absolute inset-0 animate-ping bg-pink-500/50 rounded-full"></div>
            <div className="relative inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-pink-500 to-red-500 rounded-full shadow-2xl animate-bounce">
              <Heart className="w-16 h-16 text-white fill-white" />
            </div>
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-9xl font-bold text-white mb-8 drop-shadow-2xl animate-pulse">
            YAYYYYY! 😘💖
          </h1>
          <p className="text-3xl sm:text-4xl text-white/95 drop-shadow-lg mb-8">
            I'm so happy! Happy Valentine's Day, Emily! 💕
          </p>
          
          {photoGallery && (
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl mb-8 animate-in fade-in duration-1000">
              <Camera className="w-12 h-12 text-white mx-auto mb-4" />
              <p className="text-xl text-white/90 mb-4">
                Every moment with you is a treasure 📸
              </p>
              <div className="grid grid-cols-3 gap-4">
                {['💖', '🌹', '✨', '💝', '🎉', '💕'].map((emoji, i) => (
                  <div key={i} className="aspect-square bg-white/10 rounded-xl flex items-center justify-center text-4xl backdrop-blur-sm animate-bounce hover:scale-110 transition-transform cursor-pointer" style={{ animationDelay: `${i * 100}ms` }}>
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          )}

          {secretMessage && (
            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 backdrop-blur-md rounded-3xl p-8 border-4 border-white/50 shadow-2xl animate-in slide-in-from-bottom duration-1000">
              <MessageCircle className="w-12 h-12 text-white mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-white mb-4">A Message From My Heart</h3>
              <p className="text-lg text-white/95 leading-relaxed font-medium">
                {typewriterText}
                {typewriterText.length < fullMessage.length && (
                  <span className="inline-block w-1 h-5 bg-white ml-1 animate-pulse"></span>
                )}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-5xl">
            {['💖', '💝', '💗', '💓', '💕', '💘', '❤️', '🌹'].map((emoji, i) => (
              <span key={i} className="animate-bounce hover:scale-150 transition-transform cursor-pointer" style={{ animationDelay: `${i * 100}ms` }}>
                {emoji}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Floating Hearts */}
      {!celebrate && showHearts &&
        Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-3xl sm:text-4xl pointer-events-none animate-float"
            style={{
              left: `${Math.random() * 90}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 3}s`,
              bottom: '-10%'
            }}
          >
            {['❤️', '💖', '💕', '💗'][Math.floor(Math.random() * 4)]}
          </span>
        ))}

      {/* 3D Hearts Celebration */}
      {celebrate && hearts3D.map((heart, i) => (
        <div
          key={i}
          className="absolute pointer-events-none text-4xl animate-float-3d"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${3 + heart.z / 50}s`,
            transform: `translateZ(${heart.z}px) scale(${0.5 + heart.z / 100})`
          }}
        >
          💖
        </div>
      ))}

      {/* Confetti Explosion */}
      {confetti && celebrate && (
        <>
          {Array.from({ length: 150 }).map((_, i) => (
            <span
              key={i}
              className="absolute pointer-events-none animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                bottom: '-5%',
                fontSize: `${15 + Math.random() * 20}px`,
                opacity: 0.8 + Math.random() * 0.2
              }}
            >
              {['💖', '❤️', '💕', '💗', '💓', '💝', '🌹', '✨', '⭐', '💫', '🎉', '🎊', '🎈', '💐', '🌺'][i % 15]}
            </span>
          ))}
        </>
      )}

      {/* Sparkles Effect */}
      {celebrate && (
        <>
          {Array.from({ length: 30 }).map((_, i) => (
            <Sparkles
              key={i}
              className="absolute pointer-events-none text-yellow-300 animate-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                width: `${20 + Math.random() * 20}px`,
                height: `${20 + Math.random() * 20}px`
              }}
            />
          ))}
        </>
      )}

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-300px) scale(1.5);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-600px) scale(0.8);
            opacity: 0;
          }
        }
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes float-3d {
          0% {
            transform: translateY(0) translateZ(0) rotateY(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(-400px) translateZ(100px) rotateY(180deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-800px) translateZ(0) rotateY(360deg);
            opacity: 0;
          }
        }
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in infinite;
        }
        .animate-confetti {
          animation: confetti 4s ease-out infinite;
        }
        .animate-float-3d {
          animation: float-3d 4s ease-in-out infinite;
        }
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}