import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Loader2, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface PriceEntry {
  metal: string;
  price_per_unit: number;
  unit: string;
  currency: string;
  timestamp: string;
}

export default function PricingIndex() {
  const [prices, setPrices] = useState<PriceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('price_index')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPrices(data || []);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Market Price Index</h1>
        <p className="text-muted-foreground">
          Reference prices for various metals. Final prices confirmed on inquiry.
        </p>
      </div>

      {prices.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No price data available</h3>
            <p className="text-muted-foreground">
              Price information will be updated regularly
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prices.map((price, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {price.metal}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-bold text-primary">
                      {price.currency} {price.price_per_unit.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">/{price.unit}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {format(new Date(price.timestamp), 'PPp')}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    * Reference price only. Final price confirmed on inquiry.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}