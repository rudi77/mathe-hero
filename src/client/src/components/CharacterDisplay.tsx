import React from 'react';
import type { AppliedStyling, StylingItem } from '@/types/models';
import CharacterHead from './CharacterHead';

interface CharacterDisplayProps {
  appliedItems: AppliedStyling[];
  allItems: StylingItem[];
  backgroundColor?: string;
  onClickPosition?: (pos: { x: number; y: number }) => void;
  isClickable?: boolean;
}

export default function CharacterDisplay({
  appliedItems,
  allItems,
  backgroundColor = '#FFE4E1',
  onClickPosition,
  isClickable = false,
}: CharacterDisplayProps) {
  const getItemById = (id: string) => allItems.find(item => item.id === id);

  const sizeClasses: Record<'small' | 'medium' | 'large', string> = {
    small: 'text-4xl',
    medium: 'text-5xl',
    large: 'text-6xl',
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
      {/* Background */}
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{ backgroundColor }}
      />

      {/* Character Head Base */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`relative w-64 h-64 ${isClickable ? 'cursor-crosshair' : ''}`}
          onClick={(e) => {
            if (!onClickPosition) return;
            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            onClickPosition({ x, y });
          }}
        >
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
              className={`absolute pointer-events-none select-none transition-all duration-200 ${sizeClasses[(item.size ?? 'medium')]}`}
                style={{
                top: `${applied.position?.y ?? 10}%`,
                left: `${applied.position?.x ?? 50}%`,
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

