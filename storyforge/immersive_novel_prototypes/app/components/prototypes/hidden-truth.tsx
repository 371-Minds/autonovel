
'use client';

import { useState, useEffect } from 'react';
import { PrototypeBase } from './prototype-base';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Prototype, Scene, UserState } from '@/lib/types';
import { Search, Eye, Camera, FileText, QrCode, Lightbulb } from 'lucide-react';

interface HiddenTruthProps {
  prototype: Prototype;
}

const clues: { [key: string]: any } = {
  'fingerprint': {
    name: 'Fingerprint Analysis',
    description: 'Partial print found on the window latch',
    arContent: 'Scan QR code to view 3D fingerprint model',
    unlocked: false
  },
  'receipt': {
    name: 'Coffee Shop Receipt',
    description: 'Timestamped 30 minutes before incident',
    arContent: 'AR overlay shows receipt details and location',
    unlocked: false
  },
  'photograph': {
    name: 'Security Camera Still',
    description: 'Blurry figure near the building',
    arContent: 'Motion tracking reveals gait analysis',
    unlocked: false
  },
  'witness': {
    name: 'Witness Statement',
    description: 'Neighbor reports unusual activity',
    arContent: 'Voice analysis and 3D crime scene reconstruction',
    unlocked: false
  }
};

const scenes: Scene[] = [
  {
    id: 'crime_scene',
    title: 'The Missing Manuscript',
    content: `Professor Elena Vasquez's office looks like a tornado swept through it. Books scattered across the floor, desk drawers yanked open, papers everywhere. But you notice something others missed – this isn't random vandalism. Someone was searching for something specific.

The university's security guard, Tom, shifts nervously by the door. "Nothing like this has ever happened here," he says. "Professor Vasquez was supposed to present some big research at tomorrow's conference. Something about... what did she call it... 'digital consciousness'?"

You're Detective Sarah Chen, called in because this isn't just a burglary. Professor Vasquez is missing, and her groundbreaking research on artificial intelligence has vanished with her. The kind of research that could be worth millions to the right buyer.

Your phone buzzes with a message from the tech lab: "AR investigation kit ready. New augmented reality tools will let you see evidence in three dimensions and access hidden digital clues."

The case is just beginning, but you already sense layers of deception. In the modern age of digital crime, nothing is quite what it appears to be.`,
    choices: [
      {
        id: 'examine_office',
        text: 'Use AR tools to examine the office thoroughly',
        consequence: 'Uncover hidden digital clues',
        nextSceneId: 'digital_clues'
      },
      {
        id: 'interview_guard',
        text: 'Question the security guard about unusual activity',
        consequence: 'Get witness perspective',
        nextSceneId: 'witness_testimony'
      },
      {
        id: 'check_surveillance',
        text: 'Review security footage with enhancement tools',
        consequence: 'Analyze visual evidence',
        nextSceneId: 'surveillance_analysis'
      }
    ],
    metadata: {
      location: 'University Office',
      mood: 'mysterious',
      backgroundImage: 'https://cdn.abacus.ai/images/81f0c3d4-7ad2-43c2-8802-cb11f3a327d3.png'
    }
  },
  {
    id: 'digital_clues',
    title: 'AR Investigation Mode',
    content: `You activate the AR investigation system, and the office transforms. Digital overlays highlight areas of interest: heat signatures show recent human activity, chemical sensors detect unusual substances, and 3D reconstruction reveals the exact sequence of the search.

**[AR ELEMENT: QR CODE PLACEHOLDER]** *Scan to view 3D crime scene reconstruction*

The AR system reveals what your eyes alone couldn't see:
- A hidden USB port behind the bookshelf, recently accessed
- Microscopic fibers from expensive clothing on the windowsill
- Digital fingerprints on the computer keyboard showing someone tried multiple passwords

But the most intriguing discovery is a pattern in the mess. Books on artificial intelligence and consciousness were specifically targeted, while valuable items like the antique clock and expensive fountain pen were ignored.

**[INTERACTIVE TEXTURE SIMULATION]** *Feel the rough surface of forced entry marks*

Your AR glasses overlay a timeline: Professor Vasquez left at 6 PM yesterday. The intrusion occurred between 8-10 PM. But security logs show no unauthorized entry. Someone with legitimate access did this.

The deeper you investigate, the more complex the mystery becomes. This isn't just about a missing professor – it's about technology that could reshape how we understand human consciousness.`,
    choices: [
      {
        id: 'analyze_digital',
        text: 'Focus on digital evidence and computer intrusion',
        consequence: 'Uncover the technology angle',
        nextSceneId: 'tech_conspiracy'
      },
      {
        id: 'investigate_insider',
        text: 'Investigate university staff with access',
        consequence: 'Pursue the insider theory',
        nextSceneId: 'insider_investigation'
      }
    ],
    metadata: {
      location: 'University Office (AR Mode)',
      mood: 'investigative',
      backgroundImage: 'https://cdn.abacus.ai/images/d6d31798-9ba6-4014-bf2a-80d623e6bfed.png'
    }
  },
  {
    id: 'witness_testimony',
    title: 'The Guard\'s Secret',
    content: `Tom's story doesn't add up, and your experience tells you he's hiding something. Under gentle pressure, the truth emerges.

"Okay, okay," he finally admits, sweat beading on his forehead. "I wasn't supposed to be here last night. I was... meeting someone. My girlfriend. She works in the psychology department."

**[AR ELEMENT: Voice Analysis]** *AR overlay shows stress patterns in speech*

Through AR-enhanced interviewing techniques, you piece together the real timeline:
- 8:30 PM: Tom's girlfriend, Dr. Sarah Kim, arrived using her key card
- 9:15 PM: They heard sounds from Professor Vasquez's office
- 9:30 PM: Tom investigated, found a man in a expensive suit searching the office
- 9:45 PM: The intruder claimed to be "federal security" and showed credentials

**[HIDDEN CLUE UNLOCKED]** *Coffee shop receipt found in Tom's pocket*

Tom hands you a crumpled receipt he picked up from the floor. "The guy dropped this," he says. "I was gonna throw it away, but... seemed like maybe it was important?"

The receipt is from Café Noir, three blocks away. Timestamp: 7:30 PM yesterday. Someone was planning this break-in over coffee, just thirty minutes after Professor Vasquez left for the day.

Your AR system immediately cross-references the location with security cameras and social media check-ins. The digital trail is forming, and it leads to places you didn't expect.`,
    choices: [
      {
        id: 'follow_receipt',
        text: 'Investigate the coffee shop lead',
        consequence: 'Pursue the planning phase',
        nextSceneId: 'cafe_investigation'
      },
      {
        id: 'federal_agent',
        text: 'Check if the "federal security" claim was legitimate',
        consequence: 'Investigate government involvement',
        nextSceneId: 'government_angle'
      }
    ],
    metadata: {
      location: 'University Hallway',
      mood: 'revealing',
      backgroundImage: 'https://cdn.abacus.ai/images/518649ac-62df-4dae-b42d-1cd87db5b43b.png'
    }
  },
  {
    id: 'tech_conspiracy',
    title: 'The Algorithm Theft',
    content: `Deep in the university's server logs, your AR-enhanced analysis reveals the shocking scope of the theft. This wasn't just about Professor Vasquez's research – someone copied her entire life's work on digital consciousness simulation.

**[AR VISUALIZATION]** *3D data flow shows the exact files accessed*

The stolen research includes:
- Algorithms that can simulate human consciousness
- Neural mapping techniques for digital personality transfer  
- Code that could theoretically "upload" a human mind to a computer

**[HAPTIC FEEDBACK SIMULATION]** *Feel the texture of encrypted data packets*

But here's what chills you: the theft was performed by someone who understood the research intimately. They knew exactly which files to target, which security protocols to bypass, which algorithms were most valuable.

Your AR system cross-references the theft patterns with employee access logs. Three people had the knowledge and clearance to pull this off:
- Dr. James Morrison, Professor Vasquez's research partner
- Lisa Zhang, the graduate student assistant
- Professor Vasquez herself

The AR timeline reconstruction suggests something even more disturbing: Professor Vasquez may have been taken not just for ransom, but because her living brain is necessary to complete the consciousness transfer research.

Somewhere in the city, cutting-edge technology is being used for purposes that blur the line between innovation and exploitation. You're not just solving a kidnapping – you're preventing the theft of human consciousness itself.`,
    choices: [
      {
        id: 'find_vasquez',
        text: 'Focus on locating Professor Vasquez before it\'s too late',
        consequence: 'Race against time',
        nextSceneId: 'rescue_mission'
      },
      {
        id: 'stop_research',
        text: 'Try to stop the consciousness transfer experiment',
        consequence: 'Prevent the technology theft',
        nextSceneId: 'tech_showdown'
      }
    ],
    metadata: {
      location: 'Server Room',
      mood: 'urgent',
      backgroundImage: 'https://cdn.abacus.ai/images/81f0c3d4-7ad2-43c2-8802-cb11f3a327d3.png'
    }
  },
  {
    id: 'rescue_mission',
    title: 'The Hidden Laboratory',
    content: `Your AR investigation led you to an abandoned tech startup building downtown. But it's not abandoned – it's been converted into a sophisticated laboratory where Professor Vasquez's research is being weaponized.

**[AR ELEMENT: Building Scanner]** *Thermal imaging reveals hidden rooms*

Through AR-enhanced surveillance, you map the building's layout:
- Basement level: High-tech servers running consciousness simulation
- Main floor: Medical equipment for neural interface procedures  
- Upper floor: Where Professor Vasquez is being held

**[ACHIEVEMENT UNLOCKED: Detective Excellence]** *Solved the case using advanced investigation techniques*

You find Professor Vasquez connected to a neural interface machine, her consciousness being slowly digitized and copied. The kidnappers aren't just stealing her research – they're stealing her mind itself, planning to create the first truly sentient AI using her consciousness as a template.

"Detective Chen," she whispers weakly when you free her. "They're not just copying my research. They're copying me. Creating a digital version that knows everything I know, thinks like I think. It's... it's digital immortality, but at the cost of my actual mortality."

The AR system shows you the full scope of the conspiracy: a private military contractor planning to create armies of artificially intelligent soldiers using stolen consciousness templates. Professor Vasquez was just the first victim.

As sirens approach and backup arrives, you realize you've solved more than a kidnapping. You've uncovered the first case of consciousness theft – a crime that didn't even exist in legal frameworks until today.

*This AR-enhanced mystery demonstrated how future investigation techniques might blend physical and digital evidence, creating immersive problem-solving experiences.*`,
    metadata: {
      location: 'Hidden Laboratory',
      mood: 'triumphant'
    }
  }
];

export function HiddenTruth({ prototype }: HiddenTruthProps) {
  const [userState, setUserState] = useState<UserState>({
    currentSceneId: 'crime_scene',
    choices: {},
    achievements: [],
    progress: 0,
    metadata: { discoveredClues: [], arElementsUnlocked: 0 }
  });

  const [discoveredClues, setDiscoveredClues] = useState<string[]>([]);
  const [showClueModal, setShowClueModal] = useState<string | null>(null);

  const currentScene = scenes.find(s => s.id === userState.currentSceneId);

  const handleChoice = (choiceId: string) => {
    if (!currentScene) return;

    const choice = currentScene.choices?.find(c => c.id === choiceId);
    if (!choice?.nextSceneId) return;

    // Unlock clues based on choices
    let newClues = [...discoveredClues];
    if (choiceId === 'examine_office') {
      newClues.push('fingerprint', 'photograph');
    } else if (choiceId === 'interview_guard') {
      newClues.push('witness', 'receipt');
    }

    const newChoices = { ...userState.choices, [userState.currentSceneId]: choiceId };
    const completedScenes = Object.keys(newChoices).length;
    const totalScenes = scenes.filter(s => s.choices && s.choices.length > 0).length;
    const newProgress = (completedScenes / totalScenes) * 100;

    setUserState({
      ...userState,
      currentSceneId: choice.nextSceneId,
      choices: newChoices,
      progress: newProgress,
      metadata: {
        ...userState.metadata,
        discoveredClues: newClues,
        arElementsUnlocked: newClues.length
      }
    });

    setDiscoveredClues(newClues);
  };

  const resetStory = () => {
    setUserState({
      currentSceneId: 'crime_scene',
      choices: {},
      achievements: [],
      progress: 0,
      metadata: { discoveredClues: [], arElementsUnlocked: 0 }
    });
    setDiscoveredClues([]);
  };

  if (!currentScene) return null;

  return (
    <PrototypeBase
      prototype={prototype}
      scenes={scenes}
      userState={userState}
      onStateChange={setUserState}
      className="theme-mystery"
    >
      <div 
        className="relative min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${currentScene.metadata?.backgroundImage || prototype.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gray-900/80" />
        
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-6">
            {/* Evidence Board */}
            {discoveredClues.length > 0 && (
              <Card className="bg-gray-800/90 border-yellow-600/30 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Evidence Collected
                    </h3>
                    <Badge variant="secondary" className="bg-yellow-800/50 text-yellow-200">
                      {discoveredClues.length} / 4 Clues
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {discoveredClues.map((clueId) => (
                      <Button
                        key={clueId}
                        variant="outline"
                        size="sm"
                        onClick={() => setShowClueModal(clueId)}
                        className="border-yellow-600/50 bg-yellow-900/20 text-yellow-200 hover:bg-yellow-800/30 h-auto p-3"
                      >
                        <div className="text-center">
                          <div className="text-lg mb-1">🔍</div>
                          <div className="text-xs">{clues[clueId]?.name}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scene Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-yellow-600 text-gray-900">
                  <Search className="w-3 h-3 mr-1" />
                  AR MYSTERY
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {currentScene.metadata?.location}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Eye className="w-4 h-4" />
                <span>Case: {currentScene.title}</span>
              </div>
            </div>

            {/* Main Scene Card */}
            <Card className="bg-gray-800/90 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-8">
                <h1 className="text-3xl font-bold text-yellow-400 mb-6 flex items-center gap-3">
                  <Search className="w-8 h-8" />
                  {currentScene.title}
                </h1>
                
                <div className="text-gray-200 leading-relaxed mb-8 space-y-4">
                  {currentScene.content.split('\n\n').map((paragraph, index) => {
                    // Handle special AR elements
                    if (paragraph.includes('[AR ELEMENT:')) {
                      return (
                        <div key={index} className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <QrCode className="w-5 h-5 text-yellow-400" />
                            <span className="text-yellow-300 font-medium">AR Enhancement Available</span>
                          </div>
                          <p className="text-gray-300 italic">{paragraph.replace(/\*.*?\*/g, '').replace(/\[.*?\]/g, '')}</p>
                        </div>
                      );
                    } else if (paragraph.includes('[INTERACTIVE TEXTURE')) {
                      return (
                        <div key={index} className="bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <Camera className="w-5 h-5 text-blue-400" />
                            <span className="text-blue-300 font-medium">Haptic Feedback Simulation</span>
                          </div>
                          <p className="text-gray-300 italic">{paragraph.replace(/\*.*?\*/g, '').replace(/\[.*?\]/g, '')}</p>
                        </div>
                      );
                    } else if (paragraph.includes('[HIDDEN CLUE')) {
                      return (
                        <div key={index} className="bg-green-900/20 border-l-4 border-green-500 p-4 rounded-r-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <Lightbulb className="w-5 h-5 text-green-400" />
                            <span className="text-green-300 font-medium">New Evidence Discovered</span>
                          </div>
                          <p className="text-gray-300 italic">{paragraph.replace(/\*.*?\*/g, '').replace(/\[.*?\]/g, '')}</p>
                        </div>
                      );
                    }
                    
                    return (
                      <p key={index} className="text-lg">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>

                {/* Choices */}
                {currentScene.choices && currentScene.choices.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-yellow-400 font-medium">
                      <Search className="w-4 h-4" />
                      Investigation options:
                    </div>
                    
                    <div className="grid gap-3">
                      {currentScene.choices.map((choice) => (
                        <Button
                          key={choice.id}
                          onClick={() => handleChoice(choice.id)}
                          variant="outline"
                          size="lg"
                          className="group choice-button border-gray-600 bg-gray-800/50 text-gray-200 hover:bg-yellow-900/30 hover:border-yellow-500 p-6 h-auto text-left justify-start"
                        >
                          <div className="flex-1">
                            <div className="font-medium mb-2 text-white group-hover:text-yellow-200">
                              {choice.text}
                            </div>
                            {choice.consequence && (
                              <div className="text-sm text-gray-400 group-hover:text-yellow-300 italic">
                                Investigation path: {choice.consequence}
                              </div>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ending State */}
                {!currentScene.choices && (
                  <div className="space-y-6 pt-6 border-t border-gray-700">
                    <div className="text-center">
                      <Badge variant="secondary" className="bg-yellow-600 text-gray-900 mb-4">
                        CASE SOLVED
                      </Badge>
                      <p className="text-gray-400 mb-6">
                        You successfully solved the mystery using AR investigation techniques and uncovered a conspiracy that reaches beyond simple kidnapping into the realm of consciousness theft.
                      </p>
                      <Button onClick={resetStory} className="bg-yellow-600 hover:bg-yellow-500 text-gray-900">
                        <Search className="w-4 h-4 mr-2" />
                        Start New Investigation
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Clue Modal */}
      {showClueModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Evidence Detail</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowClueModal(null)}>
                  ×
                </Button>
              </div>
              <div className="space-y-4">
                <div className="text-center text-4xl mb-4">🔍</div>
                <h4 className="font-medium">{clues[showClueModal]?.name}</h4>
                <p className="text-sm text-gray-600">{clues[showClueModal]?.description}</p>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800 font-medium">AR Enhancement:</p>
                  <p className="text-xs text-blue-600">{clues[showClueModal]?.arContent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PrototypeBase>
  );
}
