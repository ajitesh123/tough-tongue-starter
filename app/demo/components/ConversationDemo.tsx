import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConversationDemoProps {
  scenarioId: string;
}

export function ConversationDemo({ scenarioId }: ConversationDemoProps) {
  // Function to get embed URL
  const getEmbedUrl = (id: string) => {
    return `https://app.toughtongueai.com/embed/${id}?bg=black&skipPrecheck=true`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Practice Conversation</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-gray-100 p-4">
          <p className="text-sm text-gray-600">
            <strong>Instructions:</strong> This embedded conversation will use your microphone and camera.
            Click "Start" when prompted and begin speaking naturally to the AI.
          </p>
        </div>
        
        <div className="w-full" style={{ minHeight: "700px" }}>
          <iframe
            src={getEmbedUrl(scenarioId)}
            title="Tough Tongue Conversation"
            width="100%"
            height="700px"
            frameBorder="0"
            allow="microphone; camera; display-capture"
            className="w-full h-full"
            style={{ minHeight: "700px" }}
          />
        </div>
      </CardContent>
    </Card>
  );
} 