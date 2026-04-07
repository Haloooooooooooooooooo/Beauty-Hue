/**
 * 分享报告上传服务
 * 将诊断数据上传到 Supabase，生成短链接
 */

import { supabase } from '../lib/supabase';

/**
 * 生成随机分享码
 * @param {number} length - 长度，默认12位
 * @returns {string} 随机码
 */
function generateShareCode(length = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 上传分享报告到数据库
 * @param {Object} params - 参数
 * @param {Array} params.results - 季型结果
 * @param {Array} params.history - 测试历史
 * @param {string} [params.userId] - 用户 ID（可选）
 * @returns {Promise<{ success: boolean, shareCode?: string, error?: string }>}
 */
export async function uploadShareReport({ results, history, userId }) {
  try {
    // 生成分享码
    const shareCode = generateShareCode();

    // 准备数据
    const reportData = {
      share_code: shareCode,
      results: results,
      history: history,
      user_id: userId || null,
    };

    // 插入数据库
    const { data, error } = await supabase.from('share_reports').insert(reportData).select('share_code').single();

    if (error) {
      console.error('上传分享报告失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true, shareCode: data.share_code };
  } catch (err) {
    console.error('上传分享报告异常:', err);
    return { success: false, error: '上传失败，请重试' };
  }
}

/**
 * 通过分享码获取分享报告
 * @param {string} shareCode - 分享码
 * @returns {Promise<{ success: boolean, data?: Object, error?: string }>}
 */
export async function getShareReport(shareCode) {
  try {
    const { data, error } = await supabase
      .from('share_reports')
      .select('results, history, created_at')
      .eq('share_code', shareCode)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error) {
      console.error('获取分享报告失败:', error);
      return { success: false, error: '报告不存在或已过期' };
    }

    return { success: true, data };
  } catch (err) {
    console.error('获取分享报告异常:', err);
    return { success: false, error: '获取失败，请重试' };
  }
}