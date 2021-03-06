import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Select, TextInput, Button, IconSearch } from 'hds-react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { breakpoint } from '../common/style';
import { getApplicationPeriods, getParameters } from '../common/api';
import { mapOptions, OptionType, getSelectedOption } from '../common/util';

type Props = {
  onSearch: (search: Record<string, string>) => void;
  formValues: { [key: string]: string };
};

const options = [] as OptionType[];

const Container = styled.div`
  @media (max-width: ${breakpoint.m}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${breakpoint.s}) {
    grid-template-columns: 1fr;
  }

  margin-top: var(--spacing-s);
  max-width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: var(--spacing-m);
  font-size: var(--fontsize-body-m);
`;

const ShowL = styled.div`
  @media (max-width: ${breakpoint.m}) {
    display: none;
  }

  display: block;
`;

const ShowM = styled.div`
  @media (max-width: ${breakpoint.m}) {
    display: block;
  }

  @media (max-width: ${breakpoint.s}) {
    display: none;
  }

  display: none;
`;

const Hr = styled.hr`
  margin-top: var(--spacing-l);
`;

const ButtonContainer = styled.div`
  margin-top: var(--spacing-l);
  display: flex;
  justify-content: flex-end;
`;

const SearchForm = ({ onSearch, formValues }: Props): JSX.Element | null => {
  const { t, i18n } = useTranslation();
  const [ready, setReady] = useState<boolean>(false);

  const [purposeOptions, setPurposeOptions] = useState<OptionType[]>([]);
  const [districtOptions, setDistrictOptions] = useState<OptionType[]>([]);
  const [applicationPeriodOptions, setApplicationPeriodOptions] = useState<
    OptionType[]
  >([]);

  const { register, handleSubmit, setValue, getValues } = useForm();

  useEffect(() => {
    register({ name: 'purpose' });
    register({ name: 'district' });
    register({ name: 'application_round' });
  }, [register]);

  useEffect(() => {
    async function fetchData() {
      const fetchedApplicationPeriods = await getApplicationPeriods();
      setApplicationPeriodOptions(
        mapOptions(fetchedApplicationPeriods, t('common.select'), i18n.language)
      );
      const fetchedPurposeOptions = await getParameters('purpose');
      setPurposeOptions(mapOptions(fetchedPurposeOptions, t('common.select')));
      const fetchedDistrictOptions = await getParameters('district');
      setDistrictOptions(
        mapOptions(fetchedDistrictOptions, t('common.select'), i18n.language)
      );
      setReady(true);
    }
    fetchData();
  }, [t, i18n.language]);

  useEffect(() => {
    Object.keys(formValues).forEach((p) => setValue(p, formValues[p]));
  }, [formValues, setValue]);

  const search = (criteria: Record<string, string>) => {
    onSearch(criteria);
  };

  if (!ready) {
    return null;
  }

  return (
    <>
      <Container>
        <TextInput
          id="search"
          name="search"
          label="&nbsp;"
          ref={register()}
          placeholder={t('SearchForm.searchTermPlaceholder')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(search)();
            }
          }}
          defaultValue={formValues.search}
        />
        <Select
          id="application_round"
          placeholder={t('common.select')}
          options={applicationPeriodOptions}
          onChange={(selection: OptionType): void => {
            setValue('application_round', selection.value);
          }}
          defaultValue={getSelectedOption(
            getValues('application_round'),
            applicationPeriodOptions
          )}
          label="Haku"
        />
        <ShowL />
        <Select
          id="purpose"
          placeholder={t('common.select')}
          options={purposeOptions}
          onChange={(selection: OptionType): void => {
            setValue('purpose', selection.value);
          }}
          defaultValue={getSelectedOption(getValues('purpose'), purposeOptions)}
          label="Käyttötarkoitus"
        />
        <Select
          id="district"
          placeholder={t('common.select')}
          onChange={(selection: OptionType): void => {
            setValue('district', selection.value);
          }}
          options={districtOptions}
          defaultValue={getSelectedOption(
            getValues('district'),
            districtOptions
          )}
          label="Kaupunginosa"
        />
        <Select
          placeholder={t('common.select')}
          disabled
          options={options}
          label="Hinta"
        />
        <ShowM />
        <Checkbox
          disabled
          id="checkbox1"
          label="Sopiva liikuntarajoitteisille"
        />
        <Checkbox disabled id="checkbox2" label="Lähimmät paikat ensin" />
      </Container>
      <Hr />
      <ButtonContainer>
        <Button
          id="searchButton"
          onClick={handleSubmit(search)}
          iconLeft={<IconSearch />}>
          {t('SearchForm.searchButton')}
        </Button>
      </ButtonContainer>
    </>
  );
};

export default SearchForm;
