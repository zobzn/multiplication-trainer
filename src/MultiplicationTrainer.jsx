import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function MultiplicationTrainer() {
  const [mode, setMode] = useState('multiplication');
  const [rangeMode, setRangeMode] = useState('range'); // 'range' or 'specific'
  const [range, setRange] = useState({ min: 2, max: 10 });
  const [selectedTables, setSelectedTables] = useState([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [showSettings, setShowSettings] = useState(true);
  const [lastOperationType, setLastOperationType] = useState(null);

  const encouragements = [
    'Отлично! 🌟',
    'Супер! 🎉',
    'Молодец! 👏',
    'Правильно! ✨',
    'Умница! 🎯',
    'Великолепно! 🌈'
  ];

  // Звуковые эффекты
  const playSound = (isCorrect) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (isCorrect) {
      // Весёлая мелодия для правильного ответа
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      let time = audioContext.currentTime;
      
      notes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.value = freq;
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
        
        osc.start(time);
        osc.stop(time + 0.15);
        
        time += 0.1;
      });
    } else {
      // Короткий звук для неправильного ответа
      oscillator.frequency.value = 200;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  };

  const generateProblem = () => {
    let num1, num2;
    
    if (rangeMode === 'specific') {
      // Выбираем случайную таблицу из выбранных
      num1 = selectedTables[Math.floor(Math.random() * selectedTables.length)];
      num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    } else {
      num1 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      num2 = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }
    
    let problemMode = mode;
    if (mode === 'mixed') {
      // Чередуем умножение и деление
      if (lastOperationType === 'multiplication') {
        problemMode = 'division';
      } else if (lastOperationType === 'division') {
        problemMode = 'multiplication';
      } else {
        // Первый раз - случайно выбираем
        problemMode = Math.random() > 0.5 ? 'multiplication' : 'division';
      }
    }

    if (problemMode === 'multiplication') {
      setCurrentProblem({
        num1,
        num2,
        operator: '×',
        answer: num1 * num2,
        type: 'multiplication'
      });
      setLastOperationType('multiplication');
    } else {
      const product = num1 * num2;
      setCurrentProblem({
        num1: product,
        num2: num1,
        operator: '÷',
        answer: num2,
        type: 'division'
      });
      setLastOperationType('division');
    }
    
    setUserAnswer('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    const answer = parseInt(userAnswer);
    if (isNaN(answer)) return;

    if (answer === currentProblem.answer) {
      playSound(true);
      setFeedback({
        correct: true,
        message: encouragements[Math.floor(Math.random() * encouragements.length)]
      });
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      playSound(false);
      setFeedback({
        correct: false,
        message: `Не совсем. Правильный ответ: ${currentProblem.answer}`
      });
      setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!feedback && userAnswer) {
        checkAnswer();
      } else if (feedback) {
        generateProblem();
      }
    }
  };

  useEffect(() => {
    const handleGlobalKeyPress = (e) => {
      if (e.key === 'Enter' && !showSettings) {
        e.preventDefault();
        if (feedback) {
          generateProblem();
        } else if (userAnswer) {
          checkAnswer();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyPress);
    return () => window.removeEventListener('keydown', handleGlobalKeyPress);
  }, [feedback, userAnswer, showSettings]);

  const startTraining = () => {
    if (rangeMode === 'specific' && selectedTables.length === 0) {
      alert('Выберите хотя бы одну таблицу!');
      return;
    }
    setShowSettings(false);
    generateProblem();
  };

  const resetStats = () => {
    setStats({ correct: 0, incorrect: 0 });
    setLastOperationType(null);
    setShowSettings(true);
  };

  const toggleTable = (num) => {
    setSelectedTables(prev => 
      prev.includes(num) 
        ? prev.filter(n => n !== num)
        : [...prev, num].sort((a, b) => a - b)
    );
  };

  if (showSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            🎓 Тренажер математики
          </h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-3 text-gray-700">
                Выбери режим:
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setMode('multiplication')}
                  className={`w-full p-4 rounded-xl font-semibold transition ${
                    mode === 'multiplication'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ✖️ Умножение
                </button>
                <button
                  onClick={() => setMode('division')}
                  className={`w-full p-4 rounded-xl font-semibold transition ${
                    mode === 'division'
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ➗ Деление
                </button>
                <button
                  onClick={() => setMode('mixed')}
                  className={`w-full p-4 rounded-xl font-semibold transition ${
                    mode === 'mixed'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🔀 Смешанный режим
                </button>
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-3 text-gray-700">
                Диапазон чисел:
              </label>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setRangeMode('range')}
                    className={`flex-1 p-3 rounded-lg font-semibold transition ${
                      rangeMode === 'range'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Диапазон
                  </button>
                  <button
                    onClick={() => setRangeMode('specific')}
                    className={`flex-1 p-3 rounded-lg font-semibold transition ${
                      rangeMode === 'specific'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Выбрать таблицы
                  </button>
                </div>

                {rangeMode === 'range' ? (
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <label className="text-sm text-gray-600">От</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={range.min}
                        onChange={(e) => setRange({ ...range, min: parseInt(e.target.value) || 1 })}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-center text-xl font-bold"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-600">До</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={range.max}
                        onChange={(e) => setRange({ ...range, max: parseInt(e.target.value) || 10 })}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-center text-xl font-bold"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Выберите таблицы для тренировки:</div>
                    <div className="grid grid-cols-5 gap-2">
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <button
                          key={num}
                          onClick={() => toggleTable(num)}
                          className={`p-3 rounded-lg font-bold text-lg transition ${
                            selectedTables.includes(num)
                              ? 'bg-indigo-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    {selectedTables.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600 text-center">
                        Выбрано: {selectedTables.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={startTraining}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-4 rounded-xl text-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              Начать! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <div className="text-sm text-gray-600">Правильно</div>
            <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Ошибок</div>
            <div className="text-2xl font-bold text-red-600">{stats.incorrect}</div>
          </div>
          <button
            onClick={resetStats}
            className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
          >
            Настройки
          </button>
        </div>

        {currentProblem && (
          <div className="text-center space-y-6">
            <div className="text-6xl font-bold text-gray-800 space-y-4">
              <div>{currentProblem.num1}</div>
              <div className="text-5xl text-purple-600">{currentProblem.operator}</div>
              <div>{currentProblem.num2}</div>
              <div className="text-5xl text-gray-400">=</div>
            </div>

            {!feedback ? (
              <div className="space-y-4">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="?"
                  autoFocus
                  className="w-full text-5xl font-bold text-center p-4 border-4 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-xl text-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Проверить ✓
                </button>
                <div className="text-center text-gray-500 text-sm">
                  или нажми Enter
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className={`p-6 rounded-xl flex items-center justify-center gap-3 ${
                    feedback.correct
                      ? 'bg-green-100 border-4 border-green-400'
                      : 'bg-red-100 border-4 border-red-400'
                  }`}
                >
                  {feedback.correct ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600" />
                  )}
                  <span
                    className={`text-2xl font-bold ${
                      feedback.correct ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {feedback.message}
                  </span>
                </div>
                <button
                  onClick={generateProblem}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 rounded-xl text-xl shadow-lg hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Следующий пример <ArrowRight className="w-6 h-6" />
                </button>
                <div className="text-center text-gray-500 text-sm">
                  или нажми Enter
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}