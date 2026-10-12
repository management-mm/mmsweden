import type {
  ICreateSeoStructurePayload,
  IGenerateSeoProposalPayload,
  ISeoProposalResponse,
} from '@interfaces/IAdminSeoAi';

import { api } from '@store/api';

export const generateSeoProposal = async (
  payload: IGenerateSeoProposalPayload
): Promise<ISeoProposalResponse> => {
  const { data } = await api.post('/admin/seo-ai/proposal', payload);

  return data;
};

export const createSeoStructure = async (
  payload: ICreateSeoStructurePayload
) => {
  const { data } = await api.post('/admin/seo-ai/create', payload);

  return data;
};

export const getSeoParentCategories = async () => {
  const { data } = await api.get('/admin/seo-ai/categories', {
    params: {
      _t: Date.now(),
    },
  });

  return data;
};
