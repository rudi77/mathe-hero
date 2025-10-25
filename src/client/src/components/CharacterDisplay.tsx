import React from 'react';
import type { AppliedStyling, StylingItem } from '@/types/models';
import CharacterHead from './CharacterHead';

interface CharacterDisplayProps {
  appliedItems: AppliedStyling[];
  allItems: StylingItem[];
  backgroundColor?: string;
}

export default function CharacterDisplay({
  appliedItems,
  allItems,
  backgroundColor = '#FFE4E1'
}: CharacterDisplayProps) {
  const getItemById = (id: string) => allItems.find(item => item.id === id);

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
      {/* Background */}
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{ backgroundColor }}
      />

      {/* Character Head Base */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-64">
          {/* Custom SVG Character Head */}
          <CharacterHead className="absolute inset-0 w-full h-full" />
          
          {/* Applied Items */}
          {appliedItems.map((applied) => {
            const item = getItemById(applied.itemId);
            if (!item) return null;
            
            if (item.type === 'color') {
              // Color changes the background
              return null;
            }
            
            return (
              <div
                key={applied.itemId}
                className="absolute text-6xl pointer-events-none select-none transition-all duration-200"
                style={{
                  top: applied.position?.y ?? '10%',
                  left: applied.position?.x ?? '50%',
                  transform: `translate(-50%, -50%) scale(${applied.scale ?? 1}) rotate(${applied.rotation ?? 0}deg)`,
                }}
              >
                {item.assetReference}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

