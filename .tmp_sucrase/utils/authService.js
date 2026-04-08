"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * 用户认证服务
 * 使用 Supabase Auth 实现邮箱+密码登录、验证码重置密码
 */

var _supabase = require('../lib/supabase');

/**
 * 用户注册
 */
 async function register(email, password) {
  try {
    const { data, error } = await _supabase.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return { success: false, error: '该邮箱已被注册' };
      }
      if (error.message.includes('Password')) {
        return { success: false, error: '密码至少需要 6 位' };
      }
      return { success: false, error: error.message };
    }

    if (data.user && !data.session) {
      return {
        success: true,
        user: { email: data.user.email, id: data.user.id },
        message: '注册成功，请检查邮箱完成验证后登录'
      };
    }

    return {
      success: true,
      user: { email: data.user.email, id: data.user.id }
    };
  } catch (err) {
    console.error('注册异常:', err);
    return { success: false, error: '注册失败，请重试' };
  }
} exports.register = register;

/**
 * 用户登录
 */
 async function login(email, password) {
  try {
    const { data, error } = await _supabase.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: '邮箱或密码错误' };
      }
      if (error.message.includes('Email not confirmed')) {
        return { success: false, error: '请先验证邮箱后再登录' };
      }
      return { success: false, error: error.message };
    }

    return {
      success: true,
      user: { email: data.user.email, id: data.user.id }
    };
  } catch (err) {
    console.error('登录异常:', err);
    return { success: false, error: '登录失败，请重试' };
  }
} exports.login = login;

/**
 * 发送重置密码验证码
 */
 async function sendResetOTP(email) {
  try {
    const { error } = await _supabase.supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: undefined,
      },
    });

    if (error) {
      console.error('Send OTP error:', error);
      if (error.message.includes('Sign up') || error.status === 400) {
        return { success: false, error: '该邮箱未注册' };
      }
      return { success: false, error: `发送失败: ${error.message}` };
    }

    return { success: true, message: '验证码已发送到您的邮箱，请查收' };
  } catch (err) {
    console.error('发送验证码异常:', err);
    return { success: false, error: '发送失败，请重试' };
  }
} exports.sendResetOTP = sendResetOTP;

/**
 * 验证 OTP 并设置新密码
 */
 async function verifyOTPAndResetPassword(email, token, newPassword) {
  try {
    const { error: verifyError } = await _supabase.supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (verifyError) {
      console.error('Verify OTP error:', verifyError);
      if (verifyError.message.includes('invalid') || verifyError.message.includes('expired')) {
        return { success: false, error: '验证码无效或已过期' };
      }
      return { success: false, error: `验证失败: ${verifyError.message}` };
    }

    const { error: updateError } = await _supabase.supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      console.error('Update password error:', updateError);
      return { success: false, error: `密码更新失败: ${updateError.message}` };
    }

    return { success: true, message: '密码重置成功' };
  } catch (err) {
    console.error('验证异常:', err);
    return { success: false, error: '验证失败，请重试' };
  }
} exports.verifyOTPAndResetPassword = verifyOTPAndResetPassword;

/**
 * 获取当前登录用户
 */
 async function getCurrentUser() {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await _supabase.supabase.auth.getSession();

    if (sessionError) {
      return { error: sessionError.message };
    }

    if (_optionalChain([session, 'optionalAccess', _ => _.user])) {
      return {
        user: { email: session.user.email, id: session.user.id }
      };
    }

    const {
      data: { user },
      error,
    } = await _supabase.supabase.auth.getUser();

    if (error) {
      return { error: error.message };
    }

    if (!user) {
      return {};
    }

    return {
      user: { email: user.email, id: user.id }
    };
  } catch (err) {
    console.error('获取用户异常:', err);
    return { error: '获取用户信息失败' };
  }
} exports.getCurrentUser = getCurrentUser;

/**
 * 登出
 */
 async function logout() {
  try {
    const { error } = await _supabase.supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('登出异常:', err);
    return { success: false, error: '登出失败' };
  }
} exports.logout = logout;

/**
 * 监听认证状态变化
 */
 function onAuthStateChange(callback) {
  const { data: { subscription } } = _supabase.supabase.auth.onAuthStateChange((event, session) => {
    if (_optionalChain([session, 'optionalAccess', _2 => _2.user])) {
      callback({
        user: { email: session.user.email, id: session.user.id },
        event
      });
      return;
    }

    callback({ user: null, event });
  });

  return () => subscription.unsubscribe();
} exports.onAuthStateChange = onAuthStateChange;
