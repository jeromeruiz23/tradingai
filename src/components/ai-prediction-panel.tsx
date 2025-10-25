"use client";

import * as React from "react";
import { getAIPrediction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Info, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import type { Prediction } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function AIPredictionPanel({ 
  onExecuteTrade, 
  selectedPair,
  onAnalysis,
}: { 
  onExecuteTrade: (prediction: Prediction, type: "Buy" | "Sell") => void, 
  selectedPair: string,
  onAnalysis: () => Promise<string | null | undefined>,
}) {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [state, setState] = React.useState<{ prediction: Prediction | null; error: string | null }>({ prediction: null, error: null });
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsAnalyzing(true);
    setState({ prediction: null, error: null }); // Clear previous state

    try {
      const imageData = await onAnalysis();
      if (!imageData) {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: "Could not capture a screenshot of the chart.",
        });
        return;
      }
      
      const formData = new FormData();
      formData.append('tradingPair', selectedPair.replace('/', ''));
      formData.append('chartImage', imageData);

      const result = await getAIPrediction({ prediction: null, error: null }, formData);
      setState(result);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: result.error,
        });
      }

    } catch (e) {
       toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: "An unexpected error occurred.",
        });
    }
    finally {
      setIsAnalyzing(false);
    }
  }
  
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>AI Trade Analysis</CardTitle>
        <CardDescription>Account Balance: $100.00</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Button type="submit" className="w-full" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze & Predict Entry"
            )}
          </Button>
        </form>

        {state.prediction && (
          <div className="mt-6 space-y-4 animate-in fade-in-50">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>AI Recommendation for {state.prediction.tradingPair?.replace('USDT', '/USDT')} (Perp)</AlertTitle>
              <AlertDescription>{state.prediction.reasoning}</AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                    <p className="text-muted-foreground">Entry Point</p>
                    <p className="font-semibold">${state.prediction.entryPoint.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground">Lot Size</p>
                    <p className="font-semibold">{state.prediction.lotSize}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                 <div className="space-y-1">
                    <p className="text-muted-foreground">Stop Loss</p>
                    <p className="font-semibold text-destructive">${state.prediction.stopLoss.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground">Take Profit</p>
                    <p className="font-semibold text-accent">${state.prediction.takeProfit.toLocaleString()}</p>
                </div>
            </div>

          </div>
        )}
      </CardContent>
      {state.prediction && (
        <CardFooter className="flex gap-2 pt-4 border-t">
          <Button variant="outline" className="w-full" onClick={() => onExecuteTrade(state.prediction!, 'Sell')}>
            <ArrowDownCircle className="mr-2 h-4 w-4" />
            Sell / Short
          </Button>
          <Button className="w-full bg-accent hover:bg-accent/90" onClick={() => onExecuteTrade(state.prediction!, 'Buy')}>
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            Buy / Long
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
