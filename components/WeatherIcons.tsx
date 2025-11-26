import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudSnow, 
  CloudDrizzle, 
  Wind,
  CloudFog,
  Moon
} from 'lucide-react';

export const getWeatherIcon = (condition: string, size: number = 24, className: string = "") => {
  const c = condition.toLowerCase();
  
  if (c.includes('rain') || c.includes('shower')) return <CloudRain size={size} className={className} />;
  if (c.includes('thunder') || c.includes('storm')) return <CloudLightning size={size} className={className} />;
  if (c.includes('snow') || c.includes('ice') || c.includes('flurry')) return <CloudSnow size={size} className={className} />;
  if (c.includes('drizzle')) return <CloudDrizzle size={size} className={className} />;
  if (c.includes('fog') || c.includes('mist')) return <CloudFog size={size} className={className} />;
  if (c.includes('wind')) return <Wind size={size} className={className} />;
  if (c.includes('cloud') || c.includes('overcast')) return <Cloud size={size} className={className} />;
  if (c.includes('clear') || c.includes('sun')) return <Sun size={size} className={className} />;
  
  return <Sun size={size} className={className} />; // Default
};
