import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { LanguageContext } from '@components/SharedLayout';
import SvgIcon from '@components/common/SvgIcon';

import { selectCategories, selectIndustries } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';

import getFilterValueTranslation from '@utils/getFilterValueTranslation';
import subtractSearchParam from '@utils/subtractSearchParam';

import { Filter } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

const ResetFilters = () => {
  const { t } = useTranslation();
  const categories = useAppSelector(selectCategories);
  const industries = useAppSelector(selectIndustries);
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('LanguageContext must be used within a LanguageProvider');
  }

  const { language } = context;

  const [filtersToReset, setFiltersToReset] = useState<
    {
      value: string;
      filterName: 'category' | 'industry' | 'manufacturer' | 'condition';
    }[]
  >([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const getFilterParams = (
      filterName: 'category' | 'industry' | 'manufacturer' | 'condition'
    ) => {
      return searchParams.getAll(filterName).map(param => {
        return {
          value: param,
          filterName: filterName,
        };
      });
    };
    const category = getFilterParams('category');
    const manufacturer = getFilterParams('manufacturer');
    const industry = getFilterParams('industry');
    const condition = getFilterParams('condition');

    setFiltersToReset([
      ...new Set([...category, ...manufacturer, ...industry, ...condition]),
    ]);
  }, [searchParams]);

  return (
    <div className="mb-[22px] flex flex-wrap gap-[12px]">
      <button
        onClick={() => {
          setSearchParams(searchParams => {
            searchParams.delete('category');
            searchParams.delete('manufacturer');
            searchParams.delete('industry');
            searchParams.delete('condition');
            return searchParams;
          });
        }}
        className="rounded-[32px] border border-[rgba(211,67,21,1)] bg-[rgba(211,67,21,.12)] px-[8px] py-[7px] text-[12px] text-[rgba(211,67,21,1)]"
      >
        {t(Filter.Reset)}
      </button>
      {filtersToReset.map(filter => {
        return (
          <button
            // key={}
            onClick={() =>
              setSearchParams(searchParams => {
                subtractSearchParam(
                  searchParams,
                  filter.value,
                  filter.filterName
                );
                return searchParams;
              })
            }
            className="flex items-center gap-[8px] rounded-[32px] border border-primary bg-secondary px-[8px] py-[7px] text-[12px] text-primary"
          >
            {getFilterValueTranslation(
              filter,
              categories,
              industries,
              language
            )}

            <div className="flex h-[12px] w-[12px] items-center justify-center rounded-full bg-primary">
              <SvgIcon
                className="fill-[rgb(234,241,248)]"
                iconId={IconId.Reset}
                size={{ width: 6, height: 6 }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ResetFilters;
