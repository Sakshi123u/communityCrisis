import { Department, Incident, KnowledgeDocument, UserProfile, AuditLog, AppNotification } from '../types';

const floodedStreetImg = '/images/flooded_street_issue_1786525186065.jpg';
const burstWaterPipeImg = '/images/burst_pipe_issue_1786525205493.jpg';
const danglingPowerLineImg = '/images/dangling_powerline_issue_1786525222740.jpg';
const roadPotholeImg = '/images/road_pothole_issue_1786525243706.jpg';
const overflowingGarbageImg = '/images/overflowing_garbage_issue_1786525262408.jpg';
const trafficSignalOutageImg = '/images/traffic_signal_issue_1786525279369.jpg';
const darkStreetlightImg = '/images/dark_streetlight_issue_1786525297802.jpg';

export const initialDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'Disaster Management & Drainage',
    code: 'DMD',
    description: 'Handles flood response, emergency evacuations, storm drainage, and severe weather hazards.',
    officerCount: 14,
    activeIncidentsCount: 8,
    resolvedCount: 42,
    contactEmail: 'drainage-disaster@citycivic.gov',
    contactPhone: '+1 (555) 019-2831'
  },
  {
    id: 'dept-2',
    name: 'Roads & Transport Authority',
    code: 'RTA',
    description: 'Responsible for road repair, potholes, traffic signal maintenance, and bridge integrity.',
    officerCount: 22,
    activeIncidentsCount: 12,
    resolvedCount: 89,
    contactEmail: 'roads@citycivic.gov',
    contactPhone: '+1 (555) 012-3982'
  },
  {
    id: 'dept-3',
    name: 'Municipal Water Board',
    code: 'MWB',
    description: 'Manages water supply infrastructure, main pipeline bursts, sewage lines, and water quality.',
    officerCount: 18,
    activeIncidentsCount: 6,
    resolvedCount: 64,
    contactEmail: 'waterboards@citycivic.gov',
    contactPhone: '+1 (555) 017-4820'
  },
  {
    id: 'dept-4',
    name: 'Waste Management & Sanitation',
    code: 'WMS',
    description: 'Collects municipal solid waste, addresses illegal dumping, overflow, and hazardous waste.',
    officerCount: 25,
    activeIncidentsCount: 5,
    resolvedCount: 110,
    contactEmail: 'sanitation@citycivic.gov',
    contactPhone: '+1 (555) 014-9921'
  },
  {
    id: 'dept-5',
    name: 'Electricity & Public Lighting Grid',
    code: 'EPL',
    description: 'Maintains streetlights, power transformers, dangerous hanging wires, and power grid failures.',
    officerCount: 16,
    activeIncidentsCount: 4,
    resolvedCount: 58,
    contactEmail: 'grid-power@citycivic.gov',
    contactPhone: '+1 (555) 018-3310'
  },
  {
    id: 'dept-6',
    name: 'Public Safety & Enforcement',
    code: 'PSE',
    description: 'Coordinates emergency response, traffic accidents, structural safety hazards, and community safety.',
    officerCount: 30,
    activeIncidentsCount: 3,
    resolvedCount: 95,
    contactEmail: 'publicsafety@citycivic.gov',
    contactPhone: '+1 (555) 011-2000'
  }
];

export const sampleUsers: UserProfile[] = [
  {
    id: 'user-demo-citizen',
    name: 'Citizen Demo User',
    email: 'citizen@demo.com',
    phone: '+1 (555) 000-1111',
    role: 'CITIZEN',
    preferredLanguage: 'en',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'user-demo-authority',
    name: 'Authority Officer Demo',
    email: 'authority@demo.com',
    phone: '+1 (555) 000-2222',
    role: 'AUTHORITY',
    departmentId: 'dept-1',
    departmentName: 'Disaster Management & Drainage',
    employeeId: 'EMP-DEMO',
    preferredLanguage: 'en',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'user-demo-admin',
    name: 'Admin Governance Demo',
    email: 'admin@demo.com',
    phone: '+1 (555) 000-3333',
    role: 'ADMIN',
    employeeId: 'ADM-DEMO',
    preferredLanguage: 'en',
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'user-citizen-1',
    name: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    phone: '+1 (555) 234-5678',
    role: 'CITIZEN',
    preferredLanguage: 'en',
    isActive: true,
    createdAt: '2026-01-15T08:30:00Z'
  },
  {
    id: 'user-citizen-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+1 (555) 345-6789',
    role: 'CITIZEN',
    preferredLanguage: 'hi',
    isActive: true,
    createdAt: '2026-02-01T10:15:00Z'
  },
  {
    id: 'user-authority-1',
    name: 'Officer Rajesh Kumar',
    email: 'rajesh.kumar@citycivic.gov',
    phone: '+1 (555) 888-0123',
    role: 'AUTHORITY',
    departmentId: 'dept-1',
    departmentName: 'Disaster Management & Drainage',
    employeeId: 'EMP-9021',
    preferredLanguage: 'en',
    isActive: true,
    createdAt: '2025-11-10T09:00:00Z'
  },
  {
    id: 'user-authority-2',
    name: 'Officer Sunita Deshmukh',
    email: 'sunita.d@citycivic.gov',
    phone: '+1 (555) 888-0124',
    role: 'AUTHORITY',
    departmentId: 'dept-2',
    departmentName: 'Roads & Transport Authority',
    employeeId: 'EMP-9025',
    preferredLanguage: 'mr',
    isActive: true,
    createdAt: '2025-12-01T09:00:00Z'
  },
  {
    id: 'user-admin-1',
    name: 'Administrator Sarah Jenkins',
    email: 'admin.jenkins@citycivic.gov',
    phone: '+1 (555) 999-0001',
    role: 'ADMIN',
    employeeId: 'ADM-0001',
    preferredLanguage: 'en',
    isActive: true,
    createdAt: '2025-10-01T08:00:00Z'
  }
];

export const initialIncidents: Incident[] = [
  {
    id: 'inc-101',
    incidentNumber: 'INC-2026-000101',
    title: 'Severe Waterlogging & Storm Drain Blockage on Main Arterial Highway',
    description: 'Heavy rain from storm last night resulted in 2 feet of standing water near the central subway underpass. Traffic is halted and water is entering nearby ground-floor commercial shops.',
    category: 'Flood',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    priorityScore: 94,
    priorityFactors: {
      severity: 95,
      populationImpact: 90,
      locationRisk: 95,
      urgency: 98,
      evidenceConfidence: 92
    },
    citizenId: 'user-citizen-1',
    citizenName: 'Aarav Patel',
    citizenEmail: 'aarav.patel@example.com',
    location: {
      address: 'Central Subway Underpass, 45 Main Arterial Rd, District 4',
      latitude: 18.5204,
      longitude: 73.8567,
      district: 'Central Metro Zone',
      landmark: 'Near City Central Bus Terminal'
    },
    media: [
      {
        id: 'med-1',
        incidentId: 'inc-101',
        fileName: 'flooded_street_arterial.jpg',
        fileType: 'image/jpeg',
        fileSize: 2450000,
        downloadURL: floodedStreetImg,
        mediaType: 'image',
        createdAt: '2026-08-10T14:20:00Z'
      }
    ],
    aiAnalysis: {
      category: 'Flood',
      severity: 'CRITICAL',
      confidence: 94,
      summary: 'High water accumulation (approx 24 inches) blocking key commuter transit artery. Substantial flood risk to surrounding infrastructure and ground-floor businesses.',
      detectedEvidence: [
        'Photo Verified: Urban rainwater inundation & submerged asphalt',
        'Standing water > 1.5 ft',
        'Subway entrance submerged',
        'Stalled motor vehicles'
      ],
      potentialImpact: 'High risk to commuters, potential electrical exposure if underground junction boxes flood, trade disruption.',
      recommendedDepartment: 'Disaster Management & Drainage',
      recommendedActions: {
        immediate: [
          'Deploy high-capacity mobile dewatering pump trucks immediately.',
          'Issue immediate traffic redirection advisory via Public Safety radio.'
        ],
        shortTerm: [
          'Inspect subterranean storm drain intake culverts for debris clogging.',
          'Clear silt and plastic waste build-up from drainage grates.'
        ],
        longTerm: [
          'Upgrade culvert capacity from 600mm to 1200mm diameter reinforced concrete pipes.',
          'Install automated water level sensor sensors connected to early warning grid.'
        ]
      },
      priorityScore: 94,
      priorityFactors: {
        severity: 95,
        populationImpact: 90,
        locationRisk: 95,
        urgency: 98,
        evidenceConfidence: 92
      },
      reasoning: 'Critical severity assigned due to high traffic volume on Main Arterial Rd, active water entry into commercial premises, and immediate safety hazard.',
      modelUsed: 'gemini-3.6-flash',
      analyzedAt: '2026-08-10T14:21:00Z'
    },
    assignedDepartmentId: 'dept-1',
    assignedDepartmentName: 'Disaster Management & Drainage',
    assignedOfficerId: 'user-authority-1',
    assignedOfficerName: 'Officer Rajesh Kumar',
    createdAt: '2026-08-10T14:20:00Z',
    updatedAt: '2026-08-10T15:00:00Z',
    internalNotes: [
      {
        id: 'note-1',
        author: 'Officer Rajesh Kumar',
        text: 'Dispatched Pump Unit #4 and 3 field technicians to site. ETA 20 mins.',
        createdAt: '2026-08-10T14:45:00Z'
      }
    ],
    publicUpdates: [
      {
        id: 'pub-1',
        author: 'Disaster Management Team',
        text: 'Drainage response team is currently on site with high-capacity pumps. Traffic detour in place via 5th Avenue.',
        createdAt: '2026-08-10T15:00:00Z'
      }
    ]
  },
  {
    id: 'inc-102',
    incidentNumber: 'INC-2026-000102',
    title: 'High-Pressure Water Pipeline Burst Damaging Road Foundation',
    description: 'Clean drinking water is gushing from underground pipe near Park Avenue. The road surface is collapsing into a sinkhole.',
    category: 'Water Leakage',
    severity: 'HIGH',
    status: 'ASSIGNED',
    priorityScore: 88,
    priorityFactors: {
      severity: 85,
      populationImpact: 88,
      locationRisk: 85,
      urgency: 90,
      evidenceConfidence: 95
    },
    citizenId: 'user-citizen-2',
    citizenName: 'Priya Sharma',
    citizenEmail: 'priya.sharma@example.com',
    location: {
      address: '72 Park Avenue, North Ward, Zone 2',
      latitude: 18.5312,
      longitude: 73.8445,
      district: 'North Residential Ward',
      landmark: 'Opposite Community General Hospital'
    },
    media: [
      {
        id: 'med-2',
        incidentId: 'inc-102',
        fileName: 'water_pipe_burst.jpg',
        fileType: 'image/jpeg',
        fileSize: 1890000,
        downloadURL: burstWaterPipeImg,
        mediaType: 'image',
        createdAt: '2026-08-10T11:10:00Z'
      }
    ],
    aiAnalysis: {
      category: 'Water Leakage',
      severity: 'HIGH',
      confidence: 96,
      summary: 'High pressure feeder pipe rupture causing erosion beneath asphalt foundation. Potential sinkhole expansion adjacent to residential apartments.',
      detectedEvidence: [
        'Photo Verified: High-pressure water plume & underground pipe rupture',
        'Pressurized water plume',
        'Sub-base soil erosion',
        'Asphalt cracking'
      ],
      potentialImpact: 'Loss of municipal potable water for 12,000 residents; road collapse hazard for vehicles.',
      recommendedDepartment: 'Municipal Water Board',
      recommendedActions: {
        immediate: [
          'Shut down main supply valve #12 at North Substation to stop pressurized water release.',
          'Cordon off 50-meter radius around asphalt depression.'
        ],
        shortTerm: [
          'Expose pipe segment using excavator and install clamp collar repair.',
          'Backfill road foundation with aggregate crushed stone.'
        ],
        longTerm: [
          'Perform acoustic leak detection along the entire 3km ductile iron pipe line.'
        ]
      },
      priorityScore: 88,
      priorityFactors: {
        severity: 85,
        populationImpact: 88,
        locationRisk: 85,
        urgency: 90,
        evidenceConfidence: 95
      },
      reasoning: 'Proximity to Community Hospital increases risk level. Potable water loss affects thousands.',
      modelUsed: 'gemini-3.6-flash',
      analyzedAt: '2026-08-10T11:11:00Z'
    },
    assignedDepartmentId: 'dept-3',
    assignedDepartmentName: 'Municipal Water Board',
    createdAt: '2026-08-10T11:10:00Z',
    updatedAt: '2026-08-10T11:35:00Z'
  },
  {
    id: 'inc-103',
    incidentNumber: 'INC-2026-000103',
    title: 'Exposed High-Voltage Electrical Wire Hanging Near School Gate',
    description: 'Transformer pole wire snapped following strong wind gusts. Wires are dangling 4 feet above sidewalk directly outside St. Jude Elementary School.',
    category: 'Electricity',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    priorityScore: 97,
    priorityFactors: {
      severity: 98,
      populationImpact: 95,
      locationRisk: 99,
      urgency: 99,
      evidenceConfidence: 94
    },
    citizenId: 'user-citizen-1',
    citizenName: 'Aarav Patel',
    location: {
      address: '12 School Lane, St. Jude Sector, Ward 8',
      latitude: 18.5140,
      longitude: 73.8620,
      district: 'East Academic Zone',
      landmark: 'St. Jude Elementary School Gate 1'
    },
    media: [
      {
        id: 'med-3',
        incidentId: 'inc-103',
        fileName: 'dangling_power_line.jpg',
        fileType: 'image/jpeg',
        fileSize: 1200000,
        downloadURL: danglingPowerLineImg,
        mediaType: 'image',
        createdAt: '2026-08-10T07:40:00Z'
      }
    ],
    aiAnalysis: {
      category: 'Electricity',
      severity: 'CRITICAL',
      confidence: 98,
      summary: 'Dangling 11kV conductor line outside elementary school gate. Extreme electrocution risk to children and pedestrians.',
      detectedEvidence: [
        'Photo Verified: Dangling high-voltage electrical power conductor line',
        'Dangling uninsulated cable',
        'Utility pole crossarm fracture'
      ],
      potentialImpact: 'Immediate life-threatening electrocution risk for elementary students and school staff during dismissal.',
      recommendedDepartment: 'Electricity & Public Lighting Grid',
      recommendedActions: {
        immediate: [
          'De-energize Feeder Line #8B from Grid Substation immediately.',
          'Dispatch rapid electrical response unit with safety perimeter cones.'
        ],
        shortTerm: [
          'Re-anchor conductor cable and replace insulator porcelain shoes.',
          'Verify earthing ground impedance.'
        ],
        longTerm: [
          'Replace overhead line with underground armored cable along school zones.'
        ]
      },
      priorityScore: 97,
      priorityFactors: {
        severity: 98,
        populationImpact: 95,
        locationRisk: 99,
        urgency: 99,
        evidenceConfidence: 94
      },
      reasoning: 'Proximity to primary school children during morning arrival window triggers maximum urgency rating.',
      modelUsed: 'gemini-3.6-flash',
      analyzedAt: '2026-08-10T07:41:00Z'
    },
    assignedDepartmentId: 'dept-5',
    assignedDepartmentName: 'Electricity & Public Lighting Grid',
    createdAt: '2026-08-10T07:40:00Z',
    updatedAt: '2026-08-10T08:05:00Z'
  },
  {
    id: 'inc-104',
    incidentNumber: 'INC-2026-000104',
    title: 'Dangerous Deep Pothole Array Creating Multiple Vehicle Accidents',
    description: 'A series of three 8-inch deep asphalt potholes across both lanes of Commerce Boulevard. Two motorcyclists skid and sustained minor injuries.',
    category: 'Road Damage',
    severity: 'HIGH',
    status: 'UNDER_REVIEW',
    priorityScore: 82,
    priorityFactors: {
      severity: 80,
      populationImpact: 82,
      locationRisk: 85,
      urgency: 80,
      evidenceConfidence: 84
    },
    citizenId: 'user-citizen-2',
    citizenName: 'Priya Sharma',
    location: {
      address: ' Commerce Boulevard, Intersection with 14th Cross St',
      latitude: 18.5080,
      longitude: 73.8320,
      district: 'Commercial Outer Ring',
      landmark: 'Near Tech Park Gate 3'
    },
    media: [
      {
        id: 'med-4',
        incidentId: 'inc-104',
        fileName: 'road_pothole_crater.jpg',
        fileType: 'image/jpeg',
        fileSize: 1650000,
        downloadURL: roadPotholeImg,
        mediaType: 'image',
        createdAt: '2026-08-09T16:15:00Z'
      }
    ],
    aiAnalysis: {
      category: 'Road Damage',
      severity: 'HIGH',
      confidence: 91,
      summary: 'Multiple deep structural asphalt pavement craters across active travel lanes causing vehicle wheel damage and two-wheeler accidents.',
      detectedEvidence: [
        'Photo Verified: Asphalt pavement collapse & deep pothole depression',
        'Asphalt sub-base collapse',
        'Sharp pavement edges',
        'High traffic flow corridor'
      ],
      potentialImpact: 'Vehicle tyre blowout, motorcycle loss of control, severe traffic bottlenecks.',
      recommendedDepartment: 'Roads & Transport Authority',
      recommendedActions: {
        immediate: [
          'Place warning barricades and reflector cones around road depressions.'
        ],
        shortTerm: [
          'Apply quick-setting cold mix bituminous patch within 12 hours.'
        ],
        longTerm: [
          'Milling and hot-mix asphalt resurfacing of 200m stretch.'
        ]
      },
      priorityScore: 82,
      priorityFactors: {
        severity: 80,
        populationImpact: 82,
        locationRisk: 85,
        urgency: 80,
        evidenceConfidence: 84
      },
      reasoning: 'Active accidents reported; immediate hazard to two-wheelers during night driving.',
      modelUsed: 'gemini-3.6-flash',
      analyzedAt: '2026-08-09T16:16:00Z'
    },
    assignedDepartmentId: 'dept-2',
    assignedDepartmentName: 'Roads & Transport Authority',
    createdAt: '2026-08-09T16:15:00Z',
    updatedAt: '2026-08-09T17:00:00Z'
  },
  {
    id: 'inc-105',
    incidentNumber: 'INC-2026-000105',
    title: 'Uncontrolled Garbage Overflow & Chemical Leachate Accumulation',
    description: 'Community dumpster has not been cleared for 6 days. Waste overflow is blocking sidewalk and rotting food waste is leaking foul liquid into storm drain.',
    category: 'Garbage',
    severity: 'MEDIUM',
    status: 'SUBMITTED',
    priorityScore: 68,
    priorityFactors: {
      severity: 65,
      populationImpact: 70,
      locationRisk: 65,
      urgency: 70,
      evidenceConfidence: 88
    },
    citizenId: 'user-citizen-1',
    citizenName: 'Aarav Patel',
    location: {
      address: 'Behind Green Valley Apartments, Sector 5',
      latitude: 18.5380,
      longitude: 73.8710,
      district: 'Green Valley Ward',
      landmark: 'Adjacent to Sector 5 Market'
    },
    media: [
      {
        id: 'med-5',
        incidentId: 'inc-105',
        fileName: 'dumpster_overflow.jpg',
        fileType: 'image/jpeg',
        fileSize: 2100000,
        downloadURL: overflowingGarbageImg,
        mediaType: 'image',
        createdAt: '2026-08-09T10:00:00Z'
      }
    ],
    aiAnalysis: {
      category: 'Garbage',
      severity: 'MEDIUM',
      confidence: 89,
      summary: 'Solid municipal waste accumulation exceeding container volume by 300%. Biohazard risks from pest breeding and foul odor near market area.',
      detectedEvidence: [
        'Photo Verified: Overflowing community waste bin & scattered refuse',
        'Uncontained solid waste',
        'Leachate runoff',
        'Blocked pedestrian path'
      ],
      potentialImpact: 'Public health vector risk (rodents, mosquitoes), foul odor affecting local market vendors.',
      recommendedDepartment: 'Waste Management & Sanitation',
      recommendedActions: {
        immediate: [
          'Dispatch hydraulic compactor truck and sanitation team for complete clearance.'
        ],
        shortTerm: [
          'Disinfect site with lime powder and eco-sanitizer spray.'
        ],
        longTerm: [
          'Increase dumpster bin count from 1 to 3; adjust collection route to daily morning schedule.'
        ]
      },
      priorityScore: 68,
      priorityFactors: {
        severity: 65,
        populationImpact: 70,
        locationRisk: 65,
        urgency: 70,
        evidenceConfidence: 88
      },
      reasoning: 'Moderate public health concern; requires prompt clearance within 24 hours.',
      modelUsed: 'gemini-3.6-flash',
      analyzedAt: '2026-08-09T10:01:00Z'
    },
    createdAt: '2026-08-09T10:00:00Z',
    updatedAt: '2026-08-09T10:00:00Z'
  },
  {
    id: 'inc-106',
    incidentNumber: 'INC-2026-000106',
    title: 'Major Traffic Signal Outage at Busy 4-Way Intersection',
    description: 'Traffic signals on all 4 quadrants are completely blacked out following transformer failure. Heavy congestion and near-collisions occurring.',
    category: 'Traffic Accident',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    priorityScore: 86,
    priorityFactors: {
      severity: 85,
      populationImpact: 90,
      locationRisk: 88,
      urgency: 85,
      evidenceConfidence: 90
    },
    citizenId: 'user-citizen-2',
    citizenName: 'Priya Sharma',
    location: {
      address: 'Grand Junction 4-Way Crossing, Ward 11',
      latitude: 18.5250,
      longitude: 73.8500,
      district: 'Central Metro Zone'
    },
    media: [
      {
        id: 'med-6',
        incidentId: 'inc-106',
        fileName: 'intersection_traffic_light.jpg',
        fileType: 'image/jpeg',
        fileSize: 1980000,
        downloadURL: trafficSignalOutageImg,
        mediaType: 'image',
        createdAt: '2026-08-08T17:55:00Z'
      }
    ],
    aiAnalysis: {
      category: 'Traffic Accident',
      severity: 'HIGH',
      confidence: 90,
      summary: 'Complete power loss to traffic management signal controller box at high density intersection.',
      detectedEvidence: [
        'Photo Verified: Urban 4-way intersection traffic signal outage & vehicle congestion',
        'Uncontrolled gridlock',
        'Blacked-out signal heads'
      ],
      potentialImpact: 'High likelihood of vehicular collisions and emergency vehicle delays.',
      recommendedDepartment: 'Public Safety & Enforcement',
      recommendedActions: {
        immediate: [
          'Dispatch 2 traffic officers to manually direct traffic flow.',
          'Deploy portable solar auxiliary signal trailer.'
        ],
        shortTerm: [
          'Replace blown fuse module in master traffic control cabinet.'
        ],
        longTerm: [
          'Equip intersection control cabinet with battery backup system providing 8h autonomy.'
        ]
      },
      priorityScore: 86,
      priorityFactors: {
        severity: 85,
        populationImpact: 90,
        locationRisk: 88,
        urgency: 85,
        evidenceConfidence: 90
      },
      reasoning: 'Major arterial intersection gridlock poses imminent accident danger.',
      modelUsed: 'gemini-3.6-flash',
      analyzedAt: '2026-08-08T18:00:00Z'
    },
    assignedDepartmentId: 'dept-6',
    assignedDepartmentName: 'Public Safety & Enforcement',
    createdAt: '2026-08-08T17:55:00Z',
    updatedAt: '2026-08-08T18:30:00Z'
  },
  {
    id: 'inc-107',
    incidentNumber: 'INC-2026-000107',
    title: 'Broken High-Mast Streetlight Array Leaving Dark Corridor',
    description: 'Eight consecutive streetlights along Riverside Promenade are dark for 3 nights, raising safety concerns for pedestrians and evening joggers.',
    category: 'Streetlight',
    severity: 'LOW',
    status: 'RESOLVED',
    priorityScore: 45,
    priorityFactors: {
      severity: 40,
      populationImpact: 50,
      locationRisk: 45,
      urgency: 40,
      evidenceConfidence: 90
    },
    citizenId: 'user-citizen-1',
    citizenName: 'Aarav Patel',
    location: {
      address: 'Riverside Walkway Promenade, Zone 1',
      latitude: 18.5410,
      longitude: 73.8290,
      district: 'West Waterfront Zone'
    },
    media: [
      {
        id: 'med-7',
        incidentId: 'inc-107',
        fileName: 'dark_street_lights.jpg',
        fileType: 'image/jpeg',
        fileSize: 1540000,
        downloadURL: darkStreetlightImg,
        mediaType: 'image',
        createdAt: '2026-08-05T19:50:00Z'
      }
    ],
    aiAnalysis: {
      category: 'Streetlight',
      severity: 'LOW',
      confidence: 92,
      summary: 'Non-functional LED streetlight luminaires along pedestrian park path.',
      detectedEvidence: [
        'Photo Verified: Dark night walkway with unlit streetlight poles',
        'Unlit street poles'
      ],
      potentialImpact: 'Reduced night visibility and feeling of insecurity for pedestrians.',
      recommendedDepartment: 'Electricity & Public Lighting Grid',
      recommendedActions: {
        immediate: ['Inspect timer switch circuit breaker in junction pedestal #R2.'],
        shortTerm: ['Replace faulty photo-sensor relay switch.'],
        longTerm: ['Integrate smart mesh wireless monitoring for automated outage alerts.']
      },
      priorityScore: 45,
      priorityFactors: {
        severity: 40,
        populationImpact: 50,
        locationRisk: 45,
        urgency: 40,
        evidenceConfidence: 90
      },
      reasoning: 'Low risk to life; maintenance repair required within standard SLA.',
      modelUsed: 'gemini-3.6-flash',
      analyzedAt: '2026-08-05T20:00:00Z'
    },
    assignedDepartmentId: 'dept-5',
    assignedDepartmentName: 'Electricity & Public Lighting Grid',
    createdAt: '2026-08-05T19:50:00Z',
    updatedAt: '2026-08-07T11:00:00Z',
    resolvedAt: '2026-08-07T11:00:00Z'
  }
];

export const sampleKnowledgeBase: KnowledgeDocument[] = [
  {
    id: 'kb-1',
    title: 'Municipal Flood Emergency Response Standard Operating Procedure',
    category: 'Disaster Management',
    summary: 'Protocol for managing urban flooding, dewatering equipment dispatch, emergency shelter deployment, and citizen evacuation.',
    content: `When standing water exceeds 12 inches on primary transport routes or enters residential dwellings, the Disaster Management & Drainage unit must enact Protocol Alpha-2.
1. High-capacity mobile dewatering pumps (minimum 500 GPM) must be dispatched within 30 minutes.
2. Traffic diversions must be posted in coordination with Public Safety.
3. If water reaches 24 inches, electrical power sub-stations serving the sector must be evaluated for immediate isolation to prevent aquatic current leakage.
4. Emergency temporary shelters in designated municipal schools must be opened for displaced ground-floor residents.`,
    source: 'Municipal Disaster Preparedness Code 2025 (Section 4.1)',
    updatedAt: '2025-10-15T00:00:00Z'
  },
  {
    id: 'kb-2',
    title: 'Potable Water Pipeline Rupture & Contamination Prevention Policy',
    category: 'Water Board',
    summary: 'Guidelines for shutting down water mains, isolation valve protocols, repair standards, and public health water boiling advisories.',
    content: `Main pipeline leaks with structural asphalt degradation require immediate double-isolation valve closure.
1. Primary supply valves upstream must be closed within 45 minutes of incident verification.
2. If water main pressure drops below 20 PSI, a precautionary boil water notice must be broadcast to affected municipal wards via SMS and Civic App.
3. Repair procedures must include bacteriological testing prior to line re-pressurization.
4. Heavy excavation near road foundations requires utility clearance check from Electricity and Telecom teams before digging.`,
    source: 'City Water Infrastructure Manual v3.2',
    updatedAt: '2025-11-20T00:00:00Z'
  },
  {
    id: 'kb-3',
    title: 'Electrical Hazard Immediate Containment Standard',
    category: 'Electricity Grid',
    summary: 'Safety protocol for downed electrical wires, high voltage transformer fires, and public school protection radii.',
    content: `Any reported downed line or sagging wire within 100 meters of a school, hospital, or public park is designated Tier-1 Immediate Critical Threat.
1. Grid Substation remote isolation must occur within 10 minutes of AI/citizen notification.
2. Mandatory 20-meter safety clearance zone must be established with physical barriers until verified de-energized by a certified lineman using a voltage tester.
3. Restoration requires full conductor insulation testing and grounding rod verification.`,
    source: 'State Electrical Safety Code & Public Health Mandate',
    updatedAt: '2025-09-01T00:00:00Z'
  },
  {
    id: 'kb-4',
    title: 'Road Surface & Pothole Repair Response SLA Guideline',
    category: 'Roads & Transport',
    summary: 'SLA response times for asphalt potholes, sinkholes, and structural pavement defects.',
    content: `Potholes are categorized by depth and location risk:
- Category 1 (Depth > 4 inches on arterial road): Temporary cold mix fill required within 12 hours; permanent hot mix overlay within 72 hours.
- Category 2 (Depth 2-4 inches on secondary road): Repair within 48 hours.
- Category 3 (Minor surface peeling): Included in routine monthly paving schedule.
If accidents or injuries are reported, priority score automatically escalates to HIGH/CRITICAL regardless of pothole dimension.`,
    source: 'Department of Public Works SLA Standard 2026',
    updatedAt: '2026-01-10T00:00:00Z'
  }
];

export const sampleAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    actorId: 'user-authority-1',
    actorName: 'Officer Rajesh Kumar',
    actorRole: 'AUTHORITY',
    action: 'STATUS_CHANGE',
    targetId: 'INC-2026-000101',
    details: 'Changed status from ASSIGNED to IN_PROGRESS. Dispatched Pump Unit #4.',
    timestamp: '2026-08-10T14:45:00Z'
  },
  {
    id: 'log-2',
    actorId: 'user-admin-1',
    actorName: 'Administrator Sarah Jenkins',
    actorRole: 'ADMIN',
    action: 'DEPARTMENT_ASSIGNMENT',
    targetId: 'INC-2026-000102',
    details: 'Assigned incident to Municipal Water Board based on AI recommendation.',
    timestamp: '2026-08-10T11:35:00Z'
  },
  {
    id: 'log-3',
    actorId: 'user-authority-2',
    actorName: 'Officer Sunita Deshmukh',
    actorRole: 'AUTHORITY',
    action: 'PRIORITY_OVERRIDE',
    targetId: 'INC-2026-000104',
    details: 'Manually raised priority score from 75 to 82 due to morning rush hour traffic impact.',
    timestamp: '2026-08-09T17:00:00Z'
  }
];

export const sampleNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-citizen-1',
    title: 'Incident Update: INC-2026-000101',
    message: 'Disaster Management Team is on site with high-capacity pumps at Central Subway.',
    type: 'INFO',
    read: false,
    incidentId: 'inc-101',
    createdAt: '2026-08-10T15:00:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-authority-1',
    title: 'CRITICAL ALERT: New Flood Incident Reported',
    message: 'INC-2026-000101 assigned to your department with Priority Score 94/100.',
    type: 'CRITICAL',
    read: true,
    incidentId: 'inc-101',
    createdAt: '2026-08-10T14:21:00Z'
  }
];
