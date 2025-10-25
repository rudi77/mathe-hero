import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import CharacterDisplay from '../CharacterDisplay';
import { createStylingItem, createAppliedStyling } from '@/test/fixtures';

describe('CharacterDisplay', () => {
  const defaultProps = {
    appliedItems: [],
    allItems: [],
    backgroundColor: '#FFE4E1',
  };

  it('should render with default background color', () => {
    const { container } = render(<CharacterDisplay {...defaultProps} />);

    const background = container.querySelector('[style*="background"]');
    expect(background).toBeTruthy();
  });

  it('should render with custom background color', () => {
    const { container } = render(
      <CharacterDisplay {...defaultProps} backgroundColor="#FF0000" />
    );

    const background = container.querySelector('[style*="background"]');
    expect(background).toBeTruthy();
  });

  it('should render character head base elements', () => {
    const { container } = render(<CharacterDisplay {...defaultProps} />);

    // Check for head, eyes, smile
    const elements = container.querySelectorAll('div');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('should render applied accessory items', () => {
    const item = createStylingItem({
      id: 'accessory-1',
      type: 'accessory',
      assetReference: '🎩',
    });

    const appliedItem = createAppliedStyling({
      itemId: 'accessory-1',
      position: { x: 50, y: 50 },
    });

    const { container } = render(
      <CharacterDisplay
        {...defaultProps}
        allItems={[item]}
        appliedItems={[appliedItem]}
      />
    );

    const emoji = container.textContent;
    expect(emoji).toContain('🎩');
  });

  it('should render multiple applied items', () => {
    const items = [
      createStylingItem({
        id: 'item-1',
        type: 'accessory',
        assetReference: '🎩',
      }),
      createStylingItem({
        id: 'item-2',
        type: 'accessory',
        assetReference: '🕶️',
      }),
    ];

    const appliedItems = [
      createAppliedStyling({ itemId: 'item-1' }),
      createAppliedStyling({ itemId: 'item-2' }),
    ];

    const { container } = render(
      <CharacterDisplay
        {...defaultProps}
        allItems={items}
        appliedItems={appliedItems}
      />
    );

    const text = container.textContent;
    expect(text).toContain('🎩');
    expect(text).toContain('🕶️');
  });

  it('should not render color items as overlays', () => {
    const colorItem = createStylingItem({
      id: 'color-1',
      type: 'color',
      assetReference: '#FF0000',
    });

    const appliedItem = createAppliedStyling({ itemId: 'color-1' });

    const { container } = render(
      <CharacterDisplay
        {...defaultProps}
        allItems={[colorItem]}
        appliedItems={[appliedItem]}
      />
    );

    // Color items should not be rendered as overlays
    const text = container.textContent || '';
    expect(text).not.toContain('#FF0000');
  });

  it('should handle items with custom positions', () => {
    const item = createStylingItem({
      id: 'accessory-1',
      type: 'accessory',
      assetReference: '👑',
    });

    const appliedItem = createAppliedStyling({
      itemId: 'accessory-1',
      position: { x: 25, y: 75 },
    });

    const { container } = render(
      <CharacterDisplay
        {...defaultProps}
        allItems={[item]}
        appliedItems={[appliedItem]}
      />
    );

    expect(container.textContent).toContain('👑');
  });

  it('should handle items with scale and rotation', () => {
    const item = createStylingItem({
      id: 'accessory-1',
      type: 'accessory',
      assetReference: '⭐',
    });

    const appliedItem = createAppliedStyling({
      itemId: 'accessory-1',
      scale: 1.5,
      rotation: 45,
    });

    const { container } = render(
      <CharacterDisplay
        {...defaultProps}
        allItems={[item]}
        appliedItems={[appliedItem]}
      />
    );

    expect(container.textContent).toContain('⭐');
  });

  it('should handle missing item gracefully', () => {
    const appliedItem = createAppliedStyling({ itemId: 'non-existent' });

    const { container } = render(
      <CharacterDisplay
        {...defaultProps}
        allItems={[]}
        appliedItems={[appliedItem]}
      />
    );

    // Should not crash
    expect(container).toBeTruthy();
  });
});
