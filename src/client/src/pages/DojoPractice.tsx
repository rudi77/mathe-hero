import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSubtopicById } from '@/types/dojoSubtopics';

export default function DojoPractice() {
  const [location, setLocation] = useLocation();

  // Extract subtopic from query params
  const params = new URLSearchParams(location.split('?')[1]);
  const subtopicId = params.get('subtopic');

  // Look up subtopic definition
  const subtopic = subtopicId ? getSubtopicById(subtopicId) : undefined;

  // Fallback to topic param for backward compatibility
  const topic = params.get('topic');
  const topicNames: Record<string, string> = {
    addition: 'Addition',
    subtraction: 'Subtraktion',
    multiplication: 'Multiplikation',
    division: 'Division',
    geometry: 'Geometrie',
    sizes: 'Größen',
  };

  // Determine display name and description
  const displayName = subtopic ? subtopic.name : topic ? topicNames[topic] : 'Unbekannt';
  const displayDescription = subtopic?.description;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 p-4">
      <div className="container max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/dojo')}
            className="mb-4"
          >
            ← Zurück zum Dojo
          </Button>
          <h1 className="text-4xl font-bold text-primary mb-2">
            🥋 {displayName}
          </h1>
          {displayDescription && (
            <p className="text-lg text-muted-foreground">{displayDescription}</p>
          )}
          {!displayDescription && (
            <p className="text-lg text-muted-foreground">Trainiere in Ruhe</p>
          )}
        </div>

        {/* Content Area */}
        <Card className="p-8 bg-white/80 backdrop-blur">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold mb-4">
              Übungen kommen bald!
            </h2>
            <p className="text-muted-foreground mb-8">
              Die Übungsfunktion wird in der nächsten Story implementiert.
            </p>
            <Button
              onClick={() => setLocation('/dojo')}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary"
            >
              Zurück zur Themenauswahl
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
