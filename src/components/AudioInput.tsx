import React, { useState } from 'react';
import { Mic, Upload, FileAudio, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AudioInputProps {
  label: string;
  onComplete: (data: { type: 'voice' | 'file'; content: string }) => void;
}

export const AudioInput: React.FC<AudioInputProps> = ({ label, onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'voice' | 'file' | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleVoiceStart = () => {
    setIsRecording(true);
    // In a real app, use MediaRecorder API
    setTimeout(() => {
      setIsRecording(false);
      onComplete({ type: 'voice', content: `模拟语音录入: ${label} 的内容` });
      setIsOpen(false);
    }, 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onComplete({ type: 'file', content: `模拟文件导入: ${e.target.files[0].name}` });
      setIsOpen(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => { setIsOpen(true); setMode('voice'); }}
        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <Mic size={18} />
      </button>
      <button 
        onClick={() => { setIsOpen(true); setMode('file'); }}
        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
      >
        <Upload size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 relative"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 text-gray-400"
              >
                <X size={24} />
              </button>

              <h3 className="text-lg font-bold mb-4">{label} - {mode === 'voice' ? '语音录入' : '文件导入'}</h3>
              
              {mode === 'voice' ? (
                <div className="flex flex-col items-center py-8">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all ${isRecording ? 'bg-red-100 text-red-600 scale-110' : 'bg-blue-100 text-blue-600'}`}>
                    <Mic size={40} />
                  </div>
                  <p className="text-gray-500 mb-6">{isRecording ? '正在录音...' : '点击下方按钮开始录音'}</p>
                  {!isRecording && (
                    <button 
                      onClick={handleVoiceStart}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium"
                    >
                      开始录音
                    </button>
                  )}
                </div>
              ) : (
                <div className="py-8">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 cursor-pointer hover:border-blue-400 transition-colors">
                    <FileAudio size={48} className="text-gray-300 mb-4" />
                    <span className="text-gray-500">点击或拖拽音频文件到此处</span>
                    <input type="file" accept="audio/*" className="hidden" onChange={handleFileSelect} />
                  </label>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-4 text-center">
                本部分仅用于完整音频录入、语音导入、系统将自动进行AI摘要。
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
