
import { notFound } from 'next/navigation';
import { PROTOTYPES } from '@/lib/constants';
import { DigitalConspiracy } from '@/components/prototypes/digital-conspiracy';
import { FragmentsMemory } from '@/components/prototypes/fragments-memory';
import { NeighborhoodVoices } from '@/components/prototypes/neighborhood-voices';
import { HiddenTruth } from '@/components/prototypes/hidden-truth';
import { QuestUnity } from '@/components/prototypes/quest-unity';

interface PrototypePageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return PROTOTYPES.map((prototype) => ({
    id: prototype.id,
  }));
}

export async function generateMetadata({ params }: PrototypePageProps) {
  const prototype = PROTOTYPES.find(p => p.id === params.id);
  
  if (!prototype) {
    return {
      title: 'Prototype Not Found',
    };
  }

  return {
    title: `${prototype.title} - Interactive Novel Prototype`,
    description: prototype.description,
  };
}

export default function PrototypePage({ params }: PrototypePageProps) {
  const prototype = PROTOTYPES.find(p => p.id === params.id);
  
  if (!prototype) {
    notFound();
  }

  const renderPrototype = () => {
    switch (params.id) {
      case 'digital-conspiracy':
        return <DigitalConspiracy prototype={prototype} />;
      case 'fragments-memory':
        return <FragmentsMemory prototype={prototype} />;
      case 'neighborhood-voices':
        return <NeighborhoodVoices prototype={prototype} />;
      case 'hidden-truth':
        return <HiddenTruth prototype={prototype} />;
      case 'quest-unity':
        return <QuestUnity prototype={prototype} />;
      default:
        notFound();
    }
  };

  return (
    <div className="min-h-screen">
      {renderPrototype()}
    </div>
  );
}
