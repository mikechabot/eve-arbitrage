import { createContext, useCallback, useContext, useState } from 'react';

interface SelectedAssetsContextValue {
  selectedItemIds: Set<number>;
  onSelectAsset: (itemId: number) => void;
  onRemoveAll: () => void;
}

const SelectedAssetContext = createContext<SelectedAssetsContextValue>({
  selectedItemIds: new Set<number>(),
  onSelectAsset: () => ({}),
  onRemoveAll: () => ({}),
});

export const SelectedAssetProvider = ({ children }) => {
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

  const onRemoveAll = useCallback(() => {
    setSelectedItemIds(new Set());
  }, [setSelectedItemIds]);

  return (
    <SelectedAssetContext.Provider
      value={{
        selectedItemIds,
        onSelectAsset,
        onRemoveAll,
      }}
    >
      {children}
    </SelectedAssetContext.Provider>
  );
};

export const useSelectedAssets = (): SelectedAssetsContextValue => useContext(SelectedAssetContext);
