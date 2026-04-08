"use strict";const _jsxFileName = "src\\context\\AuthContext.jsx";Object.defineProperty(exports, "__esModule", {value: true});var _react = require('react');
var _authService = require('../utils/authService');

 const AuthContext = _react.createContext.call(void 0, null); exports.AuthContext = AuthContext;

 function AuthProvider({ children }) {
  const [user, setUser] = _react.useState.call(void 0, null);
  const [loading, setLoading] = _react.useState.call(void 0, true);
  const [initialized, setInitialized] = _react.useState.call(void 0, false);

  _react.useEffect.call(void 0, () => {
    let mounted = true;

    async function hydrateCurrentUser() {
      try {
        const { user: currentUser } = await _authService.getCurrentUser.call(void 0, );
        if (!mounted) return;

        setUser(currentUser || null);
        if (currentUser) {
          localStorage.setItem('beautyHue_user', JSON.stringify(currentUser));
        } else {
          localStorage.removeItem('beautyHue_user');
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        if (mounted) {
          setInitialized(true);
          setLoading(false);
        }
      }
    }

    const unsubscribe = _authService.onAuthStateChange.call(void 0, ({ user: nextUser }) => {
      if (!mounted) return;

      setUser(nextUser);
      if (nextUser) {
        localStorage.setItem('beautyHue_user', JSON.stringify(nextUser));
      } else {
        localStorage.removeItem('beautyHue_user');
      }

      setInitialized(true);
      setLoading(false);
    });

    hydrateCurrentUser();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    await _authService.logout.call(void 0, );
    setUser(null);
    localStorage.removeItem('beautyHue_user');
  };

  return (
    React.createElement(exports.AuthContext.Provider, { value: { user, logout, loading, initialized }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
      , children
    )
  );
} exports.AuthProvider = AuthProvider;

 function useAuth() {
  const context = _react.useContext.call(void 0, exports.AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
} exports.useAuth = useAuth;
