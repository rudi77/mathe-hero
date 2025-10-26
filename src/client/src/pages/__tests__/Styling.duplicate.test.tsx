import React, { useEffect } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import Styling from '../Styling';
import { createUserProgress, createCharacterState } from '@/test/fixtures';

// Mock router
vi.mock('wouter', () => ({
  useLocation: () => ['/', vi.fn()],
}));

// Capture calls to updateCharacterState
const mockUpdateCharacterState = vi.fn();
const mockRefreshUserProgress = vi.fn();

// Mock AppContext to control state
vi.mock('@/contexts/AppContext', () => ({
  useApp: () => ({
    stylingItems: [],
    userProgress: createUserProgress(),
    characterState: createCharacterState(),
    updateCharacterState: mockUpdateCharacterState,
    refreshUserProgress: mockRefreshUserProgress,
    isLoading: false,
  }),
}));

// Mock ItemPalette to auto-select an accessory (non-color) item on mount
vi.mock('@/components/ItemPalette', () => ({
  __esModule: true,
  default: ({ onItemSelect }: { onItemSelect: (item: any) => void }) => {
    useEffect(() => {
      onItemSelect({
        id: 'accessory-glasses-1',
        type: 'accessory',
        name: 'Glasses',
        assetReference: '🕶️',
        isUnlocked: true,
        category: 'accessories',
      });
    }, [onItemSelect]);
    return <div>ItemPaletteMock</div>;
  },
}));

// Mock CharacterDisplay to call onClickPosition twice (simulating two clicks)
vi.mock('@/components/CharacterDisplay', () => ({
  __esModule: true,
  default: ({ onClickPosition }: { onClickPosition: (pos: { x: number; y: number }) => void }) => {
    useEffect(() => {
      onClickPosition({ x: 10, y: 20 });
      onClickPosition({ x: 30, y: 40 });
    }, [onClickPosition]);
    return <div>CharacterDisplayMock</div>;
  },
}));

describe('Styling duplicate-prevention', () => {
  it('prevents duplicate items and updates position on repeated placement', async () => {
    mockUpdateCharacterState.mockClear();

    render(<Styling />);

    await waitFor(() => expect(mockUpdateCharacterState).toHaveBeenCalledTimes(2));

    const firstCallArg = mockUpdateCharacterState.mock.calls[0][0];
    const secondCallArg = mockUpdateCharacterState.mock.calls[1][0];

    // Should always set a single applied item
    expect(firstCallArg.appliedItems).toHaveLength(1);
    expect(secondCallArg.appliedItems).toHaveLength(1);

    // Item id should match and position should be from the latest click
    expect(firstCallArg.appliedItems[0].itemId).toBe('accessory-glasses-1');
    expect(secondCallArg.appliedItems[0].itemId).toBe('accessory-glasses-1');
    expect(firstCallArg.appliedItems[0].position).toEqual({ x: 10, y: 20 });
    expect(secondCallArg.appliedItems[0].position).toEqual({ x: 30, y: 40 });
  });
});


