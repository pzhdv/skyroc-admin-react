import { enableStatusOptions } from '@/constants/business';
import { translateOptions } from '@/utils/common';

type Props = Page.SearchProps & { pageSelectOptions: CommonType.Option<number>[] };

const ButtonSearch: FC<Props> = memo(({ form, pageSelectOptions, reset, search, searchParams }) => {
  const { t } = useTranslation();

  return (
    <AForm
      form={form}
      initialValues={searchParams}
      labelCol={{
        md: 7,
        span: 5
      }}
    >
      <ARow
        wrap
        gutter={[16, 16]}
      >
        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <AForm.Item
            className="m-0"
            label={t('page.manage.button.selectMenuName')}
            name="menuId"
          >
            <ASelect
              allowClear
              options={pageSelectOptions}
              placeholder={t('page.manage.button.form.selectMenuName')}
            />
          </AForm.Item>
        </ACol>
        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <AForm.Item
            className="m-0"
            label={t('page.manage.button.buttonStatus')}
            name="status"
          >
            <ASelect
              allowClear
              options={translateOptions(enableStatusOptions)}
              placeholder={t('page.manage.button.form.buttonStatus')}
            />
          </AForm.Item>
        </ACol>

        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <AForm.Item className="m-0">
            <AFlex
              align="center"
              gap={12}
              justify="end"
            >
              <AButton
                icon={<IconIcRoundRefresh />}
                onClick={reset}
              >
                {t('common.reset')}
              </AButton>
              <AButton
                ghost
                icon={<IconIcRoundSearch />}
                type="primary"
                onClick={search}
              >
                {t('common.search')}
              </AButton>
            </AFlex>
          </AForm.Item>
        </ACol>
      </ARow>
    </AForm>
  );
});

export default ButtonSearch;
