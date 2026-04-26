
import { DashboardHeader } from '@/components/dashboard-header';
import { PrototypeGrid } from '@/components/prototype-grid';
import { FeatureShowcase } from '@/components/feature-showcase';
import { TechnicalSpecs } from '@/components/technical-specs';
import { OverallFeedback } from '@/components/overall-feedback';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Immersive Novel Prototype Suite
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of interactive storytelling through five distinct prototypes, 
            each exploring unique approaches to branching scenario novels with cutting-edge features.
          </p>
        </div>

        <FeatureShowcase />
        
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Explore the Prototypes</h2>
          <PrototypeGrid />
        </div>

        <TechnicalSpecs />
        
        <OverallFeedback />
      </main>
    </div>
  );
}
