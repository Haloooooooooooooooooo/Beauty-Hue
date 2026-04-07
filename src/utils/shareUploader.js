/**
 * 分享卡片上传工具
 * 将生成的分享卡片上传到 Supabase Storage，返回带过期时间的签名 URL
 */

import { supabase, STORAGE_BUCKET } from '../lib/supabase';

/**
 * 上传分享卡片到 Supabase Storage
 * @param {Blob} blob - 图片 Blob
 * @returns {Promise<{ success: boolean, url?: string, error?: string }>}
 */
export async function uploadShareCard(blob) {
  try {
    // 生成唯一文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `share-${timestamp}-${randomStr}.png`;

    // 上传到 Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, blob, {
        contentType: 'image/png',
        cacheControl: '3600', // 1小时缓存
      });

    if (error) {
      console.error('上传失败:', error);
      return { success: false, error: error.message };
    }

    // 生成带过期时间的签名 URL（7天有效）
    const { data: urlData, error: urlError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(fileName, 7 * 24 * 60 * 60); // 7天

    if (urlError) {
      console.error('生成签名 URL 失败:', urlError);
      return { success: false, error: urlError.message };
    }

    return { success: true, url: urlData.signedUrl };
  } catch (err) {
    console.error('上传异常:', err);
    return { success: false, error: '上传失败，请重试' };
  }
}