import { IEmailSubscriber } from '@interfaces/IEmailSubscriber';

import EmailSubscriberRow from './EmailSubscriberRow';

type Props = {
  subscribers: IEmailSubscriber[];
};

export default function EmailSubscribersTable({ subscribers }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-gray-500 uppercase">
                Name
              </th>

              <th className="px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-gray-500 uppercase">
                Email
              </th>

              <th className="px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-gray-500 uppercase">
                Source
              </th>

              <th className="px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-gray-500 uppercase">
                Subscription date
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {subscribers.map(subscriber => (
              <EmailSubscriberRow
                key={subscriber._id}
                subscriber={subscriber}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
