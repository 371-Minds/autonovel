
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { PROTOTYPES } from '@/lib/constants';
import { Play, Clock, Star, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PrototypeProgress {
  [key: string]: number;
}

export function PrototypeGrid() {
  const [progress, setProgress] = useState<PrototypeProgress>({});

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('prototype-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const getThemeClasses = (theme: string) => {
    const themes = {
      dark: 'border-gray-700 bg-gray-900/50 hover:bg-gray-900/70',
      surreal: 'border-purple-600/30 bg-purple-900/30 hover:bg-purple-900/50',
      warm: 'border-orange-200 bg-white/80 hover:bg-white/90',
      mystery: 'border-yellow-600/30 bg-gray-800/50 hover:bg-gray-800/70',
      bright: 'border-blue-300 bg-white/90 hover:bg-white/95'
    };
    return themes[theme as keyof typeof themes] || themes.dark;
  };

  const getTextClasses = (theme: string) => {
    const textThemes = {
      dark: 'text-gray-100',
      surreal: 'text-purple-100',
      warm: 'text-gray-800',
      mystery: 'text-gray-200',
      bright: 'text-gray-800'
    };
    return textThemes[theme as keyof typeof textThemes] || textThemes.dark;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {PROTOTYPES.map((prototype) => (
        <Card 
          key={prototype.id} 
          className={`group transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${getThemeClasses(prototype.theme)}`}
        >
          <CardHeader className="pb-2">
            <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
              <Image
                src={prototype.imageUrl}
                alt={prototype.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  {prototype.style}
                </Badge>
              </div>
            </div>
            
            <CardTitle className={`text-xl ${getTextClasses(prototype.theme)}`}>
              {prototype.title}
            </CardTitle>
            <CardDescription className={`${getTextClasses(prototype.theme)} opacity-80`}>
              {prototype.subtitle}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className={`text-sm ${getTextClasses(prototype.theme)} opacity-90`}>
              {prototype.description}
            </p>
            
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3 h-3" />
              <span className={getTextClasses(prototype.theme)}>
                {prototype.estimatedTime}
              </span>
            </div>
            
            {progress[prototype.id] > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className={getTextClasses(prototype.theme)}>Progress</span>
                  <span className={getTextClasses(prototype.theme)}>{Math.round(progress[prototype.id] || 0)}%</span>
                </div>
                <Progress value={progress[prototype.id] || 0} className="h-2" />
              </div>
            )}
            
            <div className="flex flex-wrap gap-1 mb-4">
              {prototype.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button asChild className="flex-1 group/button">
                <Link href={`/prototype/${prototype.id}`} className="flex items-center gap-2">
                  <Play className="w-4 h-4 group-hover/button:scale-110 transition-transform" />
                  {progress[prototype.id] > 0 ? 'Continue' : 'Start'}
                </Link>
              </Button>
              
              <Button variant="outline" size="icon" asChild>
                <Link href={`/prototype/${prototype.id}/info`}>
                  <Info className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
