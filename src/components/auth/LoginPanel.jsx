import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, AlertCircle, ArrowLeft, CheckCircle, KeyRound } from 'lucide-react';
import { register, login, sendResetOTP, verifyOTPAndResetPassword } from '../../utils/authService';

export default function LoginPanel({ isOpen, onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [step, setStep] = useState(1); // 1: 输入邮箱, 2: 输入验证码和新密码

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email) {
      setError('请填写邮箱');
      setLoading(false);
      return;
    }

    if (mode === 'register') {
      if (!password) {
        setError('请填写密码');
        setLoading(false);
        return;
      }
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

      const result = await register(email, password);
      if (result.success) {
        if (result.message) {
          setSuccess(result.message);
        } else {
          onClose();
          resetForm();
        }
      } else {
        setError(result.error);
      }
    } else if (mode === 'login') {
      if (!password) {
        setError('请填写密码');
        setLoading(false);
        return;
      }

      const result = await login(email, password);
      if (result.success) {
        onClose();
        resetForm();
      } else {
        setError(result.error);
      }
    }

    setLoading(false);
  };

  const handleSendCode = async () => {
    if (!email) {
      setError('请填写邮箱');
      return;
    }

    setError('');
    setLoading(true);

    const result = await sendResetOTP(email);
    if (result.success) {
      setSuccess(result.message);
      setStep(2);
      setCountdown(60);

      // 倒计时
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!verifyCode) {
      setError('请输入验证码');
      return;
    }
    if (!newPassword) {
      setError('请输入新密码');
      return;
    }
    if (newPassword.length < 6) {
      setError('密码至少需要6位');
      return;
    }

    setError('');
    setLoading(true);

    const result = await verifyOTPAndResetPassword(email, verifyCode, newPassword);
    if (result.success) {
      setSuccess('密码重置成功！即将跳转登录...');
      setTimeout(() => {
        setMode('login');
        setStep(1);
        setPassword('');
        setVerifyCode('');
        setNewPassword('');
        setError('');
        setSuccess('');
      }, 2000);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setVerifyCode('');
    setNewPassword('');
    setError('');
    setSuccess('');
    setStep(1);
    setCountdown(0);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    setStep(1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
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
              <div className="flex items-center gap-3 mb-6">
                {mode === 'forgot' && step === 2 && (
                  <button
                    onClick={() => setStep(1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5"
                  >
                    <ArrowLeft className="w-4 h-4 text-navy/60" />
                  </button>
                )}
                {mode === 'forgot' && step === 2 ? (
                  <h2 className="text-xl font-semibold text-navy">输入验证码</h2>
                ) : (
                  <h2 className="text-xl font-semibold text-navy">
                    {mode === 'login' ? '欢迎回来' : mode === 'register' ? '创建账号' : '重置密码'}
                  </h2>
                )}
              </div>

              {/* 登录/注册表单 */}
              {mode !== 'forgot' && (
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
                      placeholder="密码（至少6位）"
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

                  {/* 忘记密码（登录模式） */}
                  {mode === 'login' && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        className="text-sm text-muted hover:text-navy underline underline-offset-2"
                      >
                        忘记密码？
                      </button>
                    </div>
                  )}

                  {/* 错误提示 */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-lg px-4 py-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {/* 成功提示 */}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-green-600 text-sm bg-green-50 rounded-lg px-4 py-2"
                    >
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>{success}</span>
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
                          onClick={() => switchMode('register')}
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
                          onClick={() => switchMode('login')}
                          className="text-navy font-medium underline underline-offset-2 ml-1 hover:no-underline"
                        >
                          立即登录
                        </button>
                      </>
                    )}
                  </div>
                </form>
              )}

              {/* 忘记密码 - 第一步：输入邮箱 */}
              {mode === 'forgot' && step === 1 && (
                <div className="flex-1 flex flex-col gap-4">
                  <p className="text-sm text-muted mb-2">输入注册邮箱，我们将发送验证码到您的邮箱</p>

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

                  {/* 发送按钮 */}
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={loading || countdown > 0}
                    className="w-full py-3 rounded-2xl bg-navy text-white font-semibold text-sm tracking-wide hover:bg-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '发送中...' : countdown > 0 ? `${countdown}秒后可重发` : '发送验证码'}
                  </button>

                  {/* 返回登录 */}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-sm text-muted hover:text-navy underline underline-offset-2"
                  >
                    返回登录
                  </button>

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

                  {/* 成功提示 */}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-green-600 text-sm bg-green-50 rounded-lg px-4 py-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {success}
                    </motion.div>
                  )}
                </div>
              )}

              {/* 忘记密码 - 第二步：输入验证码和新密码 */}
              {mode === 'forgot' && step === 2 && (
                <div className="flex-1 flex flex-col gap-4">
                  <p className="text-sm text-muted">验证码已发送到 <span className="text-navy font-medium">{email}</span></p>

                  {/* 验证码 */}
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="text"
                      placeholder="8位验证码"
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      maxLength={8}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-kraft/30 border border-white/60 text-navy placeholder:text-muted/60 focus:outline-none focus:border-navy/40 focus:bg-kraft/50 transition-all text-center tracking-widest text-lg"
                    />
                  </div>

                  {/* 新密码 */}
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="password"
                      placeholder="新密码（至少6位）"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-kraft/30 border border-white/60 text-navy placeholder:text-muted/60 focus:outline-none focus:border-navy/40 focus:bg-kraft/50 transition-all"
                    />
                  </div>

                  {/* 重置按钮 */}
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={loading || verifyCode.length !== 8 || newPassword.length < 6}
                    className="w-full py-3 rounded-2xl bg-navy text-white font-semibold text-sm tracking-wide hover:bg-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '处理中...' : '确认重置密码'}
                  </button>

                  {/* 重新发送 */}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-muted hover:text-navy underline underline-offset-2"
                  >
                    重新发送验证码
                  </button>

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

                  {/* 成功提示 */}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-green-600 text-sm bg-green-50 rounded-lg px-4 py-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {success}
                    </motion.div>
                  )}
                </div>
              )}

              {/* 底部装饰 */}
              <div className="flex justify-center gap-1.5 mt-auto pt-6">
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