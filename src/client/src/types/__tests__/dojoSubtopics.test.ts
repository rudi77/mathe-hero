import { describe, test, expect } from 'vitest';
import {
  DOJO_SUBTOPICS,
  getSubtopicById,
  getSubtopicsByTopic,
  getTopicsWithSubtopics,
  type DojoSubtopic,
} from '../dojoSubtopics';
import type { MathTopic } from '../models';

describe('DojoSubtopics', () => {
  describe('Data Structure Validation', () => {
    test('DOJO_SUBTOPICS is defined and is an array', () => {
      expect(DOJO_SUBTOPICS).toBeDefined();
      expect(Array.isArray(DOJO_SUBTOPICS)).toBe(true);
      expect(DOJO_SUBTOPICS.length).toBeGreaterThan(0);
    });

    test('all subtopics have required fields', () => {
      DOJO_SUBTOPICS.forEach((subtopic) => {
        expect(subtopic.id).toBeDefined();
        expect(typeof subtopic.id).toBe('string');
        expect(subtopic.id.length).toBeGreaterThan(0);

        expect(subtopic.topicId).toBeDefined();
        expect(typeof subtopic.topicId).toBe('string');

        expect(subtopic.name).toBeDefined();
        expect(typeof subtopic.name).toBe('string');
        expect(subtopic.name.length).toBeGreaterThan(0);

        expect(subtopic.mathEngineParams).toBeDefined();
        expect(typeof subtopic.mathEngineParams).toBe('object');
      });
    });

    test('all subtopic IDs are unique', () => {
      const ids = DOJO_SUBTOPICS.map((s) => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('all subtopics have valid mathEngineParams', () => {
      DOJO_SUBTOPICS.forEach((subtopic) => {
        const params = subtopic.mathEngineParams;
        expect(params).toBeDefined();
        expect(typeof params).toBe('object');

        // Check that at least one param is defined
        const hasParams =
          params.difficultyMin !== undefined ||
          params.difficultyMax !== undefined ||
          params.constraints !== undefined;
        expect(hasParams).toBe(true);

        // If difficulty range is defined, validate it
        if (params.difficultyMin !== undefined) {
          expect(params.difficultyMin).toBeGreaterThanOrEqual(1);
          expect(params.difficultyMin).toBeLessThanOrEqual(10);
        }
        if (params.difficultyMax !== undefined) {
          expect(params.difficultyMax).toBeGreaterThanOrEqual(1);
          expect(params.difficultyMax).toBeLessThanOrEqual(10);
        }
        if (params.difficultyMin && params.difficultyMax) {
          expect(params.difficultyMin).toBeLessThanOrEqual(params.difficultyMax);
        }
      });
    });
  });

  describe('Topic Coverage', () => {
    const mainTopics: MathTopic[] = [
      'addition',
      'subtraction',
      'multiplication',
      'division',
      'geometry',
      'sizes',
    ];

    test('all 6 main topics have subtopics defined', () => {
      mainTopics.forEach((topic) => {
        const subtopics = getSubtopicsByTopic(topic);
        expect(subtopics.length).toBeGreaterThanOrEqual(
          2,
          `Topic "${topic}" should have at least 2 subtopics`
        );
      });
    });

    test('addition has exactly 3 subtopics', () => {
      const subtopics = getSubtopicsByTopic('addition');
      expect(subtopics.length).toBe(3);
      const ids = subtopics.map((s) => s.id);
      expect(ids).toContain('addition_up_to_100');
      expect(ids).toContain('addition_up_to_1000');
      expect(ids).toContain('addition_with_carry');
    });

    test('subtraction has exactly 3 subtopics', () => {
      const subtopics = getSubtopicsByTopic('subtraction');
      expect(subtopics.length).toBe(3);
      const ids = subtopics.map((s) => s.id);
      expect(ids).toContain('subtraction_up_to_100');
      expect(ids).toContain('subtraction_up_to_1000');
      expect(ids).toContain('subtraction_with_borrow');
    });

    test('multiplication has exactly 3 subtopics', () => {
      const subtopics = getSubtopicsByTopic('multiplication');
      expect(subtopics.length).toBe(3);
      const ids = subtopics.map((s) => s.id);
      expect(ids).toContain('multiplication_times_1_5');
      expect(ids).toContain('multiplication_times_6_10');
      expect(ids).toContain('multiplication_mixed');
    });

    test('division has exactly 3 subtopics', () => {
      const subtopics = getSubtopicsByTopic('division');
      expect(subtopics.length).toBe(3);
      const ids = subtopics.map((s) => s.id);
      expect(ids).toContain('division_by_2_5');
      expect(ids).toContain('division_by_6_10');
      expect(ids).toContain('division_with_remainder');
    });

    test('geometry has exactly 2 subtopics', () => {
      const subtopics = getSubtopicsByTopic('geometry');
      expect(subtopics.length).toBe(2);
      const ids = subtopics.map((s) => s.id);
      expect(ids).toContain('geometry_shape_recognition');
      expect(ids).toContain('geometry_vertices_edges');
    });

    test('sizes has exactly 3 subtopics', () => {
      const subtopics = getSubtopicsByTopic('sizes');
      expect(subtopics.length).toBe(3);
      const ids = subtopics.map((s) => s.id);
      expect(ids).toContain('sizes_length');
      expect(ids).toContain('sizes_weight');
      expect(ids).toContain('sizes_time');
    });
  });

  describe('Helper Functions', () => {
    test('getSubtopicById returns correct subtopic', () => {
      const subtopic = getSubtopicById('multiplication_times_1_5');
      expect(subtopic).toBeDefined();
      expect(subtopic?.id).toBe('multiplication_times_1_5');
      expect(subtopic?.topicId).toBe('multiplication');
      expect(subtopic?.name).toBe('Einmaleins 1-5');
    });

    test('getSubtopicById returns undefined for non-existent ID', () => {
      const subtopic = getSubtopicById('non_existent_id');
      expect(subtopic).toBeUndefined();
    });

    test('getSubtopicsByTopic returns array of subtopics', () => {
      const subtopics = getSubtopicsByTopic('multiplication');
      expect(Array.isArray(subtopics)).toBe(true);
      expect(subtopics.length).toBeGreaterThan(0);
      subtopics.forEach((s) => {
        expect(s.topicId).toBe('multiplication');
      });
    });

    test('getSubtopicsByTopic returns empty array for topic with no subtopics', () => {
      // 'mixed' topic should have no subtopics
      const subtopics = getSubtopicsByTopic('mixed');
      expect(Array.isArray(subtopics)).toBe(true);
      expect(subtopics.length).toBe(0);
    });

    test('getTopicsWithSubtopics returns all topics with subtopics', () => {
      const topics = getTopicsWithSubtopics();
      expect(Array.isArray(topics)).toBe(true);
      expect(topics.length).toBe(6);
      expect(topics).toContain('addition');
      expect(topics).toContain('subtraction');
      expect(topics).toContain('multiplication');
      expect(topics).toContain('division');
      expect(topics).toContain('geometry');
      expect(topics).toContain('sizes');
    });
  });

  describe('MathEngine Params Mapping', () => {
    test('multiplication_times_1_5 has correct params', () => {
      const subtopic = getSubtopicById('multiplication_times_1_5');
      expect(subtopic).toBeDefined();
      expect(subtopic?.mathEngineParams.difficultyMin).toBe(1);
      expect(subtopic?.mathEngineParams.difficultyMax).toBe(5);
      expect(subtopic?.mathEngineParams.constraints?.maxMultiplier).toBe(5);
    });

    test('addition_up_to_100 has correct maxNumber constraint', () => {
      const subtopic = getSubtopicById('addition_up_to_100');
      expect(subtopic).toBeDefined();
      expect(subtopic?.mathEngineParams.constraints?.maxNumber).toBe(100);
    });

    test('division_with_remainder has allowRemainder constraint', () => {
      const subtopic = getSubtopicById('division_with_remainder');
      expect(subtopic).toBeDefined();
      expect(subtopic?.mathEngineParams.constraints?.allowRemainder).toBe(true);
    });

    test('geometry_shape_recognition has focusArea constraint', () => {
      const subtopic = getSubtopicById('geometry_shape_recognition');
      expect(subtopic).toBeDefined();
      expect(subtopic?.mathEngineParams.constraints?.focusArea).toBe('shapeRecognition');
    });

    test('sizes_length has measurementType constraint', () => {
      const subtopic = getSubtopicById('sizes_length');
      expect(subtopic).toBeDefined();
      expect(subtopic?.mathEngineParams.constraints?.measurementType).toBe('length');
    });
  });
});
