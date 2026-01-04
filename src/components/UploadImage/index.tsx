import { DeleteOutlined, EyeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Flex, Image } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { fetchUploadFileInterface } from '@/service/api/common';

import styles from './index.module.scss';
import { ImageBeforeUploadValidate } from './validate';

interface IProps {
  /** 边框圆角，默认 10px */
  borderRadius?: number;
  /** 文件大小限制，默认 2MB */
  fileSize?: number;
  /** 图片高度，默认 160px */
  height?: number;
  /** 初始化图片 URL */
  initFile?: string;
  /** 是否显示删除按钮，默认 true */
  isShowDelete?: boolean;
  /** 是否显示预览按钮，默认 true */
  isShowPreview?: boolean;
  /** 文件改变事件回调 */
  onChange?: (newFile: string | undefined) => void;
  /** 图片宽度，默认 200px */
  width?: number;
}

/**
 * 图片上传组件
 *
 * @param props 组件属性
 * @returns 图片上传组件
 */
export default function UploadImage({
  borderRadius = 10,
  fileSize = 2,
  height = 160,
  initFile = undefined,
  isShowDelete = true,
  isShowPreview = true,
  onChange,
  width = 200
}: IProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const [uploadFile, setUploadFile] = useState<string | undefined>(initFile);
  const [tempUploadImg, setTempUploadImg] = useState<string | undefined>();
  const [isFirst, setIsFirst] = useState(true);

  // 保持 onChangeRef 始终指向最新的 onChange 函数
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // 同步 initFile 到 uploadFile，解决编辑模式下图片不显示的问题
  useEffect(() => {
    setUploadFile(initFile);
    setIsFirst(true); // 重置 isFirst，避免触发 onChange
  }, [initFile]);

  // 当 uploadFile 变化时，调用 onChange 回调（使用 ref 避免依赖 onChange）
  useEffect(() => {
    if (isFirst) return;
    onChangeRef.current?.(uploadFile);
  }, [isFirst, uploadFile]);

  const handleFileUpload = () => {
    if (tempUploadImg || uploadFile) return;
    inputRef.current?.click();
  };

  /**
   * 处理文件上传
   *
   * @param file 上传的文件
   */
  const handleUpload = async (file: File) => {
    try {
      const data = await fetchUploadFileInterface(file);
      if (data && data.success) {
        setUploadFile(data.fileUrl);
        setIsFirst(false);
      }
    } catch (error: any) {
      window.$message?.error({ content: error.message || '图片上传失败' });
    } finally {
      setTempUploadImg(undefined);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const validationResult = ImageBeforeUploadValidate(file, fileSize);
    if (validationResult !== true) {
      window.$message?.error({ content: validationResult });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const imgSrc = event.target?.result as string;
      setTempUploadImg(imgSrc);
    };
    reader.readAsDataURL(file);

    handleUpload(file);
  };

  const handlePreview = (imgUrl: string) => {
    setPreviewImage(imgUrl);
    setPreviewOpen(true);
  };

  const handleDelete = () => {
    setUploadFile(undefined);
    setIsFirst(false);
  };

  return (
    <div className={styles.uploadContainer}>
      <div
        className={`${styles.uploadWrapper} ${styles.uploadImageWrapper}`}
        style={{
          borderRadius: `${borderRadius}px`,
          height: `${height}px`,
          width: `${width}px`
        }}
        onClick={handleFileUpload}
      >
        {tempUploadImg && (
          <div>
            <Image
              height={height}
              preview={false}
              src={tempUploadImg}
              width={width}
            />
            <div className={styles.show}>
              <LoadingOutlined style={{ color: '#fff', fontSize: '24px' }} />
            </div>
          </div>
        )}
        {!tempUploadImg && uploadFile && (
          <>
            <Image
              height={height}
              preview={false}
              src={uploadFile}
              width={width}
            />
            <div className={styles.toolbarWrapper}>
              <Flex gap={10}>
                {isShowPreview && (
                  <EyeOutlined
                    style={{
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '20px'
                    }}
                    onClick={() => handlePreview(uploadFile as string)}
                  />
                )}
                {isShowDelete && (
                  <DeleteOutlined
                    style={{
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '20px'
                    }}
                    onClick={handleDelete}
                  />
                )}
              </Flex>
            </div>
          </>
        )}
        {!tempUploadImg && !uploadFile && <PlusOutlined />}
      </div>

      {previewImage && (
        <Image
          src={previewImage}
          wrapperStyle={{ display: 'none' }}
          preview={{
            afterOpenChange: visible => !visible && setPreviewImage(''),
            onVisibleChange: visible => setPreviewOpen(visible),
            visible: previewOpen
          }}
        />
      )}

      <input
        className={styles.fileInput}
        multiple={false}
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
      />
    </div>
  );
}
