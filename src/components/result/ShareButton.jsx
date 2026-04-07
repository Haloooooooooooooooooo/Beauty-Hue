/**
 * 分享按钮组件
 * 点击后复制分享链接到剪贴板
 * 统一将报告上传到数据库，生成短链接
 */

import { useState, useContext } from 'react';
import { Loader2, Check, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateUserShareUrl, isUsingLocalShareOrigin } from '../../utils/shareEncoder';
import { uploadShareReport } from '../../utils/shareReportService';
import { AuthContext } from '../../context/AuthContext';

export default function ShareButton({ results, systemHistory }) {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const handleShare = async () => {
    if (!results || !systemHistory?.length) {
      setError('数据不完整，无法分享');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const uploadResult = await uploadShareReport({
        results,
        history: systemHistory,
        userId: user?.email || null,
      });

      if (!uploadResult.success) {
        setError(uploadResult.error);
        return;
      }

      const shareUrl = generateUserShareUrl(uploadResult.shareCode);

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      if (isUsingLocalShareOrigin()) {
        setError('当前复制的是 localhost 链接，仅你本机可打开。部署后请配置 VITE_PUBLIC_APP_URL。');
      }

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('分享失败:', err);
      setError('复制失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        disabled={isLoading}
        className="glass-btn flex-1 flex items-center justify-center gap-2 text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Link className="w-4 h-4" />
        )}
        {isLoading ? '生成链接...' : copied ? '已复制' : '分享链接'}
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

      <AnimatePresence>
        {copied && !error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-50 text-green-600 text-xs px-3 py-1.5 rounded-full border border-green-200 whitespace-nowrap"
          >
            链接已复制到剪贴板
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
