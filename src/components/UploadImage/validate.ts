/**
 * 图片上传校验
 *
 * @param file 上传文件
 * @param fileSize 限制文件大小
 * @returns
 */
export const ImageBeforeUploadValidate = (file: File, fileSize: number): string | boolean => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
  if (!isJpgOrPng) {
    return '只能上传JPG/PNG/webp文件!';
  }
  const isLt2M = file.size / 1024 / 1024 < fileSize;
  if (!isLt2M) {
    return `图片必须需小于${fileSize}MB!`;
  }
  return isJpgOrPng && isLt2M;
};
