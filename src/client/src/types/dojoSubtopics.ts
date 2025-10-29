// Subtopic definitions for Dojo practice mode
import { MathTopic } from './models';

/**
 * Represents a specific subtopic within a main math topic.
 * Each subtopic maps to specific MathEngine generation parameters
 * to provide focused practice on specific skill areas.
 */
export interface DojoSubtopic {
  id: string; // Unique identifier (e.g., "multiplication_times_1_5")
  topicId: MathTopic; // Parent topic (e.g., "multiplication")
  name: string; // Display name (e.g., "Einmaleins 1-5")
  description?: string; // Optional help text
  mathEngineParams: {
    difficultyMin?: number; // Minimum difficulty level (1-10)
    difficultyMax?: number; // Maximum difficulty level (1-10)
    constraints?: Record<string, any>; // Topic-specific constraints
  };
}

/**
 * Complete list of all subtopics across all 6 main math topics.
 * Each subtopic is designed to align with 3rd grade Bavarian curriculum.
 */
export const DOJO_SUBTOPICS: DojoSubtopic[] = [
  // ========== ADDITION ==========
  {
    id: 'addition_up_to_100',
    topicId: 'addition',
    name: 'Bis 100',
    description: 'Addition mit Zahlen bis 100',
    mathEngineParams: {
      difficultyMin: 1,
      difficultyMax: 3,
      constraints: { maxNumber: 100 },
    },
  },
  {
    id: 'addition_up_to_1000',
    topicId: 'addition',
    name: 'Bis 1000',
    description: 'Addition mit Zahlen bis 1000',
    mathEngineParams: {
      difficultyMin: 4,
      difficultyMax: 7,
      constraints: { maxNumber: 1000 },
    },
  },
  {
    id: 'addition_with_carry',
    topicId: 'addition',
    name: 'Mit Übertrag',
    description: 'Addition mit Zehnerübertrag',
    mathEngineParams: {
      difficultyMin: 3,
      difficultyMax: 8,
      constraints: { requireCarry: true },
    },
  },

  // ========== SUBTRACTION ==========
  {
    id: 'subtraction_up_to_100',
    topicId: 'subtraction',
    name: 'Bis 100',
    description: 'Subtraktion mit Zahlen bis 100',
    mathEngineParams: {
      difficultyMin: 1,
      difficultyMax: 3,
      constraints: { maxNumber: 100 },
    },
  },
  {
    id: 'subtraction_up_to_1000',
    topicId: 'subtraction',
    name: 'Bis 1000',
    description: 'Subtraktion mit Zahlen bis 1000',
    mathEngineParams: {
      difficultyMin: 4,
      difficultyMax: 7,
      constraints: { maxNumber: 1000 },
    },
  },
  {
    id: 'subtraction_with_borrow',
    topicId: 'subtraction',
    name: 'Mit Übertrag',
    description: 'Subtraktion mit Zehnerübertrag',
    mathEngineParams: {
      difficultyMin: 3,
      difficultyMax: 8,
      constraints: { requireBorrow: true },
    },
  },

  // ========== MULTIPLICATION ==========
  {
    id: 'multiplication_times_1_5',
    topicId: 'multiplication',
    name: 'Einmaleins 1-5',
    description: '1×1 bis 5×10',
    mathEngineParams: {
      difficultyMin: 1,
      difficultyMax: 5,
      constraints: { maxMultiplier: 5 },
    },
  },
  {
    id: 'multiplication_times_6_10',
    topicId: 'multiplication',
    name: 'Einmaleins 6-10',
    description: '6×1 bis 10×10',
    mathEngineParams: {
      difficultyMin: 4,
      difficultyMax: 8,
      constraints: { minMultiplier: 6, maxMultiplier: 10 },
    },
  },
  {
    id: 'multiplication_mixed',
    topicId: 'multiplication',
    name: 'Gemischte Aufgaben',
    description: 'Alle Einmaleins-Reihen gemischt',
    mathEngineParams: {
      difficultyMin: 1,
      difficultyMax: 10,
      constraints: { maxMultiplier: 10 },
    },
  },

  // ========== DIVISION ==========
  {
    id: 'division_by_2_5',
    topicId: 'division',
    name: 'Geteilt durch 2-5',
    description: 'Division durch 2, 3, 4, 5',
    mathEngineParams: {
      difficultyMin: 1,
      difficultyMax: 5,
      constraints: { maxDivisor: 5, allowRemainder: false },
    },
  },
  {
    id: 'division_by_6_10',
    topicId: 'division',
    name: 'Geteilt durch 6-10',
    description: 'Division durch 6, 7, 8, 9, 10',
    mathEngineParams: {
      difficultyMin: 4,
      difficultyMax: 8,
      constraints: { minDivisor: 6, maxDivisor: 10, allowRemainder: false },
    },
  },
  {
    id: 'division_with_remainder',
    topicId: 'division',
    name: 'Mit Rest',
    description: 'Division mit Rest',
    mathEngineParams: {
      difficultyMin: 3,
      difficultyMax: 10,
      constraints: { allowRemainder: true },
    },
  },

  // ========== GEOMETRY ==========
  {
    id: 'geometry_shape_recognition',
    topicId: 'geometry',
    name: 'Formen erkennen',
    description: 'Geometrische Formen erkennen und benennen',
    mathEngineParams: {
      difficultyMin: 1,
      difficultyMax: 5,
      constraints: { focusArea: 'shapeRecognition' },
    },
  },
  {
    id: 'geometry_vertices_edges',
    topicId: 'geometry',
    name: 'Ecken und Kanten zählen',
    description: 'Anzahl der Ecken und Kanten bestimmen',
    mathEngineParams: {
      difficultyMin: 3,
      difficultyMax: 8,
      constraints: { focusArea: 'verticesEdges' },
    },
  },

  // ========== SIZES ==========
  {
    id: 'sizes_length',
    topicId: 'sizes',
    name: 'Längen (cm, m)',
    description: 'Längen messen und umrechnen',
    mathEngineParams: {
      difficultyMin: 1,
      difficultyMax: 6,
      constraints: { measurementType: 'length' },
    },
  },
  {
    id: 'sizes_weight',
    topicId: 'sizes',
    name: 'Gewichte (g, kg)',
    description: 'Gewichte messen und umrechnen',
    mathEngineParams: {
      difficultyMin: 2,
      difficultyMax: 7,
      constraints: { measurementType: 'weight' },
    },
  },
  {
    id: 'sizes_time',
    topicId: 'sizes',
    name: 'Zeit (min, h)',
    description: 'Zeit ablesen und umrechnen',
    mathEngineParams: {
      difficultyMin: 2,
      difficultyMax: 8,
      constraints: { measurementType: 'time' },
    },
  },
];

/**
 * Look up a subtopic by its unique ID.
 * @param id - Subtopic ID (e.g., "multiplication_times_1_5")
 * @returns DojoSubtopic or undefined if not found
 */
export function getSubtopicById(id: string): DojoSubtopic | undefined {
  return DOJO_SUBTOPICS.find((s) => s.id === id);
}

/**
 * Get all subtopics for a specific main topic.
 * @param topicId - Main topic ID (e.g., "multiplication")
 * @returns Array of DojoSubtopic objects
 */
export function getSubtopicsByTopic(topicId: MathTopic): DojoSubtopic[] {
  return DOJO_SUBTOPICS.filter((s) => s.topicId === topicId);
}

/**
 * Get a list of all main topics that have subtopics defined.
 * @returns Array of unique MathTopic values
 */
export function getTopicsWithSubtopics(): MathTopic[] {
  const uniqueTopics = new Set(DOJO_SUBTOPICS.map((s) => s.topicId));
  return Array.from(uniqueTopics);
}
