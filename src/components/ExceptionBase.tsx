import { selectRouteHomePath } from '@/features/router/routeStore';

import SvgIcon from './SvgIcon';

type ExceptionType = '403' | '404' | '500';

interface Props {
  /**
   * Exception type
   *
   * - 403: no permission
   * - 404: not found
   * - 500: service error
   */
  type: ExceptionType;
}
const iconMap: Record<ExceptionType, string> = {
  '403': 'no-permission',
  '404': 'not-found',
  '500': 'service-error'
};

// 异常页面描述映射
const descKeyMap: Record<ExceptionType, string> = {
  '403': 'page.exception.noPermission.desc',
  '404': 'page.exception.notFound.desc',
  '500': 'page.exception.serverError.desc'
};

const ExceptionBase: FC<Props> = memo(({ type }) => {
  const { t } = useTranslation();
  const nav = useNavigate();

  // 从 store 获取首页路径
  const homePath = useAppSelector(selectRouteHomePath);

  // 获取描述文本
  const descText = t(descKeyMap[type]);

  const onClick = () => {
    nav(homePath);
  };

  return (
    <div className="size-full min-h-520px flex-col-center gap-24px overflow-hidden">
      <div className="flex text-400px text-primary">
        <SvgIcon localIcon={iconMap[type]} />
      </div>
      <p className="text-16px">{descText}</p>
      <AButton
        type="primary"
        onClick={onClick}
      >
        {t('common.backToHome')}
      </AButton>
    </div>
  );
});

export default ExceptionBase;
