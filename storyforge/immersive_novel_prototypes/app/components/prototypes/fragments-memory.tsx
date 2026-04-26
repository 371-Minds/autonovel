
'use client';

import { useState, useEffect } from 'react';
import { PrototypeBase } from './prototype-base';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Prototype, Scene, UserState } from '@/lib/types';
import { Brain, Map, Sparkles, Eye, Lock, Unlock } from 'lucide-react';
import Image from 'next/image';

interface FragmentsMemoryProps {
  prototype: Prototype;
}

const memoryFragments: Scene[] = [
  {
    id: 'childhood_garden',
    title: 'The Garden of First Memories',
    content: `Sunlight filters through leaves that shimmer like stained glass windows of the mind. You are seven years old, chasing butterflies that dissolve into geometric patterns when you reach for them.

Your grandmother sits on a wooden bench, her voice weaving stories about reality and dreams. "Memory is not a recording, child," she says, her words echoing across time. "It is a painting that changes each time you look at it."

The garden exists in multiple seasons simultaneously – spring blossoms overlap with autumn leaves, snow mingles with summer rain. This is how memory works: all moments existing at once, waiting to be experienced again.

As you focus, you realize this memory contains others nested within it. The butterfly's wings show glimpses of your first day of school, reflected in droplets of rain are faces of friends you haven't met yet.`,
    metadata: {
      character: 'Childhood Self',
      location: 'Grandmother\'s Garden',
      mood: 'nostalgic',
      backgroundImage: 'https://cdn.abacus.ai/images/55ee6f15-9194-443d-b4a2-ef287e8eabee.png',
      unlocked: true,
      connections: ['mirror_self', 'lost_love']
    }
  },
  {
    id: 'mirror_self',
    title: 'The Mirror That Remembers',
    content: `In the bathroom of your first apartment, you stare into a mirror that reflects not just your face, but all the faces you've worn throughout your life. The glass surface ripples like water disturbed by memory.

At twenty-three, you are discovering who you might become. The reflection shifts: sometimes confident, sometimes terrified, sometimes a stranger wearing your features. Each version speaks in turn:

"I am the you who takes risks," says one reflection.
"I am the you who stays safe," whispers another.
"I am the you who wonders if any of this is real," admits a third.

The mirror begins to crack, not breaking but opening pathways to other memories. Through each fracture, you glimpse moments of decision that haven't happened yet – or have they already occurred in some parallel fold of consciousness?

You reach toward the glass, and your reflection reaches back. When your fingertips meet, the boundary between observer and observed dissolves entirely.`,
    metadata: {
      character: 'Young Adult Self',
      location: 'First Apartment',
      mood: 'introspective',
      backgroundImage: 'https://cdn.abacus.ai/images/3e072ddf-3bd5-493f-9b73-0056dce3a78d.png',
      unlocked: false,
      connections: ['childhood_garden', 'void_walker', 'professor_study']
    }
  },
  {
    id: 'lost_love',
    title: 'The Photograph That Breathes',
    content: `On your desk sits a photograph that moves when you're not looking directly at it. Sarah's laugh seems to echo from the static image, her eyes following your movements around the room.

This memory exists in the space between what was and what could have been. In one version, you moved to Paris together, opening that little bookshop you dreamed about. In another, the argument that ended everything never happened.

"Parallel possibilities," you whisper to the photograph. Sarah's image seems to nod, then fade into a woman you've never met but somehow know completely. This is the nature of deep connections – they exist across all possible versions of your life.

The photograph begins to burn at the edges, not destroyed but transformed. As it burns, it reveals layers beneath: other loves, other losses, other moments when your heart opened to the infinite complexity of human connection.

You realize that losing someone doesn't make them disappear – it makes them eternal, preserved in the amber of memory where they can never change, never leave, never stop loving you back.`,
    metadata: {
      character: 'Heartbroken Self',
      location: 'Apartment Bedroom',
      mood: 'melancholic',
      backgroundImage: 'https://cdn.abacus.ai/images/196810a0-b46f-48a4-8db6-0bdcf8b4fb74.png',
      unlocked: false,
      connections: ['childhood_garden', 'void_walker']
    }
  },
  {
    id: 'professor_study',
    title: 'The Library of Unread Books',
    content: `Your study at forty-five is filled with books that write themselves as you watch. Shelves stretch impossibly high, filled with volumes containing every thought you've ever had and many you haven't thought yet.

As a philosophy professor, you've spent years exploring the nature of consciousness, but tonight the questions explore you. A book titled "The Observer and the Observed" falls open in your hands, its pages blank until you begin to read – then words appear as your eyes move across the paper.

"Consciousness is not produced by the brain," the book writes itself as you read. "Consciousness produces the brain that believes it produces consciousness. This is the fundamental recursion of awareness examining itself."

Your reflection in the window overlooks the campus where you've taught for twenty years. But the reflection moves independently, lecturing to students who might be thoughts, might be dreams, might be other versions of yourself scattered across parallel dimensions of possibility.

The boundary between teacher and student, between self and world, begins to dissolve. You realize you've been reading about yourself in a book written by yourself, observed by yourself, in an infinite loop of consciousness discovering its own nature.`,
    metadata: {
      character: 'Professor Self',
      location: 'University Study',
      mood: 'philosophical',
      backgroundImage: 'https://cdn.abacus.ai/images/196810a0-b46f-48a4-8db6-0bdcf8b4fb74.png',
      unlocked: false,
      connections: ['mirror_self', 'void_walker', 'final_awakening']
    }
  },
  {
    id: 'void_walker',
    title: 'The Space Between Thoughts',
    content: `In the gap between sleeping and waking, you find yourself in a place that isn't a place, experiencing a time that isn't time. This is the void – not empty, but full of infinite potential.

Here, you encounter other versions of yourself: the child who never grew up, the adult who never learned to play, the elder who remembered how to be young. They gather in a circle that has no center, speaking words that have no sound but carry perfect meaning.

"We are all the same dreamer," says the child-self.
"Having different dreams," adds the adult-self.
"Of being different people," concludes the elder-self.

In this space, all your memories exist simultaneously. Childhood garden and professor's study occupy the same coordinates. Love and loss are revealed as different faces of the same experience. The mirror that remembers and the photograph that breathes are both reflections of this central truth: consciousness playing hide-and-seek with itself.

You realize this void isn't empty – it's pregnant with possibility. Every thought, every experience, every choice emerges from this fundamental awareness that you are, have always been, and will always be.

The void begins to smile, and you recognize the expression. It's your own.`,
    metadata: {
      character: 'Pure Consciousness',
      location: 'The Void',
      mood: 'transcendent',
      backgroundImage: 'https://cdn.abacus.ai/images/3e072ddf-3bd5-493f-9b73-0056dce3a78d.png',
      unlocked: false,
      connections: ['mirror_self', 'lost_love', 'professor_study', 'final_awakening']
    }
  },
  {
    id: 'final_awakening',
    title: 'The Dreamer Awakens',
    content: `You open your eyes and realize you've been reading a book about someone who might be you, might be everyone, might be no one at all. The book closes itself and fades, but the understanding remains.

All the fragments of memory, all the selves you've encountered, all the places and times and possibilities – they were chapters in a story consciousness tells itself about being human. The garden was real and metaphor, the mirror was literal and symbolic, the void was both empty and full.

You stand up from wherever you were sitting – a chair, a bed, a park bench, the ground of being itself – and stretch. The world around you looks the same but feels entirely different. Every person you see carries all their selves within them. Every object holds the memory of all its possible states.

This is the final fragment: the recognition that fragmentation is an illusion. There is only one consciousness, one dreamer, one awareness looking out through infinite eyes, thinking infinite thoughts, living infinite lives.

You smile and close the book you realize you've been writing all along. Tomorrow, someone else will find it and begin their own journey through the fragments of memory, never suspecting they are reading about themselves.

*This nonlinear exploration revealed the nature of consciousness through poetic fragments, allowing the reader to discover meaning through their own unique path of navigation.*`,
    metadata: {
      character: 'Integrated Self',
      location: 'Here and Now',
      mood: 'enlightened',
      backgroundImage: 'https://cdn.abacus.ai/images/55ee6f15-9194-443d-b4a2-ef287e8eabee.png',
      unlocked: false,
      connections: []
    }
  }
];

export function FragmentsMemory({ prototype }: FragmentsMemoryProps) {
  const [userState, setUserState] = useState<UserState>({
    currentSceneId: 'childhood_garden',
    choices: {},
    achievements: [],
    progress: 0,
    metadata: { visitedScenes: ['childhood_garden'] }
  });

  const [showMap, setShowMap] = useState(true);

  const currentScene = memoryFragments.find(s => s.id === userState.currentSceneId);
  const visitedScenes = userState.metadata?.visitedScenes || [];

  // Update scene availability based on visited scenes and connections
  const getAvailableScenes = () => {
    return memoryFragments.map(scene => {
      const isVisited = visitedScenes.includes(scene.id);
      const isUnlocked = scene.metadata?.unlocked || 
        (scene.metadata?.connections || []).some((connection: string) => visitedScenes.includes(connection));
      
      return {
        ...scene,
        metadata: {
          ...scene.metadata,
          unlocked: isUnlocked || isVisited
        }
      };
    });
  };

  const navigateToScene = (sceneId: string) => {
    const newVisitedScenes = [...visitedScenes];
    if (!newVisitedScenes.includes(sceneId)) {
      newVisitedScenes.push(sceneId);
    }

    const progress = (newVisitedScenes.length / memoryFragments.length) * 100;

    setUserState({
      ...userState,
      currentSceneId: sceneId,
      progress,
      metadata: { 
        ...userState.metadata,
        visitedScenes: newVisitedScenes
      }
    });
    setShowMap(false);
  };

  const availableScenes = getAvailableScenes();

  if (!currentScene) return null;

  return (
    <PrototypeBase
      prototype={prototype}
      scenes={memoryFragments}
      userState={userState}
      onStateChange={setUserState}
      className="theme-surreal"
    >
      <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
        {showMap ? (
          // Memory Map View
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-purple-100 mb-4 flex items-center justify-center gap-3">
                <Brain className="w-10 h-10 text-purple-300" />
                Memory Navigation
              </h1>
              <p className="text-purple-200 text-lg max-w-2xl mx-auto">
                Consciousness is not linear. Choose any fragment to explore. Each memory connects to others, 
                creating a web of experience that transcends time and identity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableScenes.map((scene) => {
                const isVisited = visitedScenes.includes(scene.id);
                const isUnlocked = scene.metadata?.unlocked;
                
                return (
                  <Card 
                    key={scene.id}
                    className={`group transition-all duration-500 cursor-pointer ${
                      isUnlocked 
                        ? 'bg-purple-900/30 border-purple-600/30 hover:bg-purple-800/40 hover:border-purple-500/50' 
                        : 'bg-gray-900/50 border-gray-700/50 cursor-not-allowed'
                    } ${isVisited ? 'ring-2 ring-purple-400/50' : ''}`}
                    onClick={() => isUnlocked && navigateToScene(scene.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {isUnlocked ? (
                            <Unlock className="w-4 h-4 text-purple-400" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-500" />
                          )}
                          {isVisited && <Eye className="w-4 h-4 text-purple-300" />}
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            isUnlocked ? 'bg-purple-800/50 text-purple-200' : 'bg-gray-700/50 text-gray-400'
                          }`}
                        >
                          {scene.metadata?.character}
                        </Badge>
                      </div>
                      
                      <h3 className={`text-lg font-semibold mb-2 ${
                        isUnlocked ? 'text-purple-100' : 'text-gray-500'
                      }`}>
                        {scene.title}
                      </h3>
                      
                      <p className={`text-sm mb-4 line-clamp-3 ${
                        isUnlocked ? 'text-purple-200' : 'text-gray-600'
                      }`}>
                        {scene.content.substring(0, 150)}...
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className={`${isUnlocked ? 'text-purple-300' : 'text-gray-500'}`}>
                          {scene.metadata?.location}
                        </span>
                        <div className="flex items-center gap-1">
                          <Sparkles className={`w-3 h-3 ${isUnlocked ? 'text-purple-400' : 'text-gray-500'}`} />
                          <span className={`${isUnlocked ? 'text-purple-300' : 'text-gray-500'}`}>
                            {scene.metadata?.mood}
                          </span>
                        </div>
                      </div>

                      {/* Connection indicators */}
                      {isUnlocked && (
                        <div className="mt-3 pt-3 border-t border-purple-700/30">
                          <div className="text-xs text-purple-400 mb-1">Connected to:</div>
                          <div className="flex flex-wrap gap-1">
                            {(scene.metadata?.connections || []).slice(0, 3).map((connectionId: string) => {
                              const connectedScene = memoryFragments.find(s => s.id === connectionId);
                              return (
                                <Badge 
                                  key={connectionId} 
                                  variant="outline" 
                                  className="text-xs border-purple-600/50 text-purple-300"
                                >
                                  {connectedScene?.title?.split(' ').slice(0, 2).join(' ')}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <p className="text-purple-300 text-sm">
                {visitedScenes.length} of {memoryFragments.length} fragments explored
              </p>
            </div>
          </div>
        ) : (
          // Individual Memory Fragment View
          <div 
            className="relative min-h-screen bg-cover bg-center bg-fixed"
            style={{ 
              backgroundImage: `url(${currentScene.metadata?.backgroundImage || prototype.imageUrl})`
            }}
          >
            <div className="absolute inset-0 bg-purple-900/60 backdrop-blur-sm" />
            
            <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
              <div className="space-y-6">
                {/* Navigation Header */}
                <div className="flex items-center justify-between">
                  <Button
                    onClick={() => setShowMap(true)}
                    variant="outline"
                    className="border-purple-400/50 text-purple-200 hover:bg-purple-800/30"
                  >
                    <Map className="w-4 h-4 mr-2" />
                    Memory Map
                  </Button>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-purple-800/50 text-purple-200">
                      {currentScene.metadata?.character}
                    </Badge>
                    <Badge variant="outline" className="border-purple-400/50 text-purple-300">
                      {currentScene.metadata?.location}
                    </Badge>
                  </div>
                </div>

                {/* Memory Fragment Card */}
                <Card className="bg-purple-900/20 border-purple-600/30 backdrop-blur-lg">
                  <CardContent className="p-8">
                    <h1 className="text-3xl font-bold text-purple-100 mb-6 flex items-center gap-3">
                      <Sparkles className="w-8 h-8 text-purple-300" />
                      {currentScene.title}
                    </h1>
                    
                    <div className="text-purple-100 leading-relaxed mb-8 space-y-4">
                      {currentScene.content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-lg">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Connected Memories */}
                    {currentScene.metadata?.connections && 
                     (currentScene.metadata.connections as string[]).length > 0 && (
                      <div className="space-y-4 pt-6 border-t border-purple-600/30">
                        <h3 className="text-lg font-medium text-purple-200 flex items-center gap-2">
                          <Brain className="w-5 h-5" />
                          Connected Memories
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(currentScene.metadata.connections as string[]).map((connectionId) => {
                            const connectedScene = availableScenes.find(s => s.id === connectionId);
                            if (!connectedScene?.metadata?.unlocked) return null;
                            
                            return (
                              <Button
                                key={connectionId}
                                onClick={() => navigateToScene(connectionId)}
                                variant="outline"
                                className="border-purple-500/50 bg-purple-800/20 text-purple-200 hover:bg-purple-700/30 p-4 h-auto text-left justify-start"
                              >
                                <div>
                                  <div className="font-medium text-sm text-purple-100">
                                    {connectedScene.title}
                                  </div>
                                  <div className="text-xs text-purple-300 opacity-80">
                                    {connectedScene.metadata?.mood} • {connectedScene.metadata?.character}
                                  </div>
                                </div>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Final Scene Completion */}
                    {currentScene.id === 'final_awakening' && (
                      <div className="text-center pt-6 border-t border-purple-600/30">
                        <Badge variant="secondary" className="bg-purple-700/50 text-purple-100 mb-4">
                          CONSCIOUSNESS INTEGRATION COMPLETE
                        </Badge>
                        <p className="text-purple-200 mb-6">
                          You have explored the fragments and discovered their unity. 
                          The journey through memory has revealed the nature of awareness itself.
                        </p>
                        <Button
                          onClick={() => setUserState({
                            currentSceneId: 'childhood_garden',
                            choices: {},
                            achievements: [],
                            progress: 0,
                            metadata: { visitedScenes: ['childhood_garden'] }
                          })}
                          className="bg-purple-600 hover:bg-purple-500"
                        >
                          <Brain className="w-4 h-4 mr-2" />
                          Begin Again
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </PrototypeBase>
  );
}
