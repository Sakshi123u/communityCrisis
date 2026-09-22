import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Incident, IncidentSeverity } from '../../types';
import { SeverityBadge } from './SeverityBadge';
import { StatusBadge } from './StatusBadge';
import {
  ArrowRight,
  MapPin,
  Maximize2,
  Layers,
  Radio,
  Sparkles,
  AlertTriangle,
  Info,
  Compass
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Fix Leaflet marker asset resolution
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Props {
  incidents: Incident[];
  selectedIncidentId?: string;
  onSelectIncident?: (incident: Incident) => void;
  height?: string;
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
}

// Map Controller for auto-sizing, smooth flyTo, and auto-fitBounds
const MapController: React.FC<{
  incidents: Incident[];
  selectedIncidentId?: string;
  fitBoundsTrigger: number;
}> = ({ incidents, selectedIncidentId, fitBoundsTrigger }) => {
  const map = useMap();

  // Fix Leaflet 0x0 container size issue when rendering inside dynamic grids
  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [map]);

  // Fit bounds to active incidents on mount or manual trigger
  useEffect(() => {
    const validCoords = incidents
      .filter((i) => i.location?.latitude && i.location?.longitude)
      .map((i) => [i.location.latitude, i.location.longitude] as [number, number]);

    if (validCoords.length > 0) {
      const bounds = L.latLngBounds(validCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else {
      map.setView([18.5204, 73.8567], 12);
    }
  }, [map, fitBoundsTrigger]);

  // Smoothly fly to selected incident if specified
  useEffect(() => {
    if (!selectedIncidentId) return;
    const target = incidents.find((i) => i.id === selectedIncidentId);
    if (target?.location?.latitude && target?.location?.longitude) {
      map.flyTo([target.location.latitude, target.location.longitude], 15, {
        duration: 1.2,
      });
    }
  }, [selectedIncidentId, incidents, map]);

  return null;
};

export const MapViewer: React.FC<Props> = ({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  height = '540px',
  interactive = true,
}) => {
  const { t, translateIncident, translateCategory } = useLanguage();
  const [fitTrigger, setFitTrigger] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [mapTheme, setMapTheme] = useState<'voyager' | 'standard'>('voyager');

  // Filter out resolved from live command map by default
  const activeIncidents = (Array.isArray(incidents) ? incidents : [])
    .filter((i) => i.status !== 'RESOLVED')
    .map((i) => translateIncident(i));

  const filteredIncidents = activeIncidents.filter((inc) => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'CRITICAL') return inc.severity === 'CRITICAL';
    return inc.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  // Severity counts for legend
  const criticalCount = activeIncidents.filter((i) => i.severity === 'CRITICAL').length;
  const highCount = activeIncidents.filter((i) => i.severity === 'HIGH').length;
  const mediumCount = activeIncidents.filter((i) => i.severity === 'MEDIUM').length;
  const lowCount = activeIncidents.filter((i) => i.severity === 'LOW').length;

  const getMarkerColor = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return '#dc2626'; // red-600
      case 'HIGH':
        return '#ea580c'; // orange-600
      case 'MEDIUM':
        return '#d97706'; // amber-600
      case 'LOW':
      default:
        return '#059669'; // emerald-600
    }
  };

  const createCustomIcon = (
    severity: IncidentSeverity,
    priorityScore: number,
    isSelected: boolean
  ) => {
    const color = getMarkerColor(severity);
    const isCritical = severity === 'CRITICAL';
    const size = isSelected ? 42 : isCritical ? 36 : 30;
    const pulseClass = isCritical ? 'critical-pulse' : '';

    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div class="${pulseClass}" style="
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: ${isSelected ? '13px' : '11px'};
          cursor: pointer;
          outline: ${isSelected ? '3px solid #3b82f6' : 'none'};
          outline-offset: 2px;
          transition: transform 0.2s ease;
        ">
          ${priorityScore}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  const tileUrl =
    mapTheme === 'voyager'
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tileAttribution =
    mapTheme === 'voyager'
      ? '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return (
    <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors">
      {/* 1. Tactical Command Header & Filters */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/70 dark:bg-slate-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Geospatial Incident Command Map
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {filteredIncidents.length} Active in Sector
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live spatial intelligence, hazard cluster mapping, and incident telemetry.
              </p>
            </div>
          </div>

          {/* Quick Toolbar Actions */}
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={() => setMapTheme(mapTheme === 'voyager' ? 'standard' : 'voyager')}
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-xs transition-colors"
              title="Toggle Street / Clean Map Style"
            >
              <Layers className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {mapTheme === 'voyager' ? 'Clean Carto' : 'Standard'}
            </button>

            <button
              onClick={() => setFitTrigger((prev) => prev + 1)}
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-colors"
              title="Frame and zoom to all active incidents"
            >
              <Maximize2 className="w-3.5 h-3.5 mr-1" />
              Fit All Incidents
            </button>
          </div>
        </div>

        {/* Category Quick Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1 whitespace-nowrap">Filter Map:</span>
          {[
            { id: 'ALL', label: 'All Hazards' },
            { id: 'CRITICAL', label: '🚨 Critical Only' },
            { id: 'Flood', label: '🌊 Flood & Drainage' },
            { id: 'Electricity', label: '⚡ Power & Grid' },
            { id: 'Water', label: '🚰 Water Pipes' },
            { id: 'Road', label: '🛣️ Road Hazards' },
          ].map((chip) => {
            const isActive = filterCategory === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setFilterCategory(chip.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Leaflet Map */}
      <div className="relative w-full" style={{ height }}>
        <MapContainer
          center={[18.5204, 73.8567]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={interactive}
        >
          <MapController
            incidents={filteredIncidents}
            selectedIncidentId={selectedIncidentId}
            fitBoundsTrigger={fitTrigger}
          />
          <TileLayer attribution={tileAttribution} url={tileUrl} />

          {filteredIncidents.map((incident) => {
            const isSelected = incident.id === selectedIncidentId;
            const pos: [number, number] = [
              incident.location?.latitude || 18.5204,
              incident.location?.longitude || 73.8567,
            ];

            return (
              <Marker
                key={incident.id}
                position={pos}
                icon={createCustomIcon(incident.severity, incident.priorityScore, isSelected)}
                eventHandlers={{
                  click: () => {
                    if (onSelectIncident) {
                      onSelectIncident(incident);
                    }
                  },
                }}
              >
                <Popup className="custom-popup" closeButton={true}>
                  <div className="p-3 max-w-xs text-slate-900 dark:text-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-xs text-blue-600 dark:text-blue-400">
                          {incident.incidentNumber}
                        </span>
                        <SeverityBadge severity={incident.severity} />
                      </div>
                      <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                        Score {incident.priorityScore}/100
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5 leading-snug">
                      {incident.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 flex items-start">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0 mt-0.5" />
                      <span>{incident.location?.address}</span>
                    </p>

                    {incident.aiAnalysis?.summary && (
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 mb-2.5">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">AI Risk Assessment:</strong>
                        <p className="line-clamp-2">{incident.aiAnalysis.summary}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                      <StatusBadge status={incident.status} />
                      {onSelectIncident && (
                        <button
                          onClick={() => onSelectIncident(incident)}
                          className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center shadow-xs cursor-pointer"
                        >
                          Triage & Assign <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* 3. Operational Legend & Utility Purpose Bar */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Severity Legend */}
        <div className="flex items-center space-x-3 flex-wrap gap-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Severity Legend:</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block shadow-xs" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Critical ({criticalCount})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-600 inline-block shadow-xs" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">High ({highCount})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-600 inline-block shadow-xs" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Medium ({mediumCount})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block shadow-xs" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Low ({lowCount})</span>
          </div>
        </div>

        {/* Purpose Explanation */}
        <div className="flex items-center text-slate-500 dark:text-slate-400 text-[11px]">
          <Info className="w-3.5 h-3.5 mr-1.5 text-blue-500 shrink-0" />
          <span>Click any marker to inspect hazard telemetry or select an incident from the queue to pan.</span>
        </div>
      </div>
    </div>
  );
};
