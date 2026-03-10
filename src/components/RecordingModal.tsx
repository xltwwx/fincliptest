import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, X, Info, Volume2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecordingModalProps {
  label: string;
  hint: string;
  initialValue?: string;
  customerId?: string;
  businessType?: string;
  onSave: (content: string) => void;
  onCustomerInfoSave?: (customerId: string, businessType: string) => void;
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
    <div className="text-5xl sm:text-6xl font-mono font-bold text-gray-800 mb-4 sm:mb-6 tracking-tighter">
      {formatTime(timer)}
    </div>
  );
};

export const RecordingModal: React.FC<RecordingModalProps> = ({ 
  label, 
  hint, 
  initialValue, 
  customerId: initialCustomerId,
  businessType: initialBusinessType,
  onSave, 
  onCustomerInfoSave,
  onClose 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingData, setRecordingData] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [customerId, setCustomerId] = useState(initialCustomerId || '');
  const [businessType, setBusinessType] = useState(initialBusinessType || '正常');

  // Reset form when modal opens with new initial values
  useEffect(() => {
    if (initialValue) {
      setRecordingData(initialValue);
    } else {
      setRecordingData(null);
    }
    setCustomerId(initialCustomerId || '');
    setBusinessType(initialBusinessType || '正常');
    setShowEditForm(false);
  }, [initialValue, initialCustomerId, initialBusinessType]);

  // Lock body scroll on mount
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
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
    if (recordingData) {
      onSave(recordingData);
      // Save customer info if provided
      if (onCustomerInfoSave && customerId && businessType) {
        onCustomerInfoSave(customerId, businessType);
      }
    }
    onClose();
  };

  const handleEditSave = () => {
    setShowEditForm(false);
  };

  const hasRecording = !!recordingData && !isRecording;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-[100] flex flex-col w-full max-w-md mx-auto shadow-2xl"
    >
      {/* Header */}
      <div className="px-4 py-3 sm:py-4 flex items-center justify-between border-b border-gray-100 flex-none">
        <button onClick={onClose} className="text-gray-500 p-2 -ml-2">
          <X size={24} />
        </button>
        <h2 className="text-base sm:text-lg font-bold truncate px-2">{label}</h2>
        <button 
          onClick={handleConfirm}
          disabled={!recordingData}
          className={`font-bold p-2 -mr-2 min-w-[60px] text-right ${!recordingData ? 'text-gray-300' : 'text-blue-600'}`}
        >
          完成
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 flex flex-col items-center min-h-full">
          {/* Template Hint */}
          <div className="w-full bg-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-start gap-2 text-blue-600 mb-2">
              <Info size={16} className="mt-0.5 flex-none" />
              <span className="font-bold text-xs sm:text-sm">录音模板提示</span>
            </div>
            <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
              {hint}
            </p>
          </div>

          {/* Timer/Status */}
          <div className="flex-1 flex flex-col items-center justify-center py-4 sm:py-8 w-full">
            <TimerDisplay isRecording={isRecording} />
            <div className="px-3 sm:px-4 py-1.5 bg-gray-100 rounded-full">
              <p className="text-gray-600 text-xs sm:text-sm font-medium">
                {isRecording ? '正在录音中...' : recordingData ? '录音已完成' : '准备就绪'}
              </p>
            </div>
          </div>

          {/* Edit Form for existing recording */}
          {showEditForm && hasRecording && (
            <div className="w-full bg-gray-50 rounded-xl p-4 mb-4 sm:mb-6 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm text-gray-700">编辑信息</h3>
                <button onClick={() => setShowEditForm(false)} className="text-gray-400">
                  <X size={16} />
                </button>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 mb-1 block uppercase">客户号</label>
                <input 
                  type="text" 
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="请输入客户号"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 mb-1 block uppercase">业务类型</label>
                <select 
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                >
                  <option value="正常">正常</option>
                  <option value="纠结">纠结</option>
                  <option value="拒贷">拒贷</option>
                  <option value="逾期">逾期</option>
                </select>
              </div>
              <button 
                onClick={handleEditSave}
                className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium text-sm"
              >
                保存修改
              </button>
            </div>
          )}

          {/* Controls */}
          <div className="w-full pb-8 sm:pb-12 flex flex-col items-center gap-4 sm:gap-6 mt-auto">
            {hasRecording ? (
              <div className="flex items-center gap-6 sm:gap-10">
                <button 
                  onClick={handleDelete}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                  title="删除"
                >
                  <Trash2 size={18} className="sm:w-5 sm:h-5" />
                </button>
                <button className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-200 active:scale-95 transition-transform">
                  <Play size={28} className="sm:w-8 sm:h-8 ml-0.5" fill="currentColor" />
                </button>
                <button 
                  onClick={() => setShowEditForm(!showEditForm)}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  title="编辑"
                >
                  <Edit2 size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all shadow-2xl relative ${
                  isRecording 
                    ? 'bg-red-500 text-white' 
                    : 'bg-blue-600 text-white'
                }`}
              >
                {isRecording ? (
                  <div className="flex flex-col items-center">
                    <Square size={28} className="sm:w-8 sm:h-8" fill="currentColor" />
                  </div>
                ) : (
                  <Mic size={36} className="sm:w-10 sm:h-10" />
                )}
                {isRecording && (
                  <div className="absolute inset-0 bg-red-500 rounded-full -z-10 animate-pulse-red" />
                )}
              </button>
            )}
            
            <p className="text-xs sm:text-sm text-gray-400 font-medium text-center px-4">
              {isRecording ? '点击红色按钮停止录音' : recordingData ? '您可以试听、编辑或重新录制' : '点击蓝色按钮开始录音'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
