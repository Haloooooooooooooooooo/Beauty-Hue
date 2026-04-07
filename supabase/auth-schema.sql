-- Supabase 数据库表结构
-- 在 Supabase Dashboard → SQL Editor 执行

-- 用户报告表（不需要单独的 users 表，使用 Supabase Auth）
CREATE TABLE IF NOT EXISTS user_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  results JSONB NOT NULL,
  history JSONB NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_reports_user_id ON user_reports(user_id);

-- 设置 RLS
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- 只允许用户读取自己的报告
CREATE POLICY "Users can read own reports" ON user_reports
  FOR SELECT
  USING (user_id = auth.jwt() ->> 'email');

-- 只允许用户插入自己的报告
CREATE POLICY "Users can insert own reports" ON user_reports
  FOR INSERT
  WITH CHECK (user_id = auth.jwt() ->> 'email');

-- 只允许用户删除自己的报告
CREATE POLICY "Users can delete own reports" ON user_reports
  FOR DELETE
  USING (user_id = auth.jwt() ->> 'email');