"use strict";const _jsxFileName = "src\\components\\auth\\LoginPanel.jsx";Object.defineProperty(exports, "__esModule", {value: true});var _react = require('react');
var _framermotion = require('framer-motion');
var _lucidereact = require('lucide-react');
var _authService = require('../../utils/authService');

 function LoginPanel({ isOpen, onClose }) {
  const [mode, setMode] = _react.useState.call(void 0, 'login'); // 'login' | 'register' | 'forgot'
  const [step, setStep] = _react.useState.call(void 0, 1); // 1: 输入邮箱, 2: 输入验证码和新密码

  const [email, setEmail] = _react.useState.call(void 0, '');
  const [password, setPassword] = _react.useState.call(void 0, '');
  const [confirmPassword, setConfirmPassword] = _react.useState.call(void 0, '');
  const [verifyCode, setVerifyCode] = _react.useState.call(void 0, '');
  const [newPassword, setNewPassword] = _react.useState.call(void 0, '');

  const [error, setError] = _react.useState.call(void 0, '');
  const [success, setSuccess] = _react.useState.call(void 0, '');
  const [loading, setLoading] = _react.useState.call(void 0, false);
  const [countdown, setCountdown] = _react.useState.call(void 0, 0);

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

      const result = await _authService.register.call(void 0, email, password);
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

      const result = await _authService.login.call(void 0, email, password);
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

    const result = await _authService.sendResetOTP.call(void 0, email);
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

    const result = await _authService.verifyOTPAndResetPassword.call(void 0, email, verifyCode, newPassword);
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
    React.createElement(_framermotion.AnimatePresence, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 168}}
      , isOpen && (
        React.createElement(React.Fragment, null
          /* 背景遮罩 */
          , React.createElement(_framermotion.motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            onClick: onClose,
            className: "fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}}
          )

          /* 右侧滑入面板 */
          , React.createElement(_framermotion.motion.div, {
            initial: { x: '100%' },
            animate: { x: 0 },
            exit: { x: '100%' },
            transition: { type: 'spring', damping: 25, stiffness: 200 },
            className: "fixed right-0 top-0 bottom-0 z-50 w-[380px] bg-white/95 backdrop-blur-xl shadow-2xl border-l border-white/50"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}

            , React.createElement('div', { className: "h-full flex flex-col p-8"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}
              /* 关闭按钮 */
              , React.createElement('button', {
                onClick: onClose,
                className: "absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 190}}

                , React.createElement(_lucidereact.X, { className: "w-5 h-5 text-navy/60"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 194}} )
              )

              /* Logo */
              , React.createElement('div', { className: "text-center mb-8 mt-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}
                , React.createElement('h1', { className: "text-2xl font-bold text-navy tracking-wide"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 199}}, "Beauty Hue" )
                , React.createElement('p', { className: "text-xs text-muted mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}, "个人色彩诊断工作室")
              )

              /* 标题 */
              , React.createElement('div', { className: "flex items-center gap-3 mb-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}
                , mode === 'forgot' && step === 2 && (
                  React.createElement('button', {
                    onClick: () => setStep(1),
                    className: "w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 206}}

                    , React.createElement(_lucidereact.ArrowLeft, { className: "w-4 h-4 text-navy/60"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 210}} )
                  )
                )
                , mode === 'forgot' && step === 2 ? (
                  React.createElement('h2', { className: "text-xl font-semibold text-navy"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 214}}, "输入验证码")
                ) : (
                  React.createElement('h2', { className: "text-xl font-semibold text-navy"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}
                    , mode === 'login' ? '欢迎回来' : mode === 'register' ? '创建账号' : '重置密码'
                  )
                )
              )

              /* 登录/注册表单 */
              , mode !== 'forgot' && (
                React.createElement('form', { onSubmit: handleSubmit, className: "flex-1 flex flex-col gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 224}}
                  /* 邮箱 */
                  , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 226}}
                    , React.createElement(_lucidereact.Mail, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 227}} )
                    , React.createElement('input', {
                      type: "email",
                      placeholder: "邮箱",
                      value: email,
                      onChange: (e) => setEmail(e.target.value),
                      className: "w-full pl-12 pr-4 py-3 rounded-xl bg-kraft/30 border border-white/60 text-navy placeholder:text-muted/60 focus:outline-none focus:border-navy/40 focus:bg-kraft/50 transition-all"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}
                    )
                  )

                  /* 密码 */
                  , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 238}}
                    , React.createElement(_lucidereact.Lock, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 239}} )
                    , React.createElement('input', {
                      type: "password",
                      placeholder: "密码（至少6位）",
                      value: password,
                      onChange: (e) => setPassword(e.target.value),
                      className: "w-full pl-12 pr-4 py-3 rounded-xl bg-kraft/30 border border-white/60 text-navy placeholder:text-muted/60 focus:outline-none focus:border-navy/40 focus:bg-kraft/50 transition-all"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 240}}
                    )
                  )

                  /* 确认密码（注册模式） */
                  , mode === 'register' && (
                    React.createElement(_framermotion.motion.div, {
                      initial: { opacity: 0, height: 0 },
                      animate: { opacity: 1, height: 'auto' },
                      className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}}

                      , React.createElement(_lucidereact.Lock, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}} )
                      , React.createElement('input', {
                        type: "password",
                        placeholder: "确认密码",
                        value: confirmPassword,
                        onChange: (e) => setConfirmPassword(e.target.value),
                        className: "w-full pl-12 pr-4 py-3 rounded-xl bg-kraft/30 border border-white/60 text-navy placeholder:text-muted/60 focus:outline-none focus:border-navy/40 focus:bg-kraft/50 transition-all"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 257}}
                      )
                    )
                  )

                  /* 忘记密码（登录模式） */
                  , mode === 'login' && (
                    React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}
                      , React.createElement('button', {
                        type: "button",
                        onClick: () => switchMode('forgot'),
                        className: "text-sm text-muted hover:text-navy underline underline-offset-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}
, "忘记密码？"

                      )
                    )
                  )

                  /* 错误提示 */
                  , error && (
                    React.createElement(_framermotion.motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-lg px-4 py-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}

                      , React.createElement(_lucidereact.AlertCircle, { className: "w-4 h-4 shrink-0"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 287}} )
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 288}}, error)
                    )
                  )

                  /* 成功提示 */
                  , success && (
                    React.createElement(_framermotion.motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "flex items-center gap-2 text-green-600 text-sm bg-green-50 rounded-lg px-4 py-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}}

                      , React.createElement(_lucidereact.CheckCircle, { className: "w-4 h-4 shrink-0"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 299}} )
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 300}}, success)
                    )
                  )

                  /* 提交按钮 */
                  , React.createElement('button', {
                    type: "submit",
                    disabled: loading,
                    className: "w-full py-3 rounded-2xl bg-navy text-white font-semibold text-sm tracking-wide hover:bg-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}}

                    , loading ? '处理中...' : mode === 'login' ? '登 录' : '注 册'
                  )

                  /* 切换模式 */
                  , React.createElement('div', { className: "text-center text-sm text-muted mt-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 314}}
                    , mode === 'login' ? (
                      React.createElement(React.Fragment, null, "还没有账号？"

                        , React.createElement('button', {
                          type: "button",
                          onClick: () => switchMode('register'),
                          className: "text-navy font-medium underline underline-offset-2 ml-1 hover:no-underline"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 318}}
, "立即注册"

                        )
                      )
                    ) : (
                      React.createElement(React.Fragment, null, "已有账号？"

                        , React.createElement('button', {
                          type: "button",
                          onClick: () => switchMode('login'),
                          className: "text-navy font-medium underline underline-offset-2 ml-1 hover:no-underline"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 329}}
, "立即登录"

                        )
                      )
                    )
                  )
                )
              )

              /* 忘记密码 - 第一步：输入邮箱 */
              , mode === 'forgot' && step === 1 && (
                React.createElement('div', { className: "flex-1 flex flex-col gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 344}}
                  , React.createElement('p', { className: "text-sm text-muted mb-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 345}}, "输入注册邮箱，我们将发送验证码到您的邮箱")

                  /* 邮箱 */
                  , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 348}}
                    , React.createElement(_lucidereact.Mail, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 349}} )
                    , React.createElement('input', {
                      type: "email",
                      placeholder: "邮箱",
                      value: email,
                      onChange: (e) => setEmail(e.target.value),
                      className: "w-full pl-12 pr-4 py-3 rounded-xl bg-kraft/30 border border-white/60 text-navy placeholder:text-muted/60 focus:outline-none focus:border-navy/40 focus:bg-kraft/50 transition-all"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 350}}
                    )
                  )

                  /* 发送按钮 */
                  , React.createElement('button', {
                    type: "button",
                    onClick: handleSendCode,
                    disabled: loading || countdown > 0,
                    className: "w-full py-3 rounded-2xl bg-navy text-white font-semibold text-sm tracking-wide hover:bg-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 360}}

                    , loading ? '发送中...' : countdown > 0 ? `${countdown}秒后可重发` : '发送验证码'
                  )

                  /* 返回登录 */
                  , React.createElement('button', {
                    type: "button",
                    onClick: () => switchMode('login'),
                    className: "text-sm text-muted hover:text-navy underline underline-offset-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 370}}
, "返回登录"

                  )

                  /* 错误提示 */
                  , error && (
                    React.createElement(_framermotion.motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-lg px-4 py-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 380}}

                      , React.createElement(_lucidereact.AlertCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 385}} )
                      , error
                    )
                  )

                  /* 成功提示 */
                  , success && (
                    React.createElement(_framermotion.motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "flex items-center gap-2 text-green-600 text-sm bg-green-50 rounded-lg px-4 py-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 392}}

                      , React.createElement(_lucidereact.CheckCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 397}} )
                      , success
                    )
                  )
                )
              )

              /* 忘记密码 - 第二步：输入验证码和新密码 */
              , mode === 'forgot' && step === 2 && (
                React.createElement('div', { className: "flex-1 flex flex-col gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 406}}
                  , React.createElement('p', { className: "text-sm text-muted" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 407}}, "验证码已发送到 " , React.createElement('span', { className: "text-navy font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 407}}, email))

                  /* 验证码 */
                  , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 410}}
                    , React.createElement(_lucidereact.KeyRound, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 411}} )
                    , React.createElement('input', {
                      type: "text",
                      placeholder: "8位验证码",
                      value: verifyCode,
                      onChange: (e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 8)),
                      maxLength: 8,
                      className: "w-full pl-12 pr-4 py-3 rounded-xl bg-kraft/30 border border-white/60 text-navy placeholder:text-muted/60 focus:outline-none focus:border-navy/40 focus:bg-kraft/50 transition-all text-center tracking-widest text-lg"                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 412}}
                    )
                  )

                  /* 新密码 */
                  , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 423}}
                    , React.createElement(_lucidereact.Lock, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}} )
                    , React.createElement('input', {
                      type: "password",
                      placeholder: "新密码（至少6位）",
                      value: newPassword,
                      onChange: (e) => setNewPassword(e.target.value),
                      className: "w-full pl-12 pr-4 py-3 rounded-xl bg-kraft/30 border border-white/60 text-navy placeholder:text-muted/60 focus:outline-none focus:border-navy/40 focus:bg-kraft/50 transition-all"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 425}}
                    )
                  )

                  /* 重置按钮 */
                  , React.createElement('button', {
                    type: "button",
                    onClick: handleResetPassword,
                    disabled: loading || verifyCode.length !== 8 || newPassword.length < 6,
                    className: "w-full py-3 rounded-2xl bg-navy text-white font-semibold text-sm tracking-wide hover:bg-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 435}}

                    , loading ? '处理中...' : '确认重置密码'
                  )

                  /* 重新发送 */
                  , React.createElement('button', {
                    type: "button",
                    onClick: () => setStep(1),
                    className: "text-sm text-muted hover:text-navy underline underline-offset-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 445}}
, "重新发送验证码"

                  )

                  /* 错误提示 */
                  , error && (
                    React.createElement(_framermotion.motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-lg px-4 py-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 455}}

                      , React.createElement(_lucidereact.AlertCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 460}} )
                      , error
                    )
                  )

                  /* 成功提示 */
                  , success && (
                    React.createElement(_framermotion.motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "flex items-center gap-2 text-green-600 text-sm bg-green-50 rounded-lg px-4 py-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 467}}

                      , React.createElement(_lucidereact.CheckCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 472}} )
                      , success
                    )
                  )
                )
              )

              /* 底部装饰 */
              , React.createElement('div', { className: "flex justify-center gap-1.5 mt-auto pt-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 480}}
                , ['#FF3A3A', '#FF5533', '#FF99CC', '#AAD4F2', '#0088DD', '#8888CC', '#EE8877', '#FFAA00', '#CC5555', '#FF0000', '#0000FF', '#00FFFF'].map((color, i) => (
                  React.createElement('div', {
                    key: i,
                    className: "w-4 h-4 rounded-full opacity-40"   ,
                    style: { backgroundColor: color }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 482}}
                  )
                ))
              )
            )
          )
        )
      )
    )
  );
} exports.default = LoginPanel;