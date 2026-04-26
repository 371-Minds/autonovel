
'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Headphones,
  Eye,
  Zap,
  Database,
  Globe
} from 'lucide-react';

const specifications = [
  {
    category: 'Platform Compatibility',
    icon: Monitor,
    items: [
      { name: 'Desktop Browsers', status: 'Full Support', description: 'Chrome, Firefox, Safari, Edge' },
      { name: 'Mobile Devices', status: 'Optimized', description: 'iOS Safari, Android Chrome' },
      { name: 'Tablet Experience', status: 'Enhanced', description: 'Touch-optimized interface' },
      { name: 'E-Reader Compatible', status: 'Basic', description: 'Text-based fallback mode' }
    ]
  },
  {
    category: 'Advanced Features',
    icon: Zap,
    items: [
      { name: 'AR Integration', status: 'Mockup', description: 'QR codes and simulated interactions' },
      { name: 'Audio System', status: 'Interactive', description: 'Adaptive soundtrack and sound effects' },
      { name: 'Save States', status: 'Local Storage', description: 'Progress preserved across sessions' },
      { name: 'Analytics', status: 'Built-in', description: 'Choice tracking and user behavior' }
    ]
  },
  {
    category: 'Accessibility',
    icon: Eye,
    items: [
      { name: 'Screen Readers', status: 'Compatible', description: 'ARIA labels and semantic HTML' },
      { name: 'Keyboard Navigation', status: 'Full Support', description: 'Tab-based interface control' },
      { name: 'Visual Adjustments', status: 'Customizable', description: 'Font size, contrast, colors' },
      { name: 'Motor Accessibility', status: 'Supported', description: 'Large click targets, hover alternatives' }
    ]
  },
  {
    category: 'Technical Architecture',
    icon: Database,
    items: [
      { name: 'Frontend Framework', status: 'Next.js 14', description: 'React 18 with App Router' },
      { name: 'Database', status: 'PostgreSQL', description: 'Prisma ORM for data management' },
      { name: 'Styling', status: 'Tailwind CSS', description: 'Responsive and accessible design' },
      { name: 'Animations', status: 'Framer Motion', description: 'Smooth transitions and interactions' }
    ]
  }
];

const getStatusColor = (status: string) => {
  const colors = {
    'Full Support': 'bg-green-500',
    'Optimized': 'bg-blue-500',
    'Enhanced': 'bg-purple-500',
    'Compatible': 'bg-green-500',
    'Interactive': 'bg-blue-500',
    'Built-in': 'bg-purple-500',
    'Customizable': 'bg-yellow-500',
    'Supported': 'bg-green-500',
    'Basic': 'bg-gray-500',
    'Mockup': 'bg-orange-500',
    'Local Storage': 'bg-blue-500',
    'Next.js 14': 'bg-black',
    'PostgreSQL': 'bg-blue-600',
    'Tailwind CSS': 'bg-cyan-500',
    'Framer Motion': 'bg-pink-500'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-500';
};

export function TechnicalSpecs() {
  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Technical Specifications</h2>
        <p className="text-gray-600">Comprehensive feature support and compatibility details</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {specifications.map((spec, index) => (
          <Card key={index} className="h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                  <spec.icon className="w-5 h-5 text-white" />
                </div>
                {spec.category}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {spec.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-white text-xs ${getStatusColor(item.status)}`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-blue-500">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Scalability & Future Development</h3>
            <p className="text-blue-800 text-sm leading-relaxed mb-3">
              This prototype suite is designed with modularity and extensibility in mind. Each component 
              can be scaled for full-length novels with additional chapters, enhanced with real AR/VR 
              integration, and deployed across multiple platforms.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-blue-700 border-blue-300">Full Novel Length</Badge>
              <Badge variant="outline" className="text-blue-700 border-blue-300">VR Integration Ready</Badge>
              <Badge variant="outline" className="text-blue-700 border-blue-300">Multi-platform Deploy</Badge>
              <Badge variant="outline" className="text-blue-700 border-blue-300">Cloud Sync</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
