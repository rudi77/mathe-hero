import React from 'react';
import { useLocation } from 'wouter';
import type { MathTopic } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const topics: Array<{ id: MathTopic; name: string; icon: string; color: string }> = [
  { id: 'addition', name: 'Addition', icon: '➕', color: 'from-blue-400 to-blue-600' },
  { id: 'subtraction', name: 'Subtraktion', icon: '➖', color: 'from-purple-400 to-purple-600' },
  { id: 'multiplication', name: 'Multiplikation', icon: '✖️', color: 'from-pink-400 to-pink-600' },
  { id: 'division', name: 'Division', icon: '➗', color: 'from-orange-400 to-orange-600' },
  { id: 'geometry', name: 'Geometrie', icon: '📐', color: 'from-green-400 to-green-600' },
  { id: 'sizes', name: 'Größen', icon: '📏', color: 'from-yellow-400 to-yellow-600' },
];

export default function TopicSelection() {
  const [, setLocation] = useLocation();

  const handleTopicSelect = (topic: MathTopic) => {
    setLocation(`/math?topic=${topic}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      <div className="container max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-4"
          >
            ← Zurück
          </Button>
          <h1 className="text-4xl font-bold text-primary mb-2">
            Wähle ein Thema
          </h1>
          <p className="text-lg text-muted-foreground">
            Welche Matheaufgaben möchtest du üben?
          </p>
        </div>

        {/* Topic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <Card
              key={topic.id}
              className="group cursor-pointer overflow-hidden border-4 border-white shadow-lg hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 focus-within:ring-4 focus-within:ring-primary focus-within:ring-offset-2"
              onClick={() => handleTopicSelect(topic.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTopicSelect(topic.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${topic.name} üben`}
            >
              <div className={`bg-gradient-to-br ${topic.color} p-8 text-white`}>
                <div className="text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-200">
                    {topic.icon}
                  </div>
                  <h3 className="text-2xl font-bold">
                    {topic.name}
                  </h3>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Mixed Practice Option */}
        <Card
          className="mt-6 cursor-pointer overflow-hidden border-4 border-white shadow-lg hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 focus-within:ring-4 focus-within:ring-primary focus-within:ring-offset-2"
          onClick={() => handleTopicSelect('mixed')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTopicSelect('mixed');
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Gemischte Aufgaben - Alle Themen zusammen üben"
        >
          <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 p-6 text-white">
            <div className="text-center">
              <div className="text-5xl mb-2">🎲</div>
              <h3 className="text-xl font-bold">Gemischte Aufgaben</h3>
              <p className="text-sm opacity-90">Alle Themen zusammen üben</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

