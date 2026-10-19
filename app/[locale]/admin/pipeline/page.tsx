'use client';

import { FiArrowRight, FiGitBranch } from 'react-icons/fi';

import { useLocale } from 'next-intl';
import Link from 'next/link';

import PipelineBoard from './PipelineBoard';

export default function SalesPipelinePage() {
  const locale = useLocale();

  return (
    <main className="min-h-full bg-[#fcfcfd] text-[#002b49]">
      <header className="border-b border-slate-200 bg-white px-5 py-7 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
              <FiGitBranch />
              CRM / Sales Pipeline
            </p>

            <h1 className="text-2xl font-bold">Sales Pipeline</h1>

            <p className="mt-2 text-sm text-slate-500">
              Track and manage customer inquiries through every sales stage.
            </p>
          </div>

          <Link
            href={`/${locale}/admin/leads`}
            className="inline-flex items-center gap-2 rounded-full bg-[#002b49] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00528b]"
          >
            Customer Leads
            <FiArrowRight />
          </Link>
        </div>
      </header>

      <div className="p-4 sm:p-7">
        <PipelineBoard />
      </div>
    </main>
  );
}
