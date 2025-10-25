import { describe, it, expect } from 'vitest';
import { ALL_TOPICS, getRandomTopic } from '../MathTask';

// Test the randomization logic for mixed topics
describe('Mixed Topic Randomization', () => {

  it('should return a valid topic', () => {
    const topic = getRandomTopic();
    expect(ALL_TOPICS).toContain(topic);
  });

  it('should not return mixed as a topic', () => {
    const topic = getRandomTopic();
    expect(topic).not.toBe('mixed');
  });

  it('should eventually return different topics (randomness check)', () => {
    const topics = new Set<string>();
    for (let i = 0; i < 100; i++) {
      topics.add(getRandomTopic());
    }
    // After 100 iterations, we should have at least 3 different topics
    expect(topics.size).toBeGreaterThanOrEqual(3);
  });

  it('should always return one of the 6 concrete topics', () => {
    for (let i = 0; i < 20; i++) {
      const topic = getRandomTopic();
      expect(ALL_TOPICS).toContain(topic);
    }
  });
});
