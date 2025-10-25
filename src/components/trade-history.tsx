"use client";

import type { Trade } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TradeHistoryProps {
  trades: Trade[];
  onCloseTrade: (tradeId: string) => void;
}

export function TradeHistory({ trades, onCloseTrade }: TradeHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Positions</CardTitle>
        <CardDescription>
          A history of your simulated trades.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pair</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Entry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">P/L ($)</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.length > 0 ? (
              trades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>{trade.pair}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "font-semibold",
                        trade.type === "Buy"
                          ? "text-accent"
                          : "text-destructive"
                      )}
                    >
                      {trade.type}
                    </span>
                  </TableCell>
                  <TableCell>${trade.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        trade.status === "Open" ? "secondary" : "default"
                      }
                      className={cn(trade.status === 'Closed' && 'bg-muted-foreground')}
                    >
                      {trade.status}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium",
                      trade.pnl > 0 && "text-accent",
                      trade.pnl < 0 && "text-destructive"
                    )}
                  >
                    {trade.pnl.toFixed(2)}
                  </TableCell>
                   <TableCell className="text-center">
                    {trade.status === "Open" ? (
                      <Button variant="outline" size="sm" onClick={() => onCloseTrade(trade.id)}>
                        Close
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No trades yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
