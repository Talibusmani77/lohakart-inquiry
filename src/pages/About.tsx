import { Card, CardContent } from '@/components/ui/card';
import { Shield, Users, Award, Zap } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'All materials are certified and tested to meet industry standards',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Dedicated support team available to assist with your inquiries',
    },
    {
      icon: Award,
      title: 'Industry Experience',
      description: 'Over 20 years of expertise in B2B metal trading',
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Efficient logistics network ensuring timely delivery across India',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About LohaKart</h1>
        
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg text-muted-foreground">
            LohaKart is India's leading B2B marketplace for quality metals and industrial materials.
            We connect buyers with verified suppliers, offering a transparent and efficient platform
            for metal procurement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {values.map((value) => (
            <Card key={value.title}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              To revolutionize the metal trading industry in India by providing a transparent,
              efficient, and reliable platform that connects buyers and suppliers, ensuring
              quality materials at competitive prices.
            </p>
            <p className="text-muted-foreground">
              We leverage technology to simplify the procurement process, from inquiry submission
              to final delivery, making it easier for businesses to source the materials they need
              to grow and succeed.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}