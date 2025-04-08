import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ComparisonViewProps {
  differences: {
    added: string[];
    removed: string[];
    modified: {
      original: string;
      revised: string;
      explanation: string;
    }[];
  };
  summary: string;
  riskAssessment: {
    originalRisk: string;
    revisedRisk: string;
    improvements: string[];
    concerns: string[];
  };
}

export function ComparisonView({
  differences,
  summary,
  riskAssessment,
}: ComparisonViewProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Summary</h3>
        <p className="text-muted-foreground">{summary}</p>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Original Risk Level</h4>
            <p className="text-muted-foreground">{riskAssessment.originalRisk}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Revised Risk Level</h4>
            <p className="text-muted-foreground">{riskAssessment.revisedRisk}</p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="added" className="w-full">
        <TabsList>
          <TabsTrigger value="added">Added Clauses</TabsTrigger>
          <TabsTrigger value="removed">Removed Clauses</TabsTrigger>
          <TabsTrigger value="modified">Modified Clauses</TabsTrigger>
        </TabsList>
        <TabsContent value="added">
          <Card className="p-6">
            <ul className="list-disc pl-4 space-y-2">
              {differences.added.map((clause, index) => (
                <li key={index} className="text-muted-foreground">
                  {clause}
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
        <TabsContent value="removed">
          <Card className="p-6">
            <ul className="list-disc pl-4 space-y-2">
              {differences.removed.map((clause, index) => (
                <li key={index} className="text-muted-foreground">
                  {clause}
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
        <TabsContent value="modified">
          <Card className="p-6">
            <div className="space-y-6">
              {differences.modified.map((change, index) => (
                <div key={index} className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Original</h4>
                      <p className="text-muted-foreground">{change.original}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Revised</h4>
                      <p className="text-muted-foreground">{change.revised}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {change.explanation}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 