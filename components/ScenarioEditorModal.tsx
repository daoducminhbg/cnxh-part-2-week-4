'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Scenario, OptionId } from '@/lib/types';
import { DEFAULT_SCENARIOS } from '@/lib/scenarios';

interface ScenarioEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarios: Scenario[];
  onSaveScenarios: (scenarios: Scenario[]) => void;
  onResetDefaults: () => void;
}

export const ScenarioEditorModal: React.FC<ScenarioEditorModalProps> = ({
  isOpen,
  onClose,
  scenarios,
  onSaveScenarios,
  onResetDefaults,
}) => {
  const [localScenarios, setLocalScenarios] = useState<Scenario[]>([...scenarios]);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  // Sync if prop scenarios change while open
  React.useEffect(() => {
    setLocalScenarios([...scenarios]);
  }, [scenarios]);

  if (!isOpen) return null;

  const currentSc = localScenarios[activeIdx] || localScenarios[0];

  const handleUpdateField = (field: keyof Scenario, val: unknown) => {
    const updated = [...localScenarios];
    updated[activeIdx] = {
      ...updated[activeIdx],
      [field]: val,
    };
    setLocalScenarios(updated);
  };

  const handleUpdateOption = (optId: OptionId, field: 'text' | 'subtext', val: string) => {
    const updated = [...localScenarios];
    const opts = [...updated[activeIdx].options];
    const targetIdx = opts.findIndex((o) => o.id === optId);
    if (targetIdx !== -1) {
      opts[targetIdx] = { ...opts[targetIdx], [field]: val };
      updated[activeIdx] = { ...updated[activeIdx], options: opts };
      setLocalScenarios(updated);
    }
  };

  const handleAddNewScenario = () => {
    const newId = 'scenario-' + (localScenarios.length + 1);
    const newSc: Scenario = {
      id: newId,
      code: `HỒ SƠ NGHỊ TRƯỜNG SỐ 0${localScenarios.length + 1}`,
      title: 'Tình huống thực tiễn mới về Dân chủ XHCN',
      topic: 'Chương 4: Dân chủ xã hội chủ nghĩa và Nhà nước xã hội chủ nghĩa',
      caseBackground: 'Mô tả bối cảnh tình huống thực tế phát sinh tại nghị trường hoặc đời sống kinh tế - xã hội...',
      question: 'Đại biểu Hội đồng cần biểu quyết phương án nào để bảo đảm bản chất Dân chủ XHCN?',
      options: [
        {
          id: 'A',
          label: 'PHƯƠNG ÁN A',
          text: 'Nội dung phương án A...',
          subtext: 'Phân tích hệ quả phương án A...',
        },
        {
          id: 'B',
          label: 'PHƯƠNG ÁN B',
          text: 'Nội dung phương án B chuẩn mực lý luận...',
          subtext: 'Phân tích tính hợp hiến, hợp lý luận...',
        },
      ],
      correctOptionId: 'B',
      doctrineQuote: '“Quyền lực nhà nước là thống nhất, có sự phân công, phối hợp, kiểm soát giữa các cơ quan nhà nước; quyền lực thuộc về nhân dân.”',
      constitutionalCitation: 'Văn kiện Đại hội XIII / Hiến pháp 2013',
      academicExplanation: 'Phân tích học thuật chuyên sâu về nguyên tắc lý luận của phương án đúng...',
    };

    const nextList = [...localScenarios, newSc];
    setLocalScenarios(nextList);
    setActiveIdx(nextList.length - 1);
  };

  const handleDeleteScenario = (index: number) => {
    if (localScenarios.length <= 1) {
      alert('Phải giữ lại ít nhất 1 hồ sơ tình huống trong hệ thống!');
      return;
    }
    if (confirm('Bạn có chắc chắn muốn xóa hồ sơ tình huống này không?')) {
      const nextList = localScenarios.filter((_, i) => i !== index);
      setLocalScenarios(nextList);
      setActiveIdx(Math.max(0, activeIdx - 1));
    }
  };

  const handleSave = () => {
    // Ensure all options have clean labels without any spoiler tags
    const cleanedScenarios = localScenarios.map((sc) => ({
      ...sc,
      options: sc.options.map((opt) => ({
        ...opt,
        label: opt.label.replace(/\s*\(CHÍNH XÁC\)/gi, '').trim(),
      })),
    }));

    onSaveScenarios(cleanedScenarios);
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
    }, 2000);
  };

  const handleReset = () => {
    if (confirm('Khôi phục toàn bộ 3 tình huống chuẩn mực ban đầu của học phần CNXHKH?')) {
      onResetDefaults();
      setLocalScenarios([...DEFAULT_SCENARIOS]);
      setActiveIdx(0);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-granite-950/90 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl glass-parliament p-6 md:p-8 border-2 border-emblem-gold/60 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-socialist-crimson/25 border border-socialist-crimson/50 text-emblem-gold">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-socialist-bright uppercase block">
                  QUẢN TRỊ NỘI DUNG NGHỊ TRƯỜNG
                </span>
                <h3 className="text-xl md:text-2xl font-black text-gray-100">
                  Chỉnh Sửa Hồ Sơ & Tình Huống CNXHKH
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {saveSuccessNotice && (
                <span className="text-xs font-mono text-republic-emerald font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Đã lưu đồng bộ!
                </span>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-granite-900 border border-gray-800 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scenario Tabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-gray-800/80 flex-shrink-0">
            {localScenarios.map((sc, i) => (
              <button
                key={sc.id}
                onClick={() => setActiveIdx(i)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  i === activeIdx
                    ? 'bg-emblem-gold text-granite-950 shadow-gold-glow'
                    : 'bg-granite-900 border border-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                <span>Hồ sơ #{i + 1}</span>
                {localScenarios.length > 1 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteScenario(i);
                    }}
                    className="hover:text-red-600 p-0.5"
                    title="Xóa hồ sơ này"
                  >
                    ×
                  </span>
                )}
              </button>
            ))}

            <button
              onClick={handleAddNewScenario}
              className="px-3 py-1.5 rounded-xl bg-socialist-crimson/20 border border-socialist-crimson/50 text-socialist-bright text-xs font-bold font-mono hover:bg-socialist-crimson/40 flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm tình huống mới</span>
            </button>
          </div>

          {/* Edit Form Scrollable Body */}
          {currentSc && (
            <div className="flex-1 overflow-y-auto pr-2 py-4 space-y-5 text-xs text-gray-200">
              {/* Row 1: Code & Title */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-mono text-gray-400 block mb-1 uppercase font-semibold">
                    Mã hồ sơ:
                  </label>
                  <input
                    type="text"
                    value={currentSc.code}
                    onChange={(e) => handleUpdateField('code', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-granite-900 border border-gray-700 text-amber-200 font-mono focus:border-emblem-gold outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="font-mono text-gray-400 block mb-1 uppercase font-semibold">
                    Tiêu đề tình huống:
                  </label>
                  <input
                    type="text"
                    value={currentSc.title}
                    onChange={(e) => handleUpdateField('title', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-granite-900 border border-gray-700 text-gray-100 font-bold focus:border-emblem-gold outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Topic */}
              <div>
                <label className="font-mono text-gray-400 block mb-1 uppercase font-semibold">
                  Chuyên đề / Chương học thuật:
                </label>
                <input
                  type="text"
                  value={currentSc.topic}
                  onChange={(e) => handleUpdateField('topic', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-granite-900 border border-gray-700 text-gray-300 focus:border-emblem-gold outline-none"
                />
              </div>

              {/* Row 3: Case Background */}
              <div>
                <label className="font-mono text-gray-400 block mb-1 uppercase font-semibold">
                  Bối cảnh thực tiễn nghị trường (Case background):
                </label>
                <textarea
                  rows={3}
                  value={currentSc.caseBackground}
                  onChange={(e) => handleUpdateField('caseBackground', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-granite-900 border border-gray-700 text-gray-200 leading-relaxed focus:border-emblem-gold outline-none"
                />
              </div>

              {/* Row 4: Question */}
              <div>
                <label className="font-mono text-gray-400 block mb-1 uppercase font-semibold">
                  Nhiệm vụ quyết sách / Câu hỏi của Đại biểu:
                </label>
                <textarea
                  rows={2}
                  value={currentSc.question}
                  onChange={(e) => handleUpdateField('question', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-granite-900 border border-gray-700 text-amber-100 font-semibold focus:border-emblem-gold outline-none"
                />
              </div>

              {/* Row 5: Options A & B */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option A */}
                <div className="p-4 rounded-xl bg-granite-900/80 border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-200 text-sm">PHƯƠNG ÁN A</span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-mono text-gray-300">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={currentSc.correctOptionId === 'A'}
                        onChange={() => handleUpdateField('correctOptionId', 'A')}
                        className="accent-amber-500"
                      />
                      <span>Là đáp án đúng</span>
                    </label>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-mono block mb-1">Nội dung phương án A:</label>
                    <textarea
                      rows={3}
                      value={currentSc.options.find((o) => o.id === 'A')?.text || ''}
                      onChange={(e) => handleUpdateOption('A', 'text', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-granite-950 border border-gray-700 text-gray-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-mono block mb-1">Chú giải lý luận (chỉ hiện khi công bố đáp án):</label>
                    <input
                      type="text"
                      value={currentSc.options.find((o) => o.id === 'A')?.subtext || ''}
                      onChange={(e) => handleUpdateOption('A', 'subtext', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-granite-950 border border-gray-700 text-gray-300 outline-none"
                    />
                  </div>
                </div>

                {/* Option B */}
                <div className="p-4 rounded-xl bg-granite-900/80 border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-200 text-sm">PHƯƠNG ÁN B</span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-mono text-gray-300">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={currentSc.correctOptionId === 'B'}
                        onChange={() => handleUpdateField('correctOptionId', 'B')}
                        className="accent-amber-500"
                      />
                      <span>Là đáp án đúng</span>
                    </label>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-mono block mb-1">Nội dung phương án B:</label>
                    <textarea
                      rows={3}
                      value={currentSc.options.find((o) => o.id === 'B')?.text || ''}
                      onChange={(e) => handleUpdateOption('B', 'text', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-granite-950 border border-gray-700 text-gray-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-mono block mb-1">Chú giải lý luận (chỉ hiện khi công bố đáp án):</label>
                    <input
                      type="text"
                      value={currentSc.options.find((o) => o.id === 'B')?.subtext || ''}
                      onChange={(e) => handleUpdateOption('B', 'subtext', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-granite-950 border border-gray-700 text-gray-300 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Row 6: Quote & Citations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-gray-400 block mb-1 uppercase font-semibold">
                    Luận điểm cốt lõi CNXHKH (Quote chúc mừng):
                  </label>
                  <textarea
                    rows={2}
                    value={currentSc.doctrineQuote}
                    onChange={(e) => handleUpdateField('doctrineQuote', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-granite-900 border border-gray-700 text-amber-200 italic outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-gray-400 block mb-1 uppercase font-semibold">
                    Căn cứ pháp lý & Văn kiện Đảng:
                  </label>
                  <textarea
                    rows={2}
                    value={currentSc.constitutionalCitation}
                    onChange={(e) => handleUpdateField('constitutionalCitation', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-granite-900 border border-gray-700 text-gray-200 outline-none"
                  />
                </div>
              </div>

              {/* Row 7: Academic Explanation */}
              <div>
                <label className="font-mono text-gray-400 block mb-1 uppercase font-semibold">
                  Phân tích lý luận chuyên sâu (Hiện khi công bố đáp án):
                </label>
                <textarea
                  rows={3}
                  value={currentSc.academicExplanation}
                  onChange={(e) => handleUpdateField('academicExplanation', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-granite-900 border border-gray-700 text-gray-200 leading-relaxed outline-none"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-800 flex-shrink-0">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-granite-900 hover:bg-granite-800 border border-gray-700 text-gray-400 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục 3 tình huống gốc</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-granite-800 hover:bg-granite-700 text-gray-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Hủy / Đóng
              </button>

              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emblem-gold to-emblem-amber text-granite-950 text-xs font-black uppercase tracking-wider hover:brightness-110 shadow-gold-glow flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>LƯU & ĐỒNG BỘ NGHỊ TRƯỜNG</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
