type DataLayerPayload = {
  event: string;
  [key: string]: string | number | boolean | null | undefined;
};

export const pushToDataLayer = (payload: DataLayerPayload) => {
  if (typeof window === 'undefined') return;

  const w = window as Window & {
    dataLayer?: DataLayerPayload[];
  };

  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(payload);
};
