import { IEmailSubscriber } from '@interfaces/IEmailSubscriber';

import SourceBadge from './SourceBadge';

type Props = {
  subscriber: IEmailSubscriber;
};

export default function EmailSubscriberRow({ subscriber }: Props) {
  const subscriptionDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(subscriber.createdAt));

  return (
    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
      <td className="px-4 py-4 whitespace-nowrap">
        <p className="font-medium text-gray-800">{subscriber.name}</p>
      </td>

      <td className="px-4 py-4">
        <a
          href={`mailto:${subscriber.email}`}
          className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
        >
          {subscriber.email}
        </a>
      </td>

      <td className="px-4 py-4 whitespace-nowrap">
        <SourceBadge source={subscriber.source} />
      </td>

      <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">
        {subscriptionDate}
      </td>
    </tr>
  );
}
