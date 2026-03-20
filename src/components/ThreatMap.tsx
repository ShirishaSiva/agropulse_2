import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { AnalysisResult } from '@/src/services/geminiService';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface ThreatMapProps {
  threats: AnalysisResult['threats'];
}

export const ThreatMap: React.FC<ThreatMapProps> = ({ threats }) => {
  const [selectedThreat, setSelectedThreat] = React.useState<AnalysisResult['threats'][0] | null>(null);

  if (!hasValidKey) {
    return (
      <div className="h-[300px] bg-white dark:bg-stone-900/60 backdrop-blur-xl rounded-xl border-2 border-blue-200 dark:border-stone-800/50 flex items-center justify-center p-6 text-center transition-colors duration-500 shadow-xl">
        <div>
          <p className="text-blue-600 dark:text-stone-500 text-sm font-black uppercase tracking-widest mb-2">Map Offline</p>
          <p className="text-blue-800 dark:text-stone-600 text-xs font-bold">Configure GOOGLE_MAPS_PLATFORM_KEY in Secrets to enable Threat Map.</p>
        </div>
      </div>
    );
  }

  const defaultCenter = threats[0]?.coordinates || { lat: 12.9716, lng: 77.5946 }; // Default to Bangalore or first threat

  return (
    <div className="h-[400px] rounded-xl overflow-hidden border-2 border-blue-200 dark:border-stone-800 shadow-2xl relative transition-colors duration-500">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={10}
          mapId="AGROPULSE_THREAT_MAP"
          // @ts-ignore
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {threats.map((threat, idx) => (
            threat.coordinates && (
              <AdvancedMarker
                key={idx}
                position={threat.coordinates}
                onClick={() => setSelectedThreat(threat)}
              >
                <Pin 
                  background={threat.type.toLowerCase().includes('locust') ? '#f59e0b' : '#ef4444'} 
                  glyphColor="#000"
                  borderColor="#000"
                />
              </AdvancedMarker>
            )
          ))}

          {selectedThreat && selectedThreat.coordinates && (
            <InfoWindow
              position={selectedThreat.coordinates}
              onCloseClick={() => setSelectedThreat(null)}
            >
              <div className="p-2 text-stone-950">
                <h3 className="font-black uppercase text-xs mb-1">{selectedThreat.type}</h3>
                <p className="text-[10px] leading-tight">{selectedThreat.description}</p>
                <p className="text-[10px] font-bold mt-1">Radius: {selectedThreat.radiusKm}km</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
      
      <div className="absolute top-4 left-4 bg-white dark:bg-stone-950/80 backdrop-blur border border-blue-200 dark:border-stone-800 px-3 py-1 rounded-full transition-colors duration-500 shadow-md">
        <span className="text-[10px] font-black text-blue-600 dark:text-stone-400 uppercase tracking-widest">Active Threat Radius</span>
      </div>
    </div>
  );
};
