
'use client';

import { useState, useEffect } from 'react';
import { PrototypeBase } from './prototype-base';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Prototype, Scene, UserState } from '@/lib/types';
import { Trophy, Star, Music, Puzzle, Zap, Gift } from 'lucide-react';

interface QuestUnityProps {
  prototype: Prototype;
}

const achievements = [
  { id: 'first_choice', name: 'First Steps', description: 'Made your first decision', icon: '🚀' },
  { id: 'puzzle_solver', name: 'Puzzle Master', description: 'Solved the crystal harmony puzzle', icon: '🧩' },
  { id: 'unity_seeker', name: 'Unity Seeker', description: 'Chose cooperation over conflict', icon: '🤝' },
  { id: 'wisdom_keeper', name: 'Wisdom Keeper', description: 'Helped the elder tree', icon: '🌳' },
  { id: 'light_bringer', name: 'Light Bringer', description: 'Restored light to the realm', icon: '✨' },
  { id: 'story_complete', name: 'Quest Complete', description: 'Finished the adventure', icon: '👑' }
];

const soundtracks = [
  { scene: 'intro', track: 'Mystical Beginning', mood: 'wonder' },
  { scene: 'forest', track: 'Ancient Whispers', mood: 'mysterious' },
  { scene: 'village', track: 'Community Harmony', mood: 'warm' },
  { scene: 'crystal', track: 'Puzzle Theme', mood: 'focused' },
  { scene: 'ending', track: 'Triumphant Unity', mood: 'victorious' }
];

const scenes: Scene[] = [
  {
    id: 'intro',
    title: 'The Fragmented Realm',
    content: `Welcome to Aethermoor, a realm where harmony once flourished but now lies divided. Ancient crystals that maintained balance between the four communities – Forest Folk, Mountain Dwellers, River People, and Sky Riders – have lost their glow.

**[🎵 ADAPTIVE SOUNDTRACK: Mystical Beginning - Wonder Theme]**

You are the Harmony Seeker, chosen by the fading light of the Unity Crystal. Your quest: restore connection between the communities and rekindle the light that keeps their world in balance.

**[🧩 TUTORIAL PUZZLE: Crystal Resonance]**
*The Unity Crystal shows you a simple pattern. Match the sequence to unlock your first ability.*

As you touch the crystal, visions flood your mind:
- The Forest Folk, masters of growth and healing, now withdrawn and suspicious
- The Mountain Dwellers, guardians of ancient knowledge, hoarding their wisdom
- The River People, traders and connectors, struggling with polluted waters
- The Sky Riders, messengers and scouts, grounded by storms of discord

Each community believes the others are responsible for the realm's decline. But you sense a deeper truth – they need each other now more than ever.

Your journey begins at the crossroads where all four paths meet. Which community will you visit first?`,
    choices: [
      {
        id: 'visit_forest',
        text: '🌲 Visit the Forest Folk first',
        consequence: 'Start with nature and healing',
        nextSceneId: 'forest_folk',
        metadata: { difficulty: 'easy', points: 10 }
      },
      {
        id: 'visit_mountain',
        text: '⛰️ Visit the Mountain Dwellers first',
        consequence: 'Seek ancient knowledge',
        nextSceneId: 'mountain_dwellers',
        metadata: { difficulty: 'medium', points: 15 }
      },
      {
        id: 'visit_river',
        text: '🏞️ Visit the River People first',
        consequence: 'Focus on connection and trade',
        nextSceneId: 'river_people',
        metadata: { difficulty: 'medium', points: 15 }
      },
      {
        id: 'visit_sky',
        text: '☁️ Visit the Sky Riders first',
        consequence: 'Gain aerial perspective',
        nextSceneId: 'sky_riders',
        metadata: { difficulty: 'hard', points: 20 }
      }
    ],
    metadata: {
      location: 'Unity Crossroads',
      mood: 'hopeful',
      backgroundImage: 'https://cdn.abacus.ai/images/c25e04a4-c584-4b25-b17b-5f63e70fa529.png'
    }
  },
  {
    id: 'forest_folk',
    title: 'The Whispering Woods',
    content: `The forest canopy filters sunlight into dancing patterns as you enter the domain of the Forest Folk. Ancient trees lean together, their branches forming natural archways. But something is wrong – many leaves are yellowing despite the season, and the usual bird songs are muted.

**[🎵 NOW PLAYING: Ancient Whispers - Mysterious Theme]**

Elder Willowbark, a tree-person whose bark skin shows centuries of growth rings, greets you with tired eyes. "Harmony Seeker, your arrival was foretold by the rustling leaves. Our forest sickens, and we suspect the Mountain Dwellers' mining has poisoned our roots."

**[🏆 ACHIEVEMENT UNLOCKED: First Steps - Made your first decision]**

A young Forest Folk named Sappling approaches nervously. "Elder, what if... what if it's not the mountains? I've noticed the sickness follows the water flow from the river lands. Maybe we should investigate together?"

Elder Willowbark's expression hardens. "The River People care only for trade profits. They've poisoned our waters with their merchant ships."

**[🧩 PUZZLE ELEMENT: Ecosystem Analysis]**
*The forest shows you three paths of investigation. Each reveals different clues about the true source of the contamination.*

You realize this is more than environmental damage – it's a breakdown in communication. Each community is blaming the others instead of working together to find the real cause.

How do you help the Forest Folk see beyond their assumptions?`,
    choices: [
      {
        id: 'investigate_water',
        text: '💧 Suggest investigating the water source together',
        consequence: 'Promote collaborative investigation',
        nextSceneId: 'unity_investigation',
        metadata: { difficulty: 'medium', points: 25 }
      },
      {
        id: 'defend_forest',
        text: '🛡️ Support the Forest Folk\'s position',
        consequence: 'Strengthen one community but increase division',
        nextSceneId: 'division_path',
        metadata: { difficulty: 'easy', points: 10 }
      },
      {
        id: 'healing_ritual',
        text: '🌿 Propose a healing ritual involving all communities',
        consequence: 'Take a spiritual approach to unity',
        nextSceneId: 'healing_ceremony',
        metadata: { difficulty: 'hard', points: 30 }
      }
    ],
    metadata: {
      location: 'Whispering Woods',
      mood: 'concerned',
      backgroundImage: 'https://cdn.abacus.ai/images/d3dd8999-2f68-4fd1-bc73-183ff6c8eda5.png'
    }
  },
  {
    id: 'unity_investigation',
    title: 'The Crystal Harmony Puzzle',
    content: `Your suggestion to investigate together sparks something remarkable. Representatives from all four communities agree to meet at the Harmony Springs, where the waters from all territories converge.

**[🎵 NOW PLAYING: Puzzle Theme - Focused Concentration]**

**[🧩 INTERACTIVE PUZZLE: Crystal Harmony Grid]**
*Four crystals represent the four communities. Arrange them so each crystal's energy complements the others. Different combinations create different harmonies.*

As the investigation unfolds, you discover the truth: an ancient Shadow Crystal, buried deep underground, has been slowly draining energy from the Unity Crystals. It's not any community's fault – it's a force that feeds on division itself.

**[🎮 MINI-GAME: Shadow Crystal Purification]**
*Use the combined powers of all four communities to cleanse the Shadow Crystal. Each community contributes unique abilities.*

- Forest Folk contribute growth energy to contain the shadow
- Mountain Dwellers provide earth strength to seal the corruption  
- River People offer flowing energy to wash away negativity
- Sky Riders bring wind power to disperse the darkness

**[🏆 ACHIEVEMENT UNLOCKED: Puzzle Master - Solved the crystal harmony puzzle]**
**[🏆 ACHIEVEMENT UNLOCKED: Unity Seeker - Chose cooperation over conflict]**

The Shadow Crystal transforms, becoming a Lesson Crystal that shows each community how their fears and assumptions were manipulated. They realize they're stronger together than apart.

But the real test comes next: will they maintain this unity, or fall back into old patterns?`,
    choices: [
      {
        id: 'create_council',
        text: '🏛️ Establish a permanent Unity Council',
        consequence: 'Create lasting institutional change',
        nextSceneId: 'council_ending',
        metadata: { difficulty: 'hard', points: 40 }
      },
      {
        id: 'unity_celebration',
        text: '🎉 Organize a great celebration of unity',
        consequence: 'Celebrate success and strengthen bonds',
        nextSceneId: 'celebration_ending',
        metadata: { difficulty: 'medium', points: 30 }
      },
      {
        id: 'wisdom_sharing',
        text: '📚 Create a program for sharing wisdom between communities',
        consequence: 'Focus on long-term understanding',
        nextSceneId: 'wisdom_ending',
        metadata: { difficulty: 'medium', points: 35 }
      }
    ],
    metadata: {
      location: 'Harmony Springs',
      mood: 'enlightening',
      backgroundImage: 'https://cdn.abacus.ai/images/81517dfe-e98b-438e-852b-aa09cc5171ab.png'
    }
  },
  {
    id: 'council_ending',
    title: 'The Unity Covenant',
    content: `One year later, the Unity Council meets in the great hall built at the Harmony Springs. Representatives from all four communities gather monthly, not just to solve problems, but to share celebrations, innovations, and dreams.

**[🎵 NOW PLAYING: Triumphant Unity - Victory Theme with All Community Instruments]**

**[🏆 ACHIEVEMENT UNLOCKED: Wisdom Keeper - Helped establish lasting wisdom]**
**[🏆 ACHIEVEMENT UNLOCKED: Light Bringer - Restored light to the realm]**
**[🏆 ACHIEVEMENT UNLOCKED: Story Complete - Finished the adventure]**

The realm of Aethermoor flourishes like never before:

- **Forest Folk** share their healing knowledge, helping other communities develop sustainable practices
- **Mountain Dwellers** open their libraries, teaching ancient engineering techniques to all  
- **River People** create trade networks that benefit everyone, not just merchants
- **Sky Riders** establish communication systems that keep all communities connected

**[🎮 FINAL SCORE CALCULATION]**
- Choices Made: Wise Leadership Path
- Communities United: 4/4  
- Puzzles Solved: 2/2
- Achievements Earned: 6/6
- **TOTAL SCORE: 485/500 - LEGENDARY HARMONY SEEKER!**

**[💫 UNLOCKABLE CONTENT: New Game+ Mode]**
*Your choices have unlocked alternative story paths. Try different approaches to discover new outcomes and hidden achievements.*

The Unity Crystal now blazes with renewed light, its glow visible from every corner of the realm. Children from all communities play together, elders share stories across cultural boundaries, and innovations emerge from collaborative minds.

You've done more than save a realm – you've proven that unity doesn't mean uniformity. Each community kept its unique culture while learning to work together. The greatest adventures aren't about conquering enemies, but about building bridges.

**[🎁 SPECIAL REWARD: Unity Charm]** *This charm can be carried into other story paths, providing bonus cooperation options.*

*This gamified adventure demonstrated how interactive elements, achievements, and adaptive systems can enhance storytelling while promoting positive values of cooperation and understanding.*`,
    metadata: {
      location: 'Unity Council Hall',
      mood: 'triumphant'
    }
  }
];

export function QuestUnity({ prototype }: QuestUnityProps) {
  const [userState, setUserState] = useState<UserState>({
    currentSceneId: 'intro',
    choices: {},
    achievements: [],
    progress: 0,
    metadata: { 
      totalScore: 0,
      communitiesVisited: [],
      puzzlesSolved: 0,
      currentTrack: 'Mystical Beginning'
    }
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [currentTrack, setCurrentTrack] = useState('Mystical Beginning');
  const [showAchievement, setShowAchievement] = useState<string | null>(null);

  const currentScene = scenes.find(s => s.id === userState.currentSceneId);
  const totalScore = userState.metadata?.totalScore || 0;

  const unlockAchievement = (achievementId: string) => {
    if (!unlockedAchievements.includes(achievementId)) {
      setUnlockedAchievements(prev => [...prev, achievementId]);
      setShowAchievement(achievementId);
      setTimeout(() => setShowAchievement(null), 3000);
    }
  };

  const handleChoice = (choiceId: string) => {
    if (!currentScene) return;

    const choice = currentScene.choices?.find(c => c.id === choiceId);
    if (!choice?.nextSceneId) return;

    // Award achievement for first choice
    if (userState.currentSceneId === 'intro') {
      unlockAchievement('first_choice');
    }

    // Calculate score
    const choicePoints = choice.metadata?.points || 0;
    const newScore = totalScore + choicePoints;

    // Update soundtrack based on destination
    const newTrack = soundtracks.find(s => choice.nextSceneId?.includes(s.scene))?.track || currentTrack;
    setCurrentTrack(newTrack);

    const newChoices = { ...userState.choices, [userState.currentSceneId]: choiceId };
    const completedScenes = Object.keys(newChoices).length;
    const totalScenes = scenes.filter(s => s.choices && s.choices.length > 0).length;
    const newProgress = (completedScenes / totalScenes) * 100;

    // Unlock achievements based on choices
    if (choiceId === 'investigate_water') {
      unlockAchievement('puzzle_solver');
      unlockAchievement('unity_seeker');
    }

    setUserState({
      ...userState,
      currentSceneId: choice.nextSceneId,
      choices: newChoices,
      progress: newProgress,
      achievements: unlockedAchievements,
      metadata: {
        ...userState.metadata,
        totalScore: newScore,
        currentTrack: newTrack,
        lastChoice: choiceId
      }
    });
  };

  const resetStory = () => {
    setUserState({
      currentSceneId: 'intro',
      choices: {},
      achievements: [],
      progress: 0,
      metadata: { 
        totalScore: 0,
        communitiesVisited: [],
        puzzlesSolved: 0,
        currentTrack: 'Mystical Beginning'
      }
    });
    setUnlockedAchievements([]);
    setCurrentTrack('Mystical Beginning');
  };

  if (!currentScene) return null;

  return (
    <PrototypeBase
      prototype={prototype}
      scenes={scenes}
      userState={userState}
      onStateChange={setUserState}
      className="theme-bright"
    >
      <div 
        className="relative min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${currentScene.metadata?.backgroundImage || prototype.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 via-purple-400/20 to-pink-400/20" />
        
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-6">
            {/* Game HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Score and Progress */}
              <Card className="bg-white/90 border-blue-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800">Quest Progress</span>
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      {Math.round(userState.progress)}%
                    </Badge>
                  </div>
                  <Progress value={userState.progress} className="mb-2" />
                  <div className="text-lg font-bold text-blue-900">
                    Score: {totalScore.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              {/* Soundtrack */}
              <Card className="bg-white/90 border-purple-300">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Music className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Now Playing</span>
                  </div>
                  <div className="text-sm text-purple-900 font-medium">{currentTrack}</div>
                  <div className="text-xs text-purple-600">
                    {soundtracks.find(s => s.track === currentTrack)?.mood} mood
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="bg-white/90 border-pink-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-pink-600" />
                      <span className="text-sm font-medium text-pink-800">Achievements</span>
                    </div>
                    <Badge variant="secondary" className="bg-pink-600 text-white">
                      {unlockedAchievements.length}/6
                    </Badge>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {achievements.slice(0, 4).map((achievement) => (
                      <span 
                        key={achievement.id}
                        className={`text-lg ${
                          unlockedAchievements.includes(achievement.id) 
                            ? 'opacity-100' 
                            : 'opacity-30'
                        }`}
                        title={achievement.name}
                      >
                        {achievement.icon}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Scene Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  ADVENTURE QUEST
                </Badge>
                <Badge variant="outline" className="border-blue-400 text-blue-800">
                  {currentScene.metadata?.location}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <Zap className="w-4 h-4" />
                <span>{currentScene.title}</span>
              </div>
            </div>

            {/* Main Scene Card */}
            <Card className="bg-white/95 border-blue-200 shadow-xl">
              <CardContent className="p-8">
                <h1 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                  <Gift className="w-8 h-8 text-pink-600" />
                  {currentScene.title}
                </h1>
                
                <div className="text-gray-800 leading-relaxed mb-8 space-y-4">
                  {currentScene.content.split('\n\n').map((paragraph, index) => {
                    // Handle special game elements
                    if (paragraph.includes('[🎵')) {
                      return (
                        <div key={index} className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <Music className="w-5 h-5 text-purple-600" />
                            <span className="text-purple-800 font-medium">Adaptive Soundtrack</span>
                          </div>
                          <p className="text-purple-700 italic">{paragraph.replace(/\[.*?\]/g, '')}</p>
                        </div>
                      );
                    } else if (paragraph.includes('[🧩')) {
                      return (
                        <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <Puzzle className="w-5 h-5 text-blue-600" />
                            <span className="text-blue-800 font-medium">Interactive Puzzle</span>
                          </div>
                          <p className="text-blue-700 italic">{paragraph.replace(/\[.*?\]/g, '')}</p>
                        </div>
                      );
                    } else if (paragraph.includes('[🏆')) {
                      return (
                        <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <Trophy className="w-5 h-5 text-yellow-600" />
                            <span className="text-yellow-800 font-medium">Achievement Unlocked!</span>
                          </div>
                          <p className="text-yellow-700 font-medium">{paragraph.replace(/\[.*?\]/g, '')}</p>
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
                    <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
                      <Zap className="w-4 h-4" />
                      Choose your path:
                    </div>
                    
                    <div className="grid gap-3">
                      {currentScene.choices.map((choice) => (
                        <Button
                          key={choice.id}
                          onClick={() => handleChoice(choice.id)}
                          variant="outline"
                          size="lg"
                          className="group choice-button border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100 hover:border-blue-400 p-6 h-auto text-left justify-start"
                        >
                          <div className="flex items-center gap-4 w-full">
                            <div className="flex-1">
                              <div className="font-medium mb-2 text-blue-900 group-hover:text-blue-800">
                                {choice.text}
                              </div>
                              {choice.consequence && (
                                <div className="text-sm text-blue-600 group-hover:text-blue-700 italic">
                                  Path: {choice.consequence}
                                </div>
                              )}
                              {choice.metadata?.points && (
                                <Badge 
                                  variant="secondary" 
                                  className="mt-2 text-xs bg-green-600 text-white"
                                >
                                  +{choice.metadata.points} points
                                </Badge>
                              )}
                            </div>
                            <div className="text-2xl">{choice.text.split(' ')[0]}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ending State */}
                {!currentScene.choices && (
                  <div className="space-y-6 pt-6 border-t border-blue-200">
                    <div className="text-center">
                      <Badge variant="secondary" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-4">
                        QUEST COMPLETE!
                      </Badge>
                      <div className="mb-6">
                        <div className="text-2xl font-bold text-blue-900 mb-2">
                          Final Score: {totalScore.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          Achievements Earned: {unlockedAchievements.length}/6
                        </div>
                      </div>
                      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Your adventure in Aethermoor has come to an end, but the realm continues to flourish 
                        thanks to your choices. Try different paths to discover new outcomes!
                      </p>
                      <Button onClick={resetStory} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <Star className="w-4 h-4 mr-2" />
                        Begin New Adventure
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Achievement Notification */}
      {showAchievement && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-500">
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-400 border-yellow-500 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-900" />
                <div>
                  <div className="font-bold text-yellow-900">Achievement Unlocked!</div>
                  <div className="text-sm text-yellow-800">
                    {achievements.find(a => a.id === showAchievement)?.name}
                  </div>
                </div>
                <div className="text-2xl">
                  {achievements.find(a => a.id === showAchievement)?.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PrototypeBase>
  );
}
