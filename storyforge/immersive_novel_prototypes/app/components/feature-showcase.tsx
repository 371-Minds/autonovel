
'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Zap, 
  Users, 
  Palette, 
  Volume2, 
  Eye, 
  Gamepad2,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Dynamic Branching',
    description: 'Experience stories that adapt and evolve based on your choices with real-time consequences.',
    color: 'text-yellow-500'
  },
  {
    icon: Users,
    title: 'Multi-Perspective',
    description: 'Switch between different character viewpoints to see the story from multiple angles.',
    color: 'text-blue-500'
  },
  {
    icon: Palette,
    title: 'Immersive Visuals',
    description: 'Each prototype features distinct visual themes that enhance the storytelling experience.',
    color: 'text-purple-500'
  },
  {
    icon: Volume2,
    title: 'Adaptive Audio',
    description: 'Dynamic soundscapes and music that respond to story progression and mood.',
    color: 'text-green-500'
  },
  {
    icon: Eye,
    title: 'AR Integration',
    description: 'Explore augmented reality mockups that bring interactive elements into the real world.',
    color: 'text-red-500'
  },
  {
    icon: Gamepad2,
    title: 'Gamification',
    description: 'Unlock achievements, solve puzzles, and track progress in adventure-style narratives.',
    color: 'text-pink-500'
  }
];

export function FeatureShowcase() {
  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Revolutionary Features</h2>
        <p className="text-gray-600">Discover what makes each prototype unique</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
              <div className="flex items-center gap-1 mt-3 text-sm text-blue-600 group-hover:gap-2 transition-all duration-300">
                <span>Learn more</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
