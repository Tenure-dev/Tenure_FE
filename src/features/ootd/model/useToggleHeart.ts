import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { heartOotd, unheartOotd } from '../api/ootdApi';

export const useToggleHeart = (ootdId: number, initialHearted: boolean) => {
  const [hearted, setHearted] = useState(initialHearted);

  const { mutate } = useMutation({
    mutationFn: (next: boolean) => (next ? heartOotd(ootdId) : unheartOotd(ootdId)),
    onMutate: (next) => {
      setHearted(next);
      return { prev: !next };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) setHearted(ctx.prev);
    },
  });

  const toggle = () => mutate(!hearted);

  return { hearted, toggle };
};
