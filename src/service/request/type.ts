/** 请求实例状态接口 用于管理请求过程中的状态信息 */
export interface RequestInstanceState {
  /** 请求错误消息堆栈，用于避免重复显示相同的错误消息 */
  errMsgStack: string[];
  /** 是否正在刷新token，用于防止重复刷新token */
  refreshTokenFn: Promise<boolean> | null;
}
