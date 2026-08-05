import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { saveOotd, unsaveOotd } from '../api/ootdApi';

export const useToggleSave = (ootdId: number, initialSaved: boolean) => {
  const [saved, setSaved] = useState(initialSaved);

  const { mutate } = useMutation({
    mutationFn: (next: boolean) => (next ? saveOotd(ootdId) : unsaveOotd(ootdId)),
    onMutate: (next) => {
      setSaved(next);
      return { prev: !next };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) setSaved(ctx.prev);
    },
  });

  const toggle = () => mutate(!saved);

  return { saved, toggle };
};
