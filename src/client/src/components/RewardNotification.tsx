import React from 'react';
import type { StylingItem } from '@/types/models';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RewardNotificationProps {
  isOpen: boolean;
  item: StylingItem | null;
  onClose: () => void;
}

export default function RewardNotification({ isOpen, item, onClose }: RewardNotificationProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary">
            🎉 Glückwunsch! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-6">
          {/* Item Display */}
          <div className="relative">
            {item.type === 'color' ? (
              <div 
                className="w-32 h-32 rounded-full border-8 border-white shadow-2xl animate-bounce"
                style={{ backgroundColor: item.assetReference }}
              />
            ) : (
              <div className="text-8xl animate-bounce">
                {item.assetReference}
              </div>
            )}
            <div className="absolute -top-4 -right-4 text-6xl animate-spin-slow">
              ✨
            </div>
          </div>

          {/* Item Name */}
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">
              Du hast freigeschaltet:
            </p>
            <p className="text-2xl font-bold text-primary">
              {item.name}
            </p>
          </div>

          {/* Close Button */}
          <Button 
            onClick={onClose}
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg font-bold"
          >
            Super! 🎨
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

