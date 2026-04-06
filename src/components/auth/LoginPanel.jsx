import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPanel({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('请填写邮箱和密码');
      setLoading(false);
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('两次密码不一致');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('密码至少需要6位');
        setLoading(false);
        return;
      }
      const result = register(email, password);
      if (result.success) {
        onClose();
        resetForm();
      } else {
        setError(result.error);
      }
    } else {
      const result = login(email, password);
      if (result.success) {
        onClose();
        resetForm();
      } else {
        setError(result.error);
      }
    }

    setLoading(false);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩（点击关闭） */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
          />

          {/* 右侧滑入面板 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-[380px] bg-white/95 backdrop-blur-xl shadow-2xl border-l border-white/50"
          >
            <div className="h-full flex flex-col p-8">
              {/* 关闭按钮 */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5 text-navy/60" />
              </button>

              {/* Logo */}
              <div className="text-center mb-8 mt-4">
                <h1 className="text-2xl font-bold text-navy tracking-wide">Beauty Hue</h1>
                <p className="text-xs text-muted mt-1">个人色彩诊断工作室</p>
              </div>

              {/* 标题 */}
              <h2 className="text-xl font-semibold text-navy mb-6">
                {mode === 'login' ? '欢迎回来' : '创建账号'}
              </h2>

              {/* 表单 */}
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
                {/* 邮箱 */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="email"
                    placeholder="邮箱"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-kraft/30 border border-white/60 text-navy placeholder:text-muted/60 focus:outline-none focus:border-navy/40 focus:bg-kraft/50 transition-all"
                  />
                </div>

                {/* 密码 */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="password"
                    placeholder="密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-kraft/30 border border-white/60 text-navy placeholder:text-muted/60 focus:outline-none focus:border-navy/40 focus:bg-kraft/50 transition-all"
                  />
                </div>

                {/* 确认密码（注册模式） */}
                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="relative"
                  >
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="password"
                      placeholder="确认密码"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-kraft/30 border border-white/60 text-navy placeholder:text-muted/60 focus:outline-none focus:border-navy/40 focus:bg-kraft/50 transition-all"
                    />
                  </motion.div>
                )}

                {/* 错误提示 */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-lg px-4 py-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}

                {/* 提交按钮 */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-navy text-white font-semibold text-sm tracking-wide hover:bg-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? '处理中...' : mode === 'login' ? '登 录' : '注 册'}
                </button>

                {/* 切换模式 */}
                <div className="text-center text-sm text-muted mt-4">
                  {mode === 'login' ? (
                    <>
                      还没有账号？
                      <button
                        type="button"
                        onClick={switchMode}
                        className="text-navy font-medium underline underline-offset-2 ml-1 hover:no-underline"
                      >
                        立即注册
                      </button>
                    </>
                  ) : (
                    <>
                      已有账号？
                      <button
                        type="button"
                        onClick={switchMode}
                        className="text-navy font-medium underline underline-offset-2 ml-1 hover:no-underline"
                      >
                        立即登录
                      </button>
                    </>
                  )}
                </div>
              </form>

              {/* 底部装饰 */}
              <div className="flex justify-center gap-1.5 mt-6">
                {['#FF3A3A', '#FF5533', '#FF99CC', '#AAD4F2', '#0088DD', '#8888CC', '#EE8877', '#FFAA00', '#CC5555', '#FF0000', '#0000FF', '#00FFFF'].map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full opacity-40"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}