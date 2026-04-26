
'use client';

import { useState } from 'react';
import { AccessibilityToolbar } from './accessibility-toolbar';
import { Button } from './ui/button';
import { Settings, BookOpen, Zap } from 'lucide-react';

export function DashboardHeader() {
  const [showAccessibility, setShowAccessibility] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Novel Prototype Suite</h1>
              <p className="text-sm text-gray-600">Interactive Storytelling Research Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAccessibility(!showAccessibility)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Accessibility
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">5 Prototypes Active</span>
            </div>
          </div>
        </div>

        {showAccessibility && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <AccessibilityToolbar />
          </div>
        )}
      </div>
    </header>
  );
}
