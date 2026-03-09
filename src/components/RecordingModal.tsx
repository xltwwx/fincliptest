import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, X, Info, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecordingModalProps {
  label: string;
  hint: string;
  initialValue?: string;
  onSave: (content: string) => void;
  onClose: () => void;
}

const TimerDisplay: React.FC<{ isRecording: boolean }> = ({ isRecording }) => {
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-6xl font-mono font-bold text-gray-800 mb-6 tracking-tighter">
      {formatTime(timer)}
    </div>
  );
};

export const RecordingModal: React.FC<RecordingModalProps> = ({ label, hint, initialValue, onSave, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingData, setRecordingData] = useState<string | null>(initialValue || null);

  useEffect(() => {
    // Lock body scroll on mount
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore original scroll style on unmount
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Simulate recording data
    setRecordingData(`模拟录音数据 - ${label} - ${new Date().toLocaleTimeString()}`);
  };

  const handleDelete = () => {
    setRecordingData(null);
  };

  const handleConfirm = () => {
    onSave(recordingData || '');
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-[100] flex flex-col max-w-md mx-auto shadow-2xl border-x border-gray-100"
    >
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={onClose} className="text-gray-500">
          <X size={24} />
        </button>
        <h2 className="text-lg font-bold">{label}</h2>
        <button 
          onClick={handleConfirm}
          className="text-blue-600 font-bold"
        >
          完成
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 flex flex-col items-center min-h-full">
          {/* Template Hint */}
          <div className="w-full bg-blue-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Info size={18} />
              <span className="font-bold text-sm">录音模板提示</span>
            </div>
            <p className="text-sm text-blue-700 leading-relaxed">
              {hint}
            </p>
          </div>

          {/* Timer/Status */}
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <TimerDisplay isRecording={isRecording} />
            <div className="px-4 py-1.5 bg-gray-100 rounded-full">
              <p className="text-gray-600 text-sm font-medium">
                {isRecording ? '正在录音中...' : recordingData ? '录音已完成' : '准备就绪'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="w-full pb-12 flex flex-col items-center gap-6 mt-auto">
            {recordingData && !isRecording ? (
              <div className="flex items-center gap-10">
                <button 
                  onClick={handleDelete}
                  className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                  title="删除"
                >
                  <Trash2 size={20} />
                </button>
                <button className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-200 active:scale-95 transition-transform">
                  <Play size={32} fill="currentColor" className="ml-1" />
                </button>
                <div className="w-12 h-12" /> {/* Spacer */}
              </div>
            ) : (
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl relative ${
                  isRecording 
                    ? 'bg-red-500 text-white' 
                    : 'bg-blue-600 text-white'
                }`}
              >
                {isRecording ? (
                  <div className="flex flex-col items-center">
                    <Square size={32} fill="currentColor" />
                  </div>
                ) : (
                  <Mic size={40} />
                )}
                {isRecording && (
                  <div className="absolute inset-0 bg-red-500 rounded-full -z-10 animate-pulse-red" />
                )}
              </button>
            )}
            
            <p className="text-sm text-gray-400 font-medium text-center">
              {isRecording ? '点击红色按钮停止录音' : recordingData ? '您可以试听或重新录制' : '点击蓝色按钮开始录音'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
