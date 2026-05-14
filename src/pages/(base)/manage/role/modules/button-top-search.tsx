type Props = Page.SearchProps & { pageSelectOptions: CommonType.Option<number>[] };

const ButtonSearch: FC<Props> = memo(({ form, pageSelectOptions, reset, search, searchParams }) => {
  const { t } = useTranslation();

  const handleChange = (value: number | undefined) => {
    if (value === undefined) {
      reset();
      return;
    }
    search();
  };
  return (
    <AForm
      autoComplete="off"
      form={form}
      initialValues={searchParams}
      size="small"
    >
      <ARow>
        <ACol span={10}>
          <AForm.Item
            label={t('page.manage.button.selectMenuName')}
            name="menuId"
          >
            <ASelect
              allowClear
              options={pageSelectOptions}
              placeholder={t('page.manage.button.form.selectMenuName')}
              onChange={handleChange}
            />
          </AForm.Item>
        </ACol>
      </ARow>
    </AForm>
  );
});

export default ButtonSearch;
