import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createWish, deleteWish } from '../api/wishApi';

export const useToggleWish = (itemId: number | undefined, initialWished: boolean) => {
  const [wished, setWished] = useState(initialWished);

  const { mutate } = useMutation({
    mutationFn: (nextWished: boolean) => (nextWished ? createWish(itemId!) : deleteWish(itemId!)),
    onMutate: (nextWished) => {
      setWished(nextWished);
      return { prev: !nextWished };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) setWished(ctx.prev);
    },
  });

  const toggle = () => {
    if (itemId === undefined) return;
    mutate(!wished);
  };

  return { wished, toggle };
};
