import { FormSubmissionSource } from '@interfaces/IEmailSubscriber';
import clsx from 'clsx';

type Props = {
  source: FormSubmissionSource;
};

const sourceLabels: Record<FormSubmissionSource, string> = {
  [FormSubmissionSource.ContactUs]: 'Contact us',
  [FormSubmissionSource.SellToUs]: 'Sell to us',
  [FormSubmissionSource.RequestQuote]: 'Request quote',
};

export default function SourceBadge({ source }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex rounded-full px-3 py-1',
        'text-xs font-medium',
        source === FormSubmissionSource.ContactUs && 'bg-blue-50 text-blue-700',
        source === FormSubmissionSource.SellToUs &&
          'bg-amber-50 text-amber-700',
        source === FormSubmissionSource.RequestQuote &&
          'bg-purple-50 text-purple-700'
      )}
    >
      {sourceLabels[source] ?? source}
    </span>
  );
}
