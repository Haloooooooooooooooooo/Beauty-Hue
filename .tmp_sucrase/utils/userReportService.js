"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * 用户报告服务
 * 保存和获取用户的色彩诊断报告
 */

var _supabase = require('../lib/supabase');
var _seasonColors = require('../data/seasonColors');

/**
 * 生成报告标题（日期 + 季型）
 * @param {Object} primaryResult - 主季型结果
 * @returns {string} 标题
 */
function generateTitle(primaryResult) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const seasonName = _optionalChain([primaryResult, 'optionalAccess', _ => _.key]) ? _optionalChain([_seasonColors.SEASONS, 'access', _2 => _2[primaryResult.key], 'optionalAccess', _3 => _3.nameCN]) : '未知';
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
 async function saveUserReport({ userId, results, history }) {
  try {
    const primaryResult = _optionalChain([results, 'optionalAccess', _4 => _4[0]]);
    const title = generateTitle(primaryResult);

    const { data, error } = await _supabase.supabase
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
} exports.saveUserReport = saveUserReport;

/**
 * 获取用户所有报告
 * @param {string} userId - 用户邮箱
 * @returns {Promise<{ success: boolean, reports?: Array, error?: string }>}
 */
 async function getUserReports(userId) {
  try {
    const { data, error } = await _supabase.supabase
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
} exports.getUserReports = getUserReports;

/**
 * 获取单个报告详情
 * @param {string} reportId - 报告 ID
 * @returns {Promise<{ success: boolean, report?: Object, error?: string }>}
 */
 async function getReportDetail(reportId) {
  try {
    const { data, error } = await _supabase.supabase
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
} exports.getReportDetail = getReportDetail;

/**
 * 删除报告
 * @param {string} reportId - 报告 ID
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
 async function deleteUserReport(reportId) {
  try {
    const { error } = await _supabase.supabase
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
} exports.deleteUserReport = deleteUserReport;