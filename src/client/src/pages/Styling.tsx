import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useApp } from '@/contexts/AppContext';
import CharacterDisplay from '@/components/CharacterDisplay';
import ItemPalette from '@/components/ItemPalette';
import type { StylingItem, AppliedStyling } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Styling() {
  const [location, setLocation] = useLocation();
  const { stylingItems, characterState, updateCharacterState, userProgress, refreshUserProgress, isLoading } = useApp();
  
  const [selectedItem, setSelectedItem] = useState<StylingItem | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#FFE4E1');

  // Refresh user progress whenever we navigate to this page
  // Location change triggers this effect, ensuring fresh data after returning from MathTask
  useEffect(() => {
    if (!isLoading && location === '/') {
      refreshUserProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, isLoading]); // refreshUserProgress is stable, but not included to avoid infinite loops

  const handleItemSelect = (item: StylingItem) => {
    setSelectedItem(item);
    
    if (item.type === 'color') {
      // Apply color to background immediately
      setBackgroundColor(item.assetReference);
    }
  };

  const handleCharacterClickPosition = (pos: { x: number; y: number }) => {
    if (!selectedItem || selectedItem.type === 'color') return;

    const newAppliedItem: AppliedStyling = {
      itemId: selectedItem.id,
      position: pos,
      scale: 1,
      rotation: 0,
    };

    // Prevent duplicates: replace existing item with same id, or add if not present
    const updatedItems = [
      ...characterState.appliedItems.filter((item) => item.itemId !== selectedItem.id),
      newAppliedItem,
    ];

    updateCharacterState({
      appliedItems: updatedItems,
    });
  };

  const handleClearAll = () => {
    updateCharacterState({ appliedItems: [] });
    setBackgroundColor('#FFE4E1');
  };

  const unlockedItems = stylingItems.filter(item => item.isUnlocked);
  const totalItems = stylingItems.length;
  const unlockedCount = unlockedItems.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur shadow-md border-b-4 border-primary/20">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Mathe-Stylistin</h1>
              <p className="text-sm text-muted-foreground">
                {unlockedCount} von {totalItems} Items freigeschaltet
              </p>
            </div>
            <Button
              onClick={() => setLocation('/topics')}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg font-bold shadow-lg"
            >
              Mathe üben 🎓
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Character Display */}
          <div>
            <Card className="p-6 bg-white/80 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Dein Charakter</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={characterState.appliedItems.length === 0 && backgroundColor === '#FFE4E1'}
                >
                  Alles löschen
                </Button>
              </div>
              
              <div>
                <CharacterDisplay
                  appliedItems={characterState.appliedItems}
                  allItems={stylingItems}
                  backgroundColor={backgroundColor}
                  onClickPosition={handleCharacterClickPosition}
                  isClickable={!!selectedItem && selectedItem.type !== 'color'}
                />
              </div>

              {selectedItem && selectedItem.type !== 'color' && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  👆 Klicke auf den Kopf, um "{selectedItem.name}" zu platzieren
                </p>
              )}
            </Card>

            {/* Stats */}
            {userProgress && (
              <Card className="mt-4 p-4 bg-white/80 backdrop-blur">
                <h3 className="font-semibold mb-3">Deine Statistik</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {userProgress.totalCorrectAnswers}
                    </div>
                    <div className="text-xs text-muted-foreground">Richtig</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {userProgress.correctAnswersStreak}
                    </div>
                    <div className="text-xs text-muted-foreground">Serie</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">
                      {unlockedCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Items</div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Item Palette */}
          <div>
            <Card className="p-6 bg-white/80 backdrop-blur">
              <h2 className="text-xl font-bold mb-4">Deine Styling-Items</h2>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                  <TabsTrigger value="all">Alle</TabsTrigger>
                  <TabsTrigger value="colors">Farben</TabsTrigger>
                  <TabsTrigger value="accessories">Items</TabsTrigger>
                  <TabsTrigger value="effects">Effekte</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <ItemPalette
                    items={stylingItems}
                    selectedItemId={selectedItem?.id}
                    onItemSelect={handleItemSelect}
                    category="all"
                  />
                </TabsContent>
                
                <TabsContent value="colors" className="mt-0">
                  <ItemPalette
                    items={stylingItems}
                    selectedItemId={selectedItem?.id}
                    onItemSelect={handleItemSelect}
                    category="colors"
                  />
                </TabsContent>
                
                <TabsContent value="accessories" className="mt-0">
                  <ItemPalette
                    items={stylingItems}
                    selectedItemId={selectedItem?.id}
                    onItemSelect={handleItemSelect}
                    category="accessories"
                  />
                </TabsContent>
                
                <TabsContent value="effects" className="mt-0">
                  <ItemPalette
                    items={stylingItems}
                    selectedItemId={selectedItem?.id}
                    onItemSelect={handleItemSelect}
                    category="effects"
                  />
                </TabsContent>
              </Tabs>

              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-center font-semibold">
                  💡 Löse Matheaufgaben, um neue Items freizuschalten!
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

