import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Mic, Volume2 } from 'lucide-react';
import { CaseRecord, CaseType } from '../types';
import { RecordingModal } from './RecordingModal';
import { motion, AnimatePresence } from 'motion/react';

interface CaseDetailProps {
  caseData?: CaseRecord;
  onBack: () => void;
  onSave: (updatedCase: CaseRecord) => void;
}

const MODULES = [
  { id: 'intro', title: '拟交流案例介绍', hint: '请录入案例标题、时间、客户姓名、客户类型、经营行业及贷款金额等基本信息。' },
  { id: 'customer', title: '客户基本信息与社区化', hint: '请录入客户的家庭情况、经营情况以及资产负债等社区化信息。' },
  { id: 'scheme', title: '贷款方案', hint: '请录入贷款利率、期限、担保方式及还款方式等具体方案内容。' },
  { id: 'investigation', title: '调查过程', hint: '请录入非现场调查和现场调查的具体过程与发现。' },
  { id: 'focus', title: '决策争议焦点', hint: '请录入该案例在决策过程中的核心争议点及模型分析结果。' },
];

export const CaseDetail: React.FC<CaseDetailProps> = ({ caseData, onBack, onSave }) => {
  const [formData, setFormData] = useState<CaseRecord>(caseData || {
    id: Math.random().toString(36).substr(2, 9),
    name: '',
    customerName: '',
    customerId: '',
    businessType: '正常',
    duration: '00:00',
    date: new Date().toISOString().split('T')[0],
    type: '正常',
    intro: { title: '', time: '', customerName: '', customerType: '', industry: '', amount: '' },
    customerInfo: { family: '', business: '', assetsLiabilities: '' },
    loanScheme: { rate: '', term: '', guarantee: '', repayment: '' },
    investigation: { offSite: '', onSite: '' },
    decisionFocus: '',
    recordings: {}
  });

  const [activeRecording, setActiveRecording] = useState<{ id: string; title: string; hint: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSaveRecording = (moduleId: string, content: string) => {
    setFormData(prev => {
      const newRecordings = { ...prev.recordings };
      if (!content) {
        delete newRecordings[moduleId];
      } else {
        newRecordings[moduleId] = content;
      }
      return {
        ...prev,
        recordings: newRecordings
      };
    });
  };

  const handleSaveCustomerInfo = (customerId: string, businessType: string) => {
    setFormData(prev => ({
      ...prev,
      customerId,
      businessType,
      type: businessType as CaseType
    }));
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white px-4 sm:px-6 py-4 sm:py-6 flex items-center gap-3 sm:gap-4 flex-none border-b border-gray-100">
        <button onClick={onBack} className="text-gray-600 p-1 -ml-2">
          <ArrowLeft size={22} className="sm:w-6 sm:h-6" />
        </button>
        <h1 className="text-base sm:text-lg font-bold flex-1 truncate">
          {formData.name || '新开案例'}
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Basic Info */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">客户号</label>
            <input 
              type="text" 
              value={formData.customerId}
              onChange={(e) => setFormData({...formData, customerId: e.target.value})}
              placeholder="请输入客户号"
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">业务类型</label>
            <select 
              value={formData.businessType}
              onChange={(e) => setFormData({...formData, businessType: e.target.value, type: e.target.value as CaseType})}
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              <option value="正常">正常</option>
              <option value="纠结">纠结</option>
              <option value="拒贷">拒贷</option>
              <option value="逾期">逾期</option>
            </select>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-2 sm:space-y-3">
          {MODULES.map((module) => (
            <div 
              key={module.id}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`w-2 h-2 rounded-full ${formData.recordings[module.id] ? 'bg-green-500' : 'bg-gray-200'}`} />
                <h3 className="font-bold text-sm sm:text-base text-gray-800">{module.title}</h3>
              </div>
              <button 
                onClick={() => setActiveRecording(module)}
                className={`p-2.5 sm:p-3 rounded-xl transition-colors ${
                  formData.recordings[module.id] 
                    ? 'bg-green-50 text-green-600' 
                    : 'bg-blue-50 text-blue-600'
                }`}
              >
                {formData.recordings[module.id] ? <Volume2 size={18} className="sm:w-5 sm:h-5" /> : <Mic size={18} className="sm:w-5 sm:h-5" />}
              </button>
            </div>
          ))}
        </div>

        {/* Submit Button in the middle */}
        <div className="flex justify-center pt-6 sm:pt-8 pb-10 sm:pb-12">
          <button 
            onClick={() => setShowConfirm(true)}
            className="px-10 sm:px-12 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform text-sm sm:text-base"
          >
            确认提交
          </button>
        </div>
      </div>

      {/* Recording Modal */}
      <AnimatePresence>
        {activeRecording && (
          <RecordingModal 
            label={activeRecording.title}
            hint={activeRecording.hint}
            initialValue={formData.recordings[activeRecording.id]}
            customerId={formData.customerId}
            businessType={formData.businessType}
            onSave={(content) => handleSaveRecording(activeRecording.id, content)}
            onCustomerInfoSave={handleSaveCustomerInfo}
            onClose={() => setActiveRecording(null)}
          />
        )}
      </AnimatePresence>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-sm text-center"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">确认提交</h2>
            <p className="text-gray-500 text-sm mb-6">
              是否确认提交当前案例及所有模块的录音文件？
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  onSave({
                    ...formData,
                    name: formData.customerId ? `案例-${formData.customerId}` : '未命名案例'
                  });
                  onBack();
                }}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium"
              >
                确认提交
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
