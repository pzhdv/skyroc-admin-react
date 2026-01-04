/** 文件上传结果类型 */
export type UploadResult = {
  /** 错误信息(失败时) */
  errorMessage: string;
  /** 原始文件名 */
  fileName: string;
  /** 文件大小(字节) */
  fileSize: number;
  /** 文件访问URL */
  fileUrl: string;
  /** 是否上传成功 */
  success: boolean;
};
