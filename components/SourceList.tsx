import React from 'react';
import { GroundingChunk } from '../types';
import { ExternalLink } from 'lucide-react';

interface SourceListProps {
  sources: GroundingChunk[];
}

export const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  // Filter out sources that don't have web URIs
  const webSources = sources.filter(s => s.web?.uri);

  if (webSources.length === 0) return null;

  return (
    <div className="mt-6 pt-4 border-t border-white/10">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
        <ExternalLink size={12} />
        Sources & Grounding
      </h4>
      <div className="flex flex-wrap gap-2">
        {webSources.map((source, idx) => (
          <a
            key={idx}
            href={source.web?.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-1.5 rounded-full transition-colors truncate max-w-[200px]"
            title={source.web?.title}
          >
            {source.web?.title || new URL(source.web?.uri || '').hostname}
          </a>
        ))}
      </div>
    </div>
  );
};
