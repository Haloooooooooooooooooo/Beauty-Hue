import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ChevronRight, History, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import { getUserReports, deleteUserReport } from '../utils/userReportService';
import { SEASONS } from '../data/seasonColors';

export default function HistoryPage({ onOpenLogin }) {
  const navigate = useNavigate();
  const { user, initialized } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    async function fetchReports() {
      if (!initialized) return;

      if (!user) {
        navigate('/');
        return;
      }

      const result = await getUserReports(user.email);
      if (result.success) {
        setReports(result.reports || []);
      } else {
        setError(result.error || '加载历史报告失败');
      }
      setLoading(false);
    }

    fetchReports();
  }, [user, initialized, navigate]);

  const handleViewReport = (report) => {
    localStorage.setItem('beautyHue_historyReport', JSON.stringify(report));
    navigate(`/history-report?id=${report.id}`);
  };

  const handleDeleteReport = async (reportId) => {
    const result = await deleteUserReport(reportId);
    if (result.success) {
      setReports((currentReports) => currentReports.filter((report) => report.id !== reportId));
      setDeleteConfirm(null);
      return;
    }

    setError(result.error || '删除报告失败');
  };

  if (!initialized) {
    return (
      <div className="bg-kraft min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-3 border-navy/20 border-t-navy rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-kraft min-h-screen pb-10">
      <div className="max-w-[1240px] mx-auto px-5 py-6 md:px-6">
        <Navbar onOpenLogin={onOpenLogin} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-3xl border border-white/50 bg-white/40 shadow-2xl backdrop-blur-xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-navy/10">
              <button
                onClick={() => navigate(-1)}
                className="relative z-20 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-navy/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-navy" />
              </button>
              <History className="w-5 h-5 text-navy" />
              <h1 className="text-xl font-bold text-navy">历史报告</h1>
              <span className="text-sm text-muted">共 {reports.length} 份</span>
            </div>

            {loading && (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-10 h-10 border-3 border-navy/20 border-t-navy rounded-full mx-auto"
                />
                <p className="text-muted mt-4">加载中...</p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 rounded-xl p-4">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {!loading && reports.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-navy/30" />
                </div>
                <p className="text-muted mb-4">还没有保存的报告</p>
                <button onClick={() => navigate('/test')} className="btn-cta">
                  开始测试
                </button>
              </div>
            )}

            {!loading && reports.length > 0 && (
              <div className="space-y-3">
                {reports.map((report, index) => {
                  const primaryResult = report.results?.[0];
                  const season = primaryResult ? SEASONS[primaryResult.key] : null;
                  const createdDate = new Date(report.created_at);

                  return (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/30 border border-white/40 hover:bg-white/50 transition-colors"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: season?.extremeColor || '#888' }}
                      >
                        {season?.nameCN?.slice(0, 1) || '?'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-navy truncate">{report.title || '未命名报告'}</h3>
                        <p className="text-sm text-muted">
                          {createdDate.toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                          {' '}
                          {createdDate.toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                          {primaryResult && ` · 评分 ${primaryResult.score?.toFixed(1)}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewReport(report)}
                          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-navy/10 text-navy text-sm font-medium hover:bg-navy/20 transition-colors"
                        >
                          查看
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(report.id)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {deleteConfirm === report.id && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-3 z-10">
                          <span className="text-sm text-muted">确定删除？</span>
                          <button
                            onClick={() => handleDeleteReport(report.id)}
                            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium"
                          >
                            删除
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium"
                          >
                            取消
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        <p className="text-center mt-4 text-[10px] text-muted font-mono tracking-widest">BEAUTY HUE</p>
      </div>
    </div>
  );
}
