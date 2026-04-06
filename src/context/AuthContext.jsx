import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从 localStorage 恢复登录状态
    const savedUser = localStorage.getItem('beautyHue_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // 从 localStorage 获取已注册用户
    const users = JSON.parse(localStorage.getItem('beautyHue_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);

    if (found) {
      const userData = { email: found.email };
      setUser(userData);
      localStorage.setItem('beautyHue_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: '邮箱或密码错误' };
  };

  const register = (email, password) => {
    const users = JSON.parse(localStorage.getItem('beautyHue_users') || '[]');

    // 检查邮箱是否已注册
    if (users.find(u => u.email === email)) {
      return { success: false, error: '该邮箱已被注册' };
    }

    // 添加新用户
    users.push({ email, password });
    localStorage.setItem('beautyHue_users', JSON.stringify(users));

    // 自动登录
    const userData = { email };
    setUser(userData);
    localStorage.setItem('beautyHue_user', JSON.stringify(userData));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('beautyHue_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}