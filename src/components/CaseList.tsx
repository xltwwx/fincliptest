import React, { useState } from 'react';
import { Search, Plus, Clock, User, Calendar, Tag } from 'lucide-react';
import { CaseRecord, CaseType } from '../types';
import { motion } from 'motion/react';

interface CaseListProps {
  cases: CaseRecord[];
  onSelect: (caseRecord: CaseRecord) => void;
  onAdd: () => void;
}

export const CaseList: React.FC<CaseListProps> = ({ cases, onSelect, onAdd }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = cases
    .filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getTypeColor = (type: CaseType) => {
    switch (type) {
      case '纠结': return 'bg-orange-100 text-orange-600';
      case '拒贷': return 'bg-red-100 text-red-600';
      case '正常': return 'bg-green-100 text-green-600';
      case '逾期': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 rounded-b-[24px] sm:rounded-b-[32px] shadow-sm flex-none">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">案例收集助手</h1>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="搜索客户姓名或案例名称"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 border-none rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* List - Scrollable area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 pb-28 sm:pb-32">
        {filteredCases.map((c) => (
          <motion.div 
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onSelect(c)}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 relative active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className={`absolute top-3 sm:top-4 right-3 sm:right-4 px-2 py-1 rounded-lg text-[10px] font-bold ${getTypeColor(c.type)}`}>
              {c.type}
            </div>
            
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3 pr-10 sm:pr-12">{c.name}</h3>
            
            <div className="grid grid-cols-2 gap-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <User size={14} className="text-gray-400" />
                <span>{c.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={14} className="text-gray-400" />
                <span>{c.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar size={14} className="text-gray-400" />
                <span>{c.date}</span>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredCases.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p>暂无相关案例</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20">
        <button 
          onClick={onAdd}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 text-white rounded-full shadow-xl shadow-blue-300 flex items-center justify-center active:scale-90 transition-transform"
        >
          <Plus size={28} className="sm:w-9 sm:h-9" />
        </button>
      </div>
    </div>
  );
};
