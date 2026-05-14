/* eslint-disable react/prop-types */
import { DatePicker } from 'antd';
import type { FC } from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { requestMethodOptions } from '@/constants/business';
import { translateOptions } from '@/utils/common';

const { RangePicker } = DatePicker;

/** 操作日志搜索表单 */
const OperationLogSearch: FC<Page.SearchProps> = memo(({ form, reset, search, searchParams }) => {
  const { t } = useTranslation();

  return (
    <AForm
      autoComplete="off"
      form={form}
      initialValues={searchParams}
      labelCol={{ md: 7, span: 5 }}
    >
      <ARow
        wrap
        gutter={[16, 16]}
      >
        {/* 用户名 */}
        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <AForm.Item
            className="m-0"
            label={t('page.manage.log.title.username')}
            name="userName"
          >
            <AInput placeholder={t('page.manage.log.form.placeholder.username')} />
          </AForm.Item>
        </ACol>

        {/* 请求方式 */}
        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <AForm.Item
            className="m-0"
            label={t('page.manage.log.title.requestMethod')}
            name="requestMethod"
          >
            <ASelect
              allowClear
              options={translateOptions(requestMethodOptions)}
              placeholder={t('page.manage.log.form.placeholder.requestMethod')}
            />
          </AForm.Item>
        </ACol>

        {/* 请求路径 */}
        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <AForm.Item
            className="m-0"
            label={t('page.manage.log.title.requestUrl')}
            name="requestUrl"
          >
            <AInput placeholder={t('page.manage.log.form.placeholder.requestUrl')} />
          </AForm.Item>
        </ACol>

        {/* 耗时范围 */}
        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <AForm.Item
            label={t('page.manage.log.title.minCostTime')}
            name="minCostTime"
          >
            <AInputNumber
              min={0}
              placeholder={t('page.manage.log.form.placeholder.minCostTime')}
              style={{ width: '100%' }}
            />
          </AForm.Item>
        </ACol>

        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <AForm.Item
            label={t('page.manage.log.title.maxCostTime')}
            name="maxCostTime"
          >
            <AInputNumber
              min={0}
              placeholder={t('page.manage.log.form.placeholder.maxCostTime')}
              style={{ width: '100%' }}
            />
          </AForm.Item>
        </ACol>

        {/* 日期范围 */}
        <ACol
          lg={6}
          md={12}
          span={24}
        >
          <AForm.Item
            label={t('page.manage.log.title.createTime')}
            name="rangePicker"
          >
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              onChange={dates => {
                if (dates && dates.length === 2) {
                  form.setFieldValue('beginTime', dates[0]?.format('YYYY-MM-DD HH:mm:ss'));
                  form.setFieldValue('endTime', dates[1]?.format('YYYY-MM-DD HH:mm:ss'));
                } else {
                  form.setFieldValue('beginTime', undefined);
                  form.setFieldValue('endTime', undefined);
                }
              }}
            />
          </AForm.Item>

          {/* 隐藏字段 */}
          <AForm.Item
            noStyle
            name="beginTime"
          >
            <AInput type="hidden" />
          </AForm.Item>
          <AForm.Item
            noStyle
            name="endTime"
          >
            <AInput type="hidden" />
          </AForm.Item>
        </ACol>

        {/* 按钮 */}
        <ACol
          lg={12}
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

OperationLogSearch.displayName = 'OperationLogSearch';

export default OperationLogSearch;
