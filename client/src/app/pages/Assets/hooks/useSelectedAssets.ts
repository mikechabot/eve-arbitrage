import { useCallback, useState } from 'react';

interface SelectedAssets {
  selectedItemIds: Set<number>;
  onSelectAsset: (itemId: number) => void;
}

export const useSelectedAssets = (): SelectedAssets => {
  const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(new Set<number>());

  const onSelectAsset = useCallback(
    (itemId: number) => {
      setSelectedItemIds((prev) => {
        const newSet = new Set(prev);

        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }

        return newSet;
      });
    },
    [setSelectedItemIds],
  );

  return { selectedItemIds, onSelectAsset };
};
