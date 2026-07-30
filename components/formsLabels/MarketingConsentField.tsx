import clsx from 'clsx';
import { Field, FieldProps } from 'formik';
import { useTranslations } from 'next-intl';

import SvgIcon from '@components/common/SvgIcon';

import { Label } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

type Props = {
  name?: string;
  disabled?: boolean;
  className?: string;
};

export default function MarketingConsentField({
  name = 'marketingConsent',
  disabled = false,
  className,
}: Props) {
  const t = useTranslations();
  return (
    <Field name={name}>
      {({ field, form, meta }: FieldProps<boolean>) => {
        const isChecked = Boolean(field.value);
        const hasError = Boolean(meta.touched && meta.error);

        return (
          <div className={clsx('w-full', className)}>
            <label
              htmlFor={name}
              className={clsx(
                'inline-flex items-center gap-3',
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              )}
            >
              <input
                id={name}
                name={name}
                type="checkbox"
                checked={isChecked}
                disabled={disabled}
                className="peer sr-only"
                onBlur={field.onBlur}
                onChange={event => {
                  void form.setFieldValue(name, event.target.checked);
                }}
              />

              <span
                className={clsx(
                  'flex h-6 w-6 shrink-0 items-center justify-center',
                  'rounded-md border transition-all duration-200',
                  'peer-focus-visible:ring-2',
                  'peer-focus-visible:ring-secondary-accent/40',
                  'peer-focus-visible:ring-offset-2',
                  isChecked
                    ? 'border-secondary-accent bg-secondary-accent shadow-sm'
                    : 'border-gray-400 bg-white',
                  hasError && 'border-red-500'
                )}
                aria-hidden="true"
              >
                <span
                  className={clsx(
                    'flex items-center justify-center transition-all duration-200',
                    isChecked ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                  )}
                >
                  <SvgIcon
                    iconId={IconId.Check}
                    size={{ width: 14, height: 14 }}
                    className="fill-white"
                  />
                </span>
              </span>

              <span className="text-[15px] leading-6 text-black">
                {t(Label.MarketingConsent)}
              </span>
            </label>

            {hasError && (
              <p className="mt-1 pl-9 text-sm text-red-500">{meta.error}</p>
            )}
          </div>
        );
      }}
    </Field>
  );
}
