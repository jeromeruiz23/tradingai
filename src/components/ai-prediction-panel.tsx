"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
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

const initialState: { prediction: Prediction | null; error: string | null } = {
  prediction: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        "Analyze & Predict Entry"
      )}
    </Button>
  );
}

export function AIPredictionPanel({ 
  onExecuteTrade, 
  selectedPair,
  onAnalysis,
  chartImage,
}: { 
  onExecuteTrade: (prediction: Prediction, type: "Buy" | "Sell") => void, 
  selectedPair: string,
  onAnalysis: () => Promise<string | null | undefined>,
  chartImage: string | null,
}) {
  const [state, formAction] = useActionState(getAIPrediction, initialState);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleFormAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const imageData = await onAnalysis();
    if (imageData && formRef.current) {
      const formData = new FormData(formRef.current);
      formData.set('chartImage', imageData);
      formAction(formData);
    }
  }

  React.useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: state.error,
      });
    }
  }, [state.error, toast]);
  
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>AI Trade Analysis</CardTitle>
        <CardDescription>Account Balance: $100.00</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <form onSubmit={handleFormAction} ref={formRef} className="space-y-4">
          <input type="hidden" name="tradingPair" value={selectedPair.replace('/', '')} />
          <input type="hidden" name="chartImage" value={chartImage || ''} />
          <SubmitButton />
        </form>

        {state.prediction && (
          <div className="mt-6 space-y-4 animate-in fade-in-50">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>AI Recommendation for {state.prediction.tradingPair?.replace('USDT', '/USDT')}</AlertTitle>
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
