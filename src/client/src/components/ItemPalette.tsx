import React from 'react';
import type { StylingItem } from '@/types/models';
import { cn } from '@/lib/utils';

interface ItemPaletteProps {
  items: StylingItem[];
  selectedItemId?: string;
  onItemSelect: (item: StylingItem) => void;
  category?: 'colors' | 'accessories' | 'effects' | 'all';
}

export default function ItemPalette({ 
  items, 
  selectedItemId, 
  onItemSelect,
  category = 'all' 
}: ItemPaletteProps) {
  const filteredItems = category === 'all' 
    ? items 
    : items.filter(item => item.category === category);

  const unlockedItems = filteredItems.filter(item => item.isUnlocked);
  const lockedItems = filteredItems.filter(item => !item.isUnlocked);

  return (
    <div className="w-full">
      {/* Unlocked Items */}
      {unlockedItems.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">
            Freigeschaltet
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {unlockedItems.map((item) => (
              <ItemButton
                key={item.id}
                item={item}
                isSelected={selectedItemId === item.id}
                onClick={() => onItemSelect(item)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Locked Items */}
      {lockedItems.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">
            Noch nicht freigeschaltet
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {lockedItems.map((item) => (
              <ItemButton
                key={item.id}
                item={item}
                isLocked
                isSelected={false}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ItemButtonProps {
  item: StylingItem;
  isSelected: boolean;
  isLocked?: boolean;
  onClick: () => void;
}

function ItemButton({ item, isSelected, isLocked, onClick }: ItemButtonProps) {
  if (item.type === 'color') {
    return (
      <button
        onClick={onClick}
        disabled={isLocked}
        className={cn(
          "relative aspect-square rounded-xl transition-all duration-200 border-4",
          "hover:scale-110 active:scale-95",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
          isSelected 
            ? "border-primary shadow-lg scale-110" 
            : "border-white shadow-md"
        )}
        style={{ backgroundColor: item.assetReference }}
        title={item.name}
      >
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
            <span className="text-2xl">🔒</span>
          </div>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={cn(
        "relative aspect-square rounded-xl transition-all duration-200 border-4 bg-white",
        "hover:scale-110 active:scale-95 flex items-center justify-center",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
        isSelected 
          ? "border-primary shadow-lg scale-110" 
          : "border-white shadow-md"
      )}
      title={item.name}
    >
      <span className="text-3xl">{item.assetReference}</span>
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
          <span className="text-2xl">🔒</span>
        </div>
      )}
    </button>
  );
}

