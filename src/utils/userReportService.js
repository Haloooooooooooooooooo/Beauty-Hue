/**
 * 用户报告服务
 * 保存和获取用户的色彩诊断报告
 */

import { supabase } from '../lib/supabase';
import { SEASONS } from '../data/seasonColors';

/**
 * 生成报告标题（日期 + 季型）
 * @param {Object} primaryResult - 主季型结果
 * @returns {string} 标题
 */
function generateTitle(primaryResult) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const seasonName = primaryResult?.key ? SEASONS[primaryResult.key]?.nameCN : '未知';
  return `${month}月${day}日 · ${seasonName}型`;
}

/**
 * 保存用户报告
 * @param {Object} params - 参数
 * @param {string} params.userId - 用户邮箱
 * @param {Array} params.results - 季型结果
 * @param {Array} params.history - 测试历史
 * @returns {Promise<{ success: boolean, reportId?: string, error?: string }>}
 */
export async function saveUserReport({ userId, results, history }) {
  try {
    const primaryResult = results?.[0];
    const title = generateTitle(primaryResult);

    const { data, error } = await supabase
      .from('user_reports')
      .insert({
        user_id: userId,
        results,
        history,
        title,
      })
      .select('id')
      .single();

    if (error) {
      console.error('保存报告失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true, reportId: data.id };
  } catch (err) {
    console.error('保存报告异常:', err);
    return { success: false, error: '保存失败，请重试' };
  }
}

/**
 * 获取用户所有报告
 * @param {string} userId - 用户邮箱
 * @returns {Promise<{ success: boolean, reports?: Array, error?: string }>}
 */
export async function getUserReports(userId) {
  try {
    const { data, error } = await supabase
      .from('user_reports')
      .select('id, title, results, history, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取报告列表失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true, reports: data };
  } catch (err) {
    console.error('获取报告列表异常:', err);
    return { success: false, error: '获取失败，请重试' };
  }
}

/**
 * 获取单个报告详情
 * @param {string} reportId - 报告 ID
 * @returns {Promise<{ success: boolean, report?: Object, error?: string }>}
 */
export async function getReportDetail(reportId) {
  try {
    const { data, error } = await supabase
      .from('user_reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error) {
      console.error('获取报告详情失败:', error);
      return { success: false, error: '报告不存在' };
    }

    return { success: true, report: data };
  } catch (err) {
    console.error('获取报告详情异常:', err);
    return { success: false, error: '获取失败，请重试' };
  }
}

/**
 * 删除报告
 * @param {string} reportId - 报告 ID
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function deleteUserReport(reportId) {
  try {
    const { error } = await supabase
      .from('user_reports')
      .delete()
      .eq('id', reportId);

    if (error) {
      console.error('删除报告失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('删除报告异常:', err);
    return { success: false, error: '删除失败，请重试' };
  }
}