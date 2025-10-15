import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, TrendingUp, Shield, Zap, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const categories = [
    { name: 'Steel Products', icon: Package, count: '250+ items' },
    { name: 'Aluminum', icon: Package, count: '180+ items' },
    { name: 'Copper', icon: Package, count: '120+ items' },
    { name: 'Brass', icon: Package, count: '90+ items' },
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'Daily Price Updates',
      description: 'Real-time market price tracking for informed decisions',
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'All materials certified and tested for quality standards',
    },
    {
      icon: Zap,
      title: 'Fast RFQ Process',
      description: 'Submit inquiries and get quotes within 24 hours',
    },
  ];

  return (
    <div className="flex flex-col animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              India's Trusted B2B Metal Marketplace
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Source quality metals at competitive prices. Submit RFQs instantly and get personalized quotes from verified suppliers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/products')}
                className="text-lg"
              >
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/pricing-index')}
                className="text-lg bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20"
              >
                View Pricing Index
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card
                key={category.name}
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate('/products')}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose LohaKart?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="flex flex-col items-center text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Create an account and submit your first inquiry today
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/auth/register')}
            className="text-lg"
          >
            Register Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}