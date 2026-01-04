import { request } from '../request';
import type { UploadResult } from '../types/file';
/**
 * 单文件上传
 *
 * @param file 上传的文件
 * @returns 返回上传结果
 */
export const fetchUploadFileInterface = (file: File) => {
  if (!file) {
    return Promise.reject(new Error('请选择上传文件'));
  }
  const formData = new FormData();
  formData.append('file', file);

  return request<UploadResult>({
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    url: '/upload/single'
  });
};

/**
 * 多文件上传
 *
 * @param files 上传的文件列表
 * @returns 返回上传结果列表
 */
export const fetchUploadFileListInterface = (files: File[]) => {
  // 校验文件列表是否为空
  if (!files || !Array.isArray(files) || files.length === 0) {
    return Promise.reject(new Error('请选择上传文件'));
  }

  const formData = new FormData();
  // 添加所有文件到表单数据
  files.forEach(file => {
    formData.append('files', file);
  });

  return request<UploadResult[]>({
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    url: '/upload/batch'
  });
};
