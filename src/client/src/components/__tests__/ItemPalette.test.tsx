import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ItemPalette from '../ItemPalette';
import { createStylingItem, createStylingItems } from '@/test/fixtures';

describe('ItemPalette', () => {
  const mockOnSelect = vi.fn();

  const defaultProps = {
    items: [],
    onItemSelect: mockOnSelect,
  };

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  describe('Rendering', () => {
    it('should render unlocked items section', () => {
      const items = [
        createStylingItem({ id: 'item-1', isUnlocked: true, name: 'Unlocked Item' }),
      ];

      render(<ItemPalette {...defaultProps} items={items} />);

      expect(screen.getByText('Freigeschaltet')).toBeInTheDocument();
    });

    it('should render locked items section', () => {
      const items = [
        createStylingItem({ id: 'item-1', isUnlocked: false, name: 'Locked Item' }),
      ];

      render(<ItemPalette {...defaultProps} items={items} />);

      expect(screen.getByText('Noch nicht freigeschaltet')).toBeInTheDocument();
    });

    it('should display lock icon for locked items', () => {
      const items = [
        createStylingItem({ id: 'item-1', isUnlocked: false }),
      ];

      const { container } = render(<ItemPalette {...defaultProps} items={items} />);

      expect(container.textContent).toContain('🔒');
    });

    it('should not display lock icon for unlocked items', () => {
      const items = [
        createStylingItem({ id: 'item-1', isUnlocked: true }),
      ];

      const { container } = render(<ItemPalette {...defaultProps} items={items} />);

      expect(container.textContent).not.toContain('🔒');
    });
  });

  describe('Filtering by category', () => {
    const items = [
      createStylingItem({ id: 'color-1', type: 'color', category: 'colors', isUnlocked: true }),
      createStylingItem({ id: 'accessory-1', type: 'accessory', category: 'accessories', isUnlocked: true }),
      createStylingItem({ id: 'effect-1', type: 'effect', category: 'effects', isUnlocked: true }),
    ];

    it('should show all items when category is "all"', () => {
      const { container } = render(
        <ItemPalette {...defaultProps} items={items} category="all" />
      );

      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(3);
    });

    it('should filter by colors category', () => {
      const { container } = render(
        <ItemPalette {...defaultProps} items={items} category="colors" />
      );

      const buttons = container.querySelectorAll('button:not([disabled])');
      expect(buttons.length).toBe(1);
    });

    it('should filter by accessories category', () => {
      const { container } = render(
        <ItemPalette {...defaultProps} items={items} category="accessories" />
      );

      const buttons = container.querySelectorAll('button:not([disabled])');
      expect(buttons.length).toBe(1);
    });

    it('should filter by effects category', () => {
      const { container } = render(
        <ItemPalette {...defaultProps} items={items} category="effects" />
      );

      const buttons = container.querySelectorAll('button:not([disabled])');
      expect(buttons.length).toBe(1);
    });
  });

  describe('Item Selection', () => {
    it('should call onItemSelect when clicking unlocked item', () => {
      const item = createStylingItem({ id: 'item-1', isUnlocked: true });

      const { container } = render(<ItemPalette {...defaultProps} items={[item]} />);

      const button = container.querySelector('button');
      fireEvent.click(button!);

      expect(mockOnSelect).toHaveBeenCalledTimes(1);
      expect(mockOnSelect).toHaveBeenCalledWith(item);
    });

    it('should not call onItemSelect when clicking locked item', () => {
      const item = createStylingItem({ id: 'item-1', isUnlocked: false });

      const { container } = render(<ItemPalette {...defaultProps} items={[item]} />);

      const button = container.querySelector('button');
      fireEvent.click(button!);

      expect(mockOnSelect).not.toHaveBeenCalled();
    });

    it('should highlight selected item', () => {
      const item = createStylingItem({ id: 'item-1', isUnlocked: true });

      const { container } = render(
        <ItemPalette {...defaultProps} items={[item]} selectedItemId="item-1" />
      );

      const button = container.querySelector('button');
      expect(button?.className).toContain('scale-110');
    });

    it('should not highlight non-selected items', () => {
      const items = createStylingItems(2).map(item => ({ ...item, isUnlocked: true }));

      const { container } = render(
        <ItemPalette {...defaultProps} items={items} selectedItemId="item-1" />
      );

      const buttons = container.querySelectorAll('button');
      // First button should be highlighted, second should not
      expect(buttons[0].className).toContain('scale-110');
    });
  });

  describe('Color Items', () => {
    it('should render color items with background color', () => {
      const colorItem = createStylingItem({
        id: 'color-1',
        type: 'color',
        assetReference: '#FF0000',
        isUnlocked: true,
      });

      const { container } = render(<ItemPalette {...defaultProps} items={[colorItem]} />);

      const button = container.querySelector('button');
      const style = button?.getAttribute('style');
      expect(style).toContain('background-color');
    });

    it('should display locked color items with lock overlay', () => {
      const colorItem = createStylingItem({
        id: 'color-1',
        type: 'color',
        assetReference: '#FF0000',
        isUnlocked: false,
      });

      const { container } = render(<ItemPalette {...defaultProps} items={[colorItem]} />);

      expect(container.textContent).toContain('🔒');
    });
  });

  describe('Accessory Items', () => {
    it('should render accessory items with emoji', () => {
      const accessoryItem = createStylingItem({
        id: 'accessory-1',
        type: 'accessory',
        assetReference: '🎩',
        isUnlocked: true,
      });

      const { container } = render(<ItemPalette {...defaultProps} items={[accessoryItem]} />);

      expect(container.textContent).toContain('🎩');
    });

    it('should disable locked accessory items', () => {
      const accessoryItem = createStylingItem({
        id: 'accessory-1',
        type: 'accessory',
        assetReference: '🎩',
        isUnlocked: false,
      });

      const { container } = render(<ItemPalette {...defaultProps} items={[accessoryItem]} />);

      const button = container.querySelector('button');
      expect(button?.disabled).toBe(true);
    });
  });

  describe('Mixed Items', () => {
    it('should handle mix of unlocked and locked items', () => {
      const items = [
        createStylingItem({ id: 'item-1', isUnlocked: true }),
        createStylingItem({ id: 'item-2', isUnlocked: false }),
        createStylingItem({ id: 'item-3', isUnlocked: true }),
      ];

      render(<ItemPalette {...defaultProps} items={items} />);

      expect(screen.getByText('Freigeschaltet')).toBeInTheDocument();
      expect(screen.getByText('Noch nicht freigeschaltet')).toBeInTheDocument();
    });

    it('should only show unlocked section when all items unlocked', () => {
      const items = createStylingItems(3).map(item => ({ ...item, isUnlocked: true }));

      render(<ItemPalette {...defaultProps} items={items} />);

      expect(screen.getByText('Freigeschaltet')).toBeInTheDocument();
      expect(screen.queryByText('Noch nicht freigeschaltet')).not.toBeInTheDocument();
    });

    it('should only show locked section when all items locked', () => {
      const items = createStylingItems(3).map(item => ({ ...item, isUnlocked: false }));

      render(<ItemPalette {...defaultProps} items={items} />);

      expect(screen.queryByText('Freigeschaltet')).not.toBeInTheDocument();
      expect(screen.getByText('Noch nicht freigeschaltet')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should handle empty items array', () => {
      const { container } = render(<ItemPalette {...defaultProps} items={[]} />);

      expect(container).toBeTruthy();
    });

    it('should handle filtered category with no items', () => {
      const items = [
        createStylingItem({ id: 'color-1', category: 'colors', isUnlocked: true }),
      ];

      const { container } = render(
        <ItemPalette {...defaultProps} items={items} category="accessories" />
      );

      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(0);
    });
  });
});
