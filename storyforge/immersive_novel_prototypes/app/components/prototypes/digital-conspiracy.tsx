
'use client';

import { useState, useEffect } from 'react';
import { PrototypeBase } from './prototype-base';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Prototype, Scene, UserState } from '@/lib/types';
import { AlertTriangle, Eye, Clock, Zap } from 'lucide-react';
import Image from 'next/image';

interface DigitalConspiracyProps {
  prototype: Prototype;
}

const scenes: Scene[] = [
  {
    id: 'intro',
    title: 'The Midnight Alert',
    content: `The harsh glow of your monitor illuminates the darkened server room. 3:47 AM. Another sleepless night maintaining the city's data infrastructure. Then you see it – an unauthorized access attempt on the government database you manage.

The intrusion is sophisticated, moving through security layers like ghost through walls. But something else catches your attention: the data being accessed isn't random. Someone is systematically downloading citizen surveillance records, financial transactions, and communication logs.

Your hands hover over the keyboard. The protocol is clear – report any security breach immediately. But as you watch the elegant digital heist unfold, you notice something that makes your blood run cold: your own personal files are part of the extraction.`,
    choices: [
      {
        id: 'report',
        text: 'Follow protocol and report the breach immediately',
        consequence: 'Trust in the system, but risk exposure',
        nextSceneId: 'investigation',
        metadata: { impact: 'high', difficulty: 'easy' }
      },
      {
        id: 'investigate',
        text: 'Secretly trace the intrusion source yourself',
        consequence: 'Dangerous knowledge, personal risk',
        nextSceneId: 'discovery',
        metadata: { impact: 'high', difficulty: 'hard' }
      },
      {
        id: 'shutdown',
        text: 'Immediately shut down the system to stop the breach',
        consequence: 'Safety first, but evidence lost',
        nextSceneId: 'confrontation',
        metadata: { impact: 'medium', difficulty: 'medium' }
      }
    ],
    metadata: {
      location: 'Server Room',
      mood: 'tense',
      backgroundImage: 'https://cdn.abacus.ai/images/26ed5478-271b-482e-881a-668bb488a405.png'
    }
  },
  {
    id: 'investigation',
    title: 'Official Channels',
    content: `You reach for the secure phone, dialing your supervisor's emergency line. The call connects to Agent Martinez, a stern woman who's coordinated cyber security for the past decade.

"Another breach attempt, Chen?" she asks, her voice sharp despite the early hour. "Third one this month. We're tracking a sophisticated group – they call themselves the Digital Liberation Front."

As you provide details, Martinez pauses. "Wait. You said they accessed your personal files? That's... unusual. These hackers typically focus on high-value political targets." Her tone shifts, becoming more cautious. "Chen, I need you to come in. Now. Don't discuss this with anyone else."

The line goes dead. Through the server room's reinforced glass, you notice a black sedan pulling into the parking lot. No government plates, but the occupants move with the practiced efficiency of federal agents. Your stomach knots – something about this feels orchestrated.`,
    choices: [
      {
        id: 'comply',
        text: 'Follow orders and meet with the agents',
        consequence: 'Play by their rules',
        nextSceneId: 'revelation',
        metadata: { impact: 'medium' }
      },
      {
        id: 'escape',
        text: 'Slip out through the emergency exit',
        consequence: 'Become a fugitive',
        nextSceneId: 'pursuit',
        metadata: { impact: 'high' }
      }
    ],
    metadata: {
      location: 'Server Room',
      mood: 'paranoid',
      backgroundImage: 'https://cdn.abacus.ai/images/7a067bd9-fac8-4d96-9f5a-4b81b566fd69.png'
    }
  },
  {
    id: 'discovery',
    title: 'Down the Rabbit Hole',
    content: `Your fingers fly across the keyboard, deploying custom trace protocols you've been developing in secret. The digital trail leads through a maze of proxy servers, encrypted tunnels, and false endpoints. But you're better than most – you designed half these security systems.

After thirty minutes of digital archaeology, you find the source: a government facility you've never heard of. Project MIRROR – classified so deeply it doesn't exist on any official network. The stolen data isn't being sold or leaked; it's being copied to this facility's servers.

Your own government is spying on its citizens through manufactured "hacking attempts." The Digital Liberation Front isn't a terrorist organization – they're whistleblowers trying to expose the surveillance program. And somehow, you've become their inside contact without knowing it.

A secure message appears on your screen: "We know you're watching. They're coming for you. Basement exit. 5 minutes. -A friend."`,
    choices: [
      {
        id: 'wait',
        text: 'Stay and confront whoever is coming',
        consequence: 'Face the truth directly',
        nextSceneId: 'confrontation',
        metadata: { impact: 'high' }
      },
      {
        id: 'run',
        text: 'Take the mysterious advice and run',
        consequence: 'Trust unknown allies',
        nextSceneId: 'alliance',
        metadata: { impact: 'high' }
      }
    ],
    metadata: {
      location: 'Server Room',
      mood: 'revelation',
      backgroundImage: 'https://cdn.abacus.ai/images/a50d0895-1795-447a-a159-1ecc50f66504.png'
    }
  },
  {
    id: 'confrontation',
    title: 'The Price of Knowledge',
    content: `The server room door slides open with a soft hiss. Agent Martinez enters flanked by two operatives in dark suits. Their eyes are cold, professional. This isn't a rescue – it's a cleanup operation.

"You've seen too much, Chen," Martinez says, her voice carrying a hint of genuine regret. "Project MIRROR was never supposed to involve civilian contractors. But here we are."

She explains the program: a massive surveillance network disguised as external threats, designed to monitor and control the population. The "hackers" are government assets, the "breaches" are data harvesting operations, and you've been an unwitting accomplice.

"We can make this easy," she continues. "Sign the agreement, accept the promotion to a classified position, and forget what you've learned. Or..." She doesn't finish the sentence. She doesn't need to.

The weight of your decision hangs in the air like digital smoke.`,
    choices: [
      {
        id: 'comply_final',
        text: 'Accept the deal and join Project MIRROR',
        consequence: 'Comfortable complicity',
        nextSceneId: 'ending_compromised'
      },
      {
        id: 'resist',
        text: 'Refuse and fight for the truth',
        consequence: 'Dangerous integrity',
        nextSceneId: 'ending_resistance'
      }
    ],
    metadata: {
      location: 'Server Room',
      mood: 'climactic',
      backgroundImage: 'https://cdn.abacus.ai/images/26ed5478-271b-482e-881a-668bb488a405.png'
    }
  },
  {
    id: 'ending_compromised',
    title: 'Digital Chains',
    content: `Six months later, you sit in a luxury office thirty floors above the city. Your new title – Senior Systems Architect for Homeland Digital Security – comes with a salary that bought you a house, a car, and a conscience that only bothers you late at night.

You manage the very surveillance network you once feared. Citizens' data flows through systems you design, their privacy dissolved in streams of code you write. The irony isn't lost on you – you've become the architect of your own digital prison.

Sometimes you wonder about the Digital Liberation Front, about the whistleblowers who tried to expose the truth. Their activities have mysteriously ceased. Their social media accounts deleted. Their families relocated to new cities.

You've won by losing everything that mattered. In the world of digital surveillance, perhaps that's the only victory the system allows.

*This path explored themes of complicity and moral compromise in the face of institutional power. The linear narrative structure emphasized the weight of each decision and its immediate consequences.*`,
    metadata: {
      location: 'Corporate Office',
      mood: 'melancholic'
    }
  },
  {
    id: 'ending_resistance',
    title: 'The Price of Truth',
    content: `The USB drive slides into the journalist's laptop with a soft click. Sarah Kim, investigative reporter for the National Herald, has been tracking government surveillance programs for years. Your evidence completes her story.

"This is it," she whispers, scanning through the Project MIRROR files. "This proves everything we suspected. The manufactured threats, the data harvesting, the citizen monitoring network."

Three weeks later, the story breaks worldwide. Congressional hearings begin. Protests fill the streets. Project MIRROR is officially terminated, though you suspect it simply changed names and moved deeper underground.

You're in protective custody now, your identity sealed under whistleblower protections. Sometimes you glimpse Martinez on the news, testifying before Congress about "isolated incidents" and "rogue operations."

You may never live freely again, but the digital chains binding an entire population have been loosened. In a world where information is power, perhaps that's worth any personal cost.

*This path explored the courage required to speak truth to power, even at great personal risk. The thriller format heightened the stakes of each moral choice.*`,
    metadata: {
      location: 'Safe House',
      mood: 'bittersweet'
    }
  }
];

export function DigitalConspiracy({ prototype }: DigitalConspiracyProps) {
  const [userState, setUserState] = useState<UserState>({
    currentSceneId: 'intro',
    choices: {},
    achievements: [],
    progress: 0,
    metadata: {}
  });

  const [isTyping, setIsTyping] = useState(false);

  const currentScene = scenes.find(s => s.id === userState.currentSceneId);

  const handleChoice = (choiceId: string) => {
    if (!currentScene) return;

    const choice = currentScene.choices?.find(c => c.id === choiceId);
    if (!choice?.nextSceneId) return;

    setIsTyping(true);
    
    setTimeout(() => {
      const newChoices = { ...userState.choices, [userState.currentSceneId]: choiceId };
      const completedScenes = Object.keys(newChoices).length;
      const totalScenes = scenes.filter(s => s.choices && s.choices.length > 0).length;
      const newProgress = (completedScenes / totalScenes) * 100;

      setUserState({
        ...userState,
        currentSceneId: choice.nextSceneId!,
        choices: newChoices,
        progress: newProgress,
        metadata: {
          ...userState.metadata,
          lastChoice: choiceId,
          choiceConsequence: choice.consequence
        }
      });
      setIsTyping(false);
    }, 1500);
  };

  const resetStory = () => {
    setUserState({
      currentSceneId: 'intro',
      choices: {},
      achievements: [],
      progress: 0,
      metadata: {}
    });
  };

  if (!currentScene) return null;

  return (
    <PrototypeBase
      prototype={prototype}
      scenes={scenes}
      userState={userState}
      onStateChange={setUserState}
      className="theme-dark"
    >
      <div 
        className="relative min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${currentScene.metadata?.backgroundImage || prototype.imageUrl})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Scene Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-red-900/50 text-red-200 border-red-700">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  HIGH STAKES
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {currentScene.metadata?.location}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Eye className="w-4 h-4" />
                <span>Scene: {currentScene.title}</span>
              </div>
            </div>

            {/* Main Scene Card */}
            <Card className="bg-gray-900/90 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-8">
                <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <Zap className="w-8 h-8 text-red-400" />
                  {currentScene.title}
                </h1>
                
                {/* Story Content */}
                <div className={`text-gray-200 leading-relaxed mb-8 ${isTyping ? 'opacity-50' : ''}`}>
                  {currentScene.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Choices */}
                {currentScene.choices && currentScene.choices.length > 0 && !isTyping && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-red-400 font-medium">
                      <Clock className="w-4 h-4" />
                      Choose your action:
                    </div>
                    
                    <div className="grid gap-3">
                      {currentScene.choices.map((choice) => (
                        <Button
                          key={choice.id}
                          onClick={() => handleChoice(choice.id)}
                          variant="outline"
                          size="lg"
                          className="group choice-button border-gray-600 bg-gray-800/50 text-gray-200 hover:bg-red-900/30 hover:border-red-500 p-6 h-auto text-left justify-start"
                        >
                          <div className="flex-1">
                            <div className="font-medium mb-2 text-white group-hover:text-red-200">
                              {choice.text}
                            </div>
                            {choice.consequence && (
                              <div className="text-sm text-gray-400 group-hover:text-red-300 italic">
                                Consequence: {choice.consequence}
                              </div>
                            )}
                            {choice.metadata?.difficulty && (
                              <Badge 
                                variant="secondary" 
                                className="mt-2 text-xs bg-gray-700 text-gray-300"
                              >
                                {choice.metadata.difficulty.toUpperCase()} CHOICE
                              </Badge>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {isTyping && (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-3 text-red-400">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-400" />
                      <span>Processing your decision...</span>
                    </div>
                  </div>
                )}

                {/* Ending State */}
                {!currentScene.choices && (
                  <div className="space-y-6 pt-6 border-t border-gray-700">
                    <div className="text-center">
                      <Badge variant="secondary" className="bg-red-900/50 text-red-200 border-red-700 mb-4">
                        STORY COMPLETE
                      </Badge>
                      <p className="text-gray-400 mb-6">
                        You've reached one of the possible endings. Your choices shaped this digital conspiracy thriller.
                      </p>
                      <Button onClick={resetStory} className="bg-red-700 hover:bg-red-600">
                        <Zap className="w-4 h-4 mr-2" />
                        Start Over
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PrototypeBase>
  );
}
