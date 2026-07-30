import { IEmailSubscriber } from '@interfaces/IEmailSubscriber';

import { api } from '@store/api';

import { normalizeError } from '@utils/errors/normalizeError';

export async function getAllEmailSubscribers(): Promise<IEmailSubscriber[]> {
  try {
    const { data } = await api.get<IEmailSubscriber[]>('/form-submissions');

    return data;
  } catch (error) {
    throw normalizeError(error);
  }
}
