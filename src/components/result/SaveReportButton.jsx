/**
 * 保存报告按钮组件
 * 点击生成卡片图片并下载到本地
 */

import { useState } from 'react';
import { Download, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateShareCard } from '../../utils/shareCardGenerator';

export default function SaveReportButton({ results, image, systemHistory }) {
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!results || !systemHistory?.length) {
      setError('数据不完整，无法生成报告');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 生成卡片图片
      const blob = await generateShareCard(results, image, systemHistory);

      // 下载到本地
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `beauty-hue-report-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (err) {
      console.error('保存失败:', err);
      setError('生成报告失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleSave}
        disabled={isLoading}
        className="glass-btn flex-1 flex items-center justify-center gap-2 text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : saved ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {isLoading ? '生成中...' : saved ? '已保存' : '保存报告'}
      </button>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-full border border-red-200 whitespace-nowrap"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}