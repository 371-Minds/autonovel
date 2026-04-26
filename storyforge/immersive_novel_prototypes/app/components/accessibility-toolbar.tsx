
'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Type, 
  Volume2, 
  Eye, 
  Palette, 
  Zap,
  RotateCcw
} from 'lucide-react';
import { AccessibilitySettings } from '@/lib/types';

export function AccessibilityToolbar() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 'medium',
    colorBlindMode: false,
    textToSpeech: false,
    highContrast: false,
    reducedMotion: false
  });

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Apply settings to document
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xl: '20px'
    }[settings.fontSize];

    // High contrast
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }

    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const resetToDefaults = () => {
    setSettings({
      fontSize: 'medium',
      colorBlindMode: false,
      textToSpeech: false,
      highContrast: false,
      reducedMotion: false
    });
  };

  const fontSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'xl', label: 'Extra Large' }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Accessibility Settings
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetToDefaults}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Font Size */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-600" />
            <label className="text-sm font-medium">Text Size</label>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {fontSizeOptions.map((option) => (
              <Button
                key={option.value}
                variant={settings.fontSize === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSettings({...settings, fontSize: option.value as any})}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Toggle Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-600" />
            <label className="text-sm font-medium">Visual</label>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">High Contrast</span>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => 
                  setSettings({...settings, highContrast: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Colorblind Friendly</span>
              <Switch
                checked={settings.colorBlindMode}
                onCheckedChange={(checked) => 
                  setSettings({...settings, colorBlindMode: checked})
                }
              />
            </div>
          </div>
        </div>

        {/* Motion and Audio */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-600" />
            <label className="text-sm font-medium">Experience</label>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Reduced Motion</span>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => 
                  setSettings({...settings, reducedMotion: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Text-to-Speech</span>
              <Switch
                checked={settings.textToSpeech}
                onCheckedChange={(checked) => 
                  setSettings({...settings, textToSpeech: checked})
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
