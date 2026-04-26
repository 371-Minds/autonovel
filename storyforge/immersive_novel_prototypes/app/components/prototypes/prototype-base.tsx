
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Home, Settings, BookOpen } from 'lucide-react';
import { Prototype, Scene, UserState } from '@/lib/types';
import { AccessibilityToolbar } from '@/components/accessibility-toolbar';
import { FeedbackForm } from '@/components/feedback-form';
import Link from 'next/link';

interface PrototypeBaseProps {
  prototype: Prototype;
  scenes: Scene[];
  children: React.ReactNode;
  userState: UserState;
  onStateChange: (state: UserState) => void;
  className?: string;
}

export function PrototypeBase({ 
  prototype, 
  scenes, 
  children, 
  userState, 
  onStateChange, 
  className = '' 
}: PrototypeBaseProps) {
  const router = useRouter();
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Save progress whenever user state changes
  useEffect(() => {
    const saveProgress = async () => {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prototypeId: prototype.id,
            sceneId: userState.currentSceneId,
            choices: userState.choices,
            currentState: userState.metadata
          })
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    };

    saveProgress();
  }, [userState, prototype.id]);

  const currentScene = scenes.find(s => s.id === userState.currentSceneId);
  const progress = (userState.progress || 0);

  return (
    <div className={`min-h-screen ${className}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="text-white/80 hover:text-white">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Hub
                </Link>
              </Button>
              
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-white/60" />
                <div>
                  <h1 className="text-lg font-semibold text-white">{prototype.title}</h1>
                  <p className="text-sm text-white/60">{prototype.subtitle}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAccessibility(!showAccessibility)}
                className="border-white/20 text-white/80 hover:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFeedback(!showFeedback)}
                className="border-white/20 text-white/80 hover:text-white"
              >
                Feedback
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3 mt-3">
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-sm text-white/60 min-w-[60px]">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Accessibility Toolbar */}
        {showAccessibility && (
          <div className="border-t border-white/10 p-4">
            <AccessibilityToolbar />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <Card>
              <CardContent className="p-6">
                <FeedbackForm 
                  prototypeId={prototype.id}
                  onClose={() => setShowFeedback(false)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
