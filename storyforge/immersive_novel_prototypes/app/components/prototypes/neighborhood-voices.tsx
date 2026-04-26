
'use client';

import { useState, useEffect } from 'react';
import { PrototypeBase } from './prototype-base';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Prototype, Scene, UserState } from '@/lib/types';
import { Users, Heart, MessageCircle, Home, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface NeighborhoodVoicesProps {
  prototype: Prototype;
}

const characters = [
  {
    id: 'maria',
    name: 'Maria Santos',
    role: 'Community Organizer',
    description: 'Passionate advocate for neighborhood improvements',
    avatar: '👩🏽‍💼'
  },
  {
    id: 'frank',
    name: 'Frank Chen',
    role: 'Local Shop Owner',
    description: 'Third-generation business owner, community anchor',
    avatar: '👨🏻‍💼'
  },
  {
    id: 'aisha',
    name: 'Aisha Johnson',
    role: 'Teacher & Parent',
    description: 'Elementary school teacher, mother of two',
    avatar: '👩🏿‍🏫'
  }
];

const scenes: Scene[] = [
  {
    id: 'community_meeting',
    title: 'The Community Meeting',
    content: `The fluorescent lights buzz overhead in the community center's main room. Folding chairs are arranged in a circle, but the seating arrangement tells its own story – clusters of neighbors who know each other well, isolated chairs for the newcomers, empty spaces that speak to community divisions.

Tonight's agenda: the vacant lot on Maple Street. The city wants to sell it to developers. The community has other ideas.

**Maria Santos** stands at the front, her voice carrying the weight of years of neighborhood organizing. "This isn't just about a lot," she begins. "It's about who gets to decide what our community becomes."

**Frank Chen** shifts in his seat, the numbers running through his mind. His family's grocery store has struggled against chain competitors. Development could bring new customers – or price out his longtime neighbors.

**Aisha Johnson** thinks about her students, how they light up when talking about the garden they're planning for that lot. But she also knows the overcrowded classrooms need resources that new tax revenue could provide.

The room holds its breath, waiting for the first voice to break the silence.`,
    choices: [
      {
        id: 'maria_perspective',
        text: 'Follow Maria\'s perspective as community organizer',
        consequence: 'Experience the weight of community leadership',
        nextSceneId: 'maria_story'
      },
      {
        id: 'frank_perspective',
        text: 'Follow Frank\'s perspective as business owner',
        consequence: 'Navigate economic pressures and community loyalty',
        nextSceneId: 'frank_story'
      },
      {
        id: 'aisha_perspective',
        text: 'Follow Aisha\'s perspective as teacher and parent',
        consequence: 'Balance idealism with practical concerns',
        nextSceneId: 'aisha_story'
      }
    ],
    metadata: {
      location: 'Community Center',
      mood: 'tense',
      backgroundImage: 'https://cdn.abacus.ai/images/27cbf489-af31-4565-9ae1-a3badae9928d.png'
    }
  },
  {
    id: 'maria_story',
    title: 'Maria\'s Burden',
    content: `Maria's apartment overlooks the vacant lot, and she sees it every morning with her coffee. Not the weeds and broken glass that others see – she sees potential. Children playing, families gathering, elders sharing stories under the shade of trees they'll plant together.

"Twenty years I've lived here," she tells her reflection in the kitchen window. "Watched good families leave because they couldn't afford rising rents. Watched young people move away because there's nowhere for them to build lives."

Her phone buzzes constantly – texts from neighbors asking what they should do, emails from city council members wanting to "discuss options," calls from developers making increasingly attractive offers for her "influence."

She remembers her grandmother's words: "Mija, community is like a garden. If you don't tend it, it becomes whatever the strongest weeds decide to make it."

The meeting tonight will test everything she's built. Some neighbors trust her completely. Others whisper that she's holding the community back from progress. The young families want change. The elderly fear displacement.

As she walks to the community center, Maria carries the weight of every conversation, every promise, every hope her neighbors have placed in her hands.`,
    choices: [
      {
        id: 'compromise',
        text: 'Propose a compromise that includes some development',
        consequence: 'Risk disappointing purists, but build broader coalition',
        nextSceneId: 'resolution_compromise'
      },
      {
        id: 'stand_firm',
        text: 'Stand firm against any development',
        consequence: 'Maintain principles, risk community division',
        nextSceneId: 'resolution_idealist'
      }
    ],
    metadata: {
      character: 'Maria Santos',
      location: 'Maria\'s Apartment',
      mood: 'contemplative',
      backgroundImage: 'https://cdn.abacus.ai/images/cb658abf-f360-4a0f-977b-fd7db7a6f2a5.png'
    }
  },
  {
    id: 'frank_story',
    title: 'Frank\'s Dilemma',
    content: `The bell above Frank's grocery store door chimes as Mrs. Patterson enters, same as she has every Tuesday for fifteen years. She doesn't need to say anything – Frank already knows she wants milk, bread, and the local gossip.

"What do you think about this lot business, Frank?" she asks, counting out exact change. "My grandson says maybe some fancy shops would be good for the neighborhood."

Frank's calculator mind runs the numbers automatically. The big chain store three blocks over has already cost him 30% of his business. New development might bring foot traffic, but it might also bring rent increases that would force him to close.

His father built this store when Frank was eight years old. Back then, the neighborhood was different – younger families, more languages spoken on every corner, a sense that everyone was building something together. Now he's not sure what they're building toward.

The developers' representative visited last week, hinting that Frank's corner location would be "perfect for a artisanal coffee shop" if the neighborhood "upgraded its demographics." The words sat heavy in his stomach long after the man left.

Tonight he has to choose: support his neighbors' dreams or secure his family's future. At fifty-two, starting over isn't really an option.`,
    choices: [
      {
        id: 'support_community',
        text: 'Support the community garden despite financial risks',
        consequence: 'Choose community over profit',
        nextSceneId: 'resolution_heart'
      },
      {
        id: 'support_development',
        text: 'Support development for economic benefits',
        consequence: 'Choose financial security over sentiment',
        nextSceneId: 'resolution_pragmatic'
      }
    ],
    metadata: {
      character: 'Frank Chen',
      location: 'Frank\'s Grocery Store',
      mood: 'conflicted',
      backgroundImage: 'https://cdn.abacus.ai/images/487db1e0-2611-4b69-abb7-3f1f385e1447.png'
    }
  },
  {
    id: 'aisha_story',
    title: 'Aisha\'s Hope',
    content: `Aisha's second-grade classroom erupts in excited chatter when she mentions the garden project. Seven-year-old hands shoot up with questions: "Can we plant sunflowers?" "Will there be butterflies?" "Can my grandma help us?"

These children see the world as endlessly possible. They don't understand zoning laws or property values or development pressure. They just know they want to plant seeds and watch them grow.

After school, Aisha walks through the vacant lot with her own daughter Maya. They count the wildflowers pushing through the broken concrete, imagine where the community greenhouse might go, plan the storytelling corner where neighborhood elders could share their histories.

But Aisha also knows the harsh realities. Her classroom needs books – many of her students share textbooks from the 1990s. The school needs computers, art supplies, updated playground equipment. New development would mean new tax revenue, better funded schools.

"Mom, look!" Maya points to a butterfly landing on a dandelion. In her daughter's eyes, Aisha sees the same wonder her students show when they talk about their garden dreams.

Tonight she has to speak for those who can't vote yet – the children who will inherit whatever decision the adults make. The question is: what kind of future is she fighting for?`,
    choices: [
      {
        id: 'garden_future',
        text: 'Advocate for the garden as a teaching opportunity',
        consequence: 'Choose community connection over resources',
        nextSceneId: 'resolution_future'
      },
      {
        id: 'school_funding',
        text: 'Support development for school funding',
        consequence: 'Choose educational resources over community space',
        nextSceneId: 'resolution_pragmatic'
      }
    ],
    metadata: {
      character: 'Aisha Johnson',
      location: 'Vacant Lot',
      mood: 'hopeful',
      backgroundImage: 'https://cdn.abacus.ai/images/cb658abf-f360-4a0f-977b-fd7db7a6f2a5.png'
    }
  },
  {
    id: 'resolution_compromise',
    title: 'The Middle Path',
    content: `Six months later, the vacant lot hums with activity. The compromise Maria negotiated wasn't what anyone originally wanted, but it's become something none of them could have imagined alone.

The developer built affordable housing on two-thirds of the lot – twelve units for young families and seniors, with below-market rents guaranteed for ten years. The remaining third became a community garden with a small pavilion for meetings and events.

Frank's store became the unofficial headquarters for the project. His experience with suppliers helped the garden get bulk seeds and tools. The new residents shop at his store, and he's hired Aisha's neighbor's teenager for after-school hours.

Aisha's class adopted garden plots, and the harvest supplies the school lunch program. The pavilion hosts evening classes where community members teach each other everything from financial literacy to traditional cooking.

The solution isn't perfect. Some longtime residents still worry about change. Some activists feel Maria compromised too much. But on Saturday mornings, when three generations work side by side in the garden while children play between the vegetable rows, the neighborhood feels like it's becoming something new while honoring what it's always been.

*This path explored the power of inclusive leadership and creative compromise.*`,
    metadata: {
      location: 'Community Garden',
      mood: 'harmonious'
    }
  },
  {
    id: 'resolution_idealist',
    title: 'Standing Ground',
    content: `The city council meeting was contentious, but Maria's coalition held firm. No development. The vacant lot became a full community garden, with space for events, workshops, and a playground built by volunteer labor.

Two years later, the garden thrives. Children who helped plant the first seeds now lead tours for visitors from other neighborhoods trying to replicate their success. The space hosts quinceañeras, block parties, and memorials. It has become the heart of the community.

But victory came with costs. Several young families moved away when housing prices didn't stabilize. Frank's store struggled until a community investment program helped him modernize and expand. Some neighbors still blame Maria for "blocking progress."

Aisha's school still lacks resources, but the garden provides experiential learning opportunities that standardized tests can't measure. Her students understand ecosystems and community in ways textbooks never taught.

On quiet evenings, Maria walks through the garden paths, listening to Spanish, English, Mandarin, and Somali conversations blending in the summer air. The space they saved isn't just about the land – it's about preserving the neighborhood's soul.

*This path explored the courage required to resist change that doesn't serve the community's deepest values.*`,
    metadata: {
      location: 'Community Garden',
      mood: 'victorious'
    }
  },
  {
    id: 'resolution_pragmatic',
    title: 'Economic Reality',
    content: `The development moved forward with minimal community input. Thirty-six luxury condos now overlook what used to be the vacant lot, with ground-floor retail spaces that remain mostly empty due to high rents.

Frank's store survived by adapting – he now sells artisanal coffee and organic produce to the new residents, though he misses the easy familiarity of his longtime customers. Many of them moved to more affordable neighborhoods as property values rose.

Aisha's school received significant new funding from increased property taxes. New computers, updated textbooks, a renovated playground. But half her students transferred as their families were priced out. The classroom discussions about community gardens now feel like stories from another world.

Maria started a new organization focused on tenants' rights and affordable housing preservation. The fight moved from preserving one lot to protecting an entire way of life. Some battles are won through compromise, others require accepting that change is inevitable and working to shape it.

Three years later, the neighborhood has cleaner sidewalks, better streetlights, and higher property values. Whether it's still the same community depends on who you ask and how long they've lived there.

*This path explored the complex relationships between economic development, community identity, and social change.*`,
    metadata: {
      location: 'Redeveloped Neighborhood',
      mood: 'bittersweet'
    }
  }
];

export function NeighborhoodVoices({ prototype }: NeighborhoodVoicesProps) {
  const [userState, setUserState] = useState<UserState>({
    currentSceneId: 'community_meeting',
    choices: {},
    achievements: [],
    progress: 0,
    metadata: { currentCharacter: null }
  });

  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const currentScene = scenes.find(s => s.id === userState.currentSceneId);

  const handleChoice = (choiceId: string) => {
    if (!currentScene) return;

    const choice = currentScene.choices?.find(c => c.id === choiceId);
    if (!choice?.nextSceneId) return;

    // Track character perspective
    let character = selectedCharacter;
    if (choiceId.includes('perspective')) {
      character = choiceId.split('_')[0];
      setSelectedCharacter(character);
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
        currentCharacter: character,
        lastChoice: choiceId
      }
    });
  };

  const resetStory = () => {
    setUserState({
      currentSceneId: 'community_meeting',
      choices: {},
      achievements: [],
      progress: 0,
      metadata: { currentCharacter: null }
    });
    setSelectedCharacter(null);
  };

  if (!currentScene) return null;

  return (
    <PrototypeBase
      prototype={prototype}
      scenes={scenes}
      userState={userState}
      onStateChange={setUserState}
      className="theme-warm"
    >
      <div 
        className="relative min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${currentScene.metadata?.backgroundImage || prototype.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-orange-100/80" />
        
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
          <div className="space-y-6">
            {/* Character Perspective Indicator */}
            {selectedCharacter && (
              <Card className="bg-white/90 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {characters.find(c => c.id === selectedCharacter)?.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-orange-800">
                        Current Perspective: {characters.find(c => c.id === selectedCharacter)?.name}
                      </h3>
                      <p className="text-sm text-orange-600">
                        {characters.find(c => c.id === selectedCharacter)?.role} • {characters.find(c => c.id === selectedCharacter)?.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scene Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-orange-600 text-white">
                  <Users className="w-3 h-3 mr-1" />
                  COMMUNITY DRAMA
                </Badge>
                <Badge variant="outline" className="border-orange-400 text-orange-700">
                  {currentScene.metadata?.location}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-orange-700">
                <Home className="w-4 h-4" />
                <span>{currentScene.title}</span>
              </div>
            </div>

            {/* Character Panels */}
            {currentScene.id === 'community_meeting' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {characters.map((character) => (
                  <Card key={character.id} className="bg-white/80 border-orange-200 hover:bg-white/90 transition-colors">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{character.avatar}</div>
                      <h3 className="font-semibold text-orange-800">{character.name}</h3>
                      <p className="text-sm text-orange-600 mb-2">{character.role}</p>
                      <p className="text-xs text-orange-500">{character.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Main Scene Card */}
            <Card className="bg-white/95 border-orange-200 shadow-lg">
              <CardContent className="p-8">
                <h1 className="text-3xl font-bold text-orange-800 mb-6 flex items-center gap-3">
                  <Heart className="w-8 h-8 text-orange-600" />
                  {currentScene.title}
                </h1>
                
                <div className="text-gray-800 leading-relaxed mb-8 space-y-4">
                  {currentScene.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Choices */}
                {currentScene.choices && currentScene.choices.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-orange-600 font-medium">
                      <MessageCircle className="w-4 h-4" />
                      Choose your path:
                    </div>
                    
                    <div className="space-y-3">
                      {currentScene.choices.map((choice) => (
                        <Button
                          key={choice.id}
                          onClick={() => handleChoice(choice.id)}
                          variant="outline"
                          size="lg"
                          className="group choice-button border-orange-300 bg-orange-50 text-orange-800 hover:bg-orange-100 hover:border-orange-400 p-6 h-auto text-left justify-start w-full"
                        >
                          <div className="flex items-center gap-4 w-full">
                            <div className="flex-1">
                              <div className="font-medium mb-2 text-orange-900 group-hover:text-orange-800">
                                {choice.text}
                              </div>
                              {choice.consequence && (
                                <div className="text-sm text-orange-600 group-hover:text-orange-700 italic">
                                  {choice.consequence}
                                </div>
                              )}
                            </div>
                            <ArrowRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ending State */}
                {!currentScene.choices && (
                  <div className="space-y-6 pt-6 border-t border-orange-200">
                    <div className="text-center">
                      <Badge variant="secondary" className="bg-orange-600 text-white mb-4">
                        COMMUNITY STORY COMPLETE
                      </Badge>
                      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        You've experienced how individual perspectives and choices shape community outcomes. 
                        Each voice in the neighborhood carried equal weight in determining the collective future.
                      </p>
                      <Button onClick={resetStory} className="bg-orange-600 hover:bg-orange-500 text-white">
                        <Users className="w-4 h-4 mr-2" />
                        Explore Another Path
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
