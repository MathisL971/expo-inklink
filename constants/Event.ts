import type { DisciplineName, EventType, FormatName, LanguageName, VideoConferencePlatform } from "@/types";
import { AccessName, AccessibilityFeature } from "@/types";


// Event formats available for selection
export const EVENT_FORMATS: FormatName[] = [
    "Lecture",
    "Conference",
    "Seminar",
    "Colloquium",
    "Symposium",
    "Panel",
    "Roundtable",
    "Workshop",
    "Webinar",
    "Discussion",
    "Debate",
    "Book Talk",
    "Poster Session",
    "Networking Event",
    "Training Session",
    "Keynote",
    "Town Hall",
    "Fireside Chat",
];

// Academic disciplines available for selection
export const EVENT_DISCIPLINES: DisciplineName[] = [
    "Political Science",
    "Economics",
    "History",
    "Sociology",
    "Anthropology",
    "Psychology",
    "Human Geography",
    "Linguistics",
    "Archaeology",
    "Law",
    "Education",
    "Communication Studies",
    "Development Studies",
    "International Relations",
    "Criminology",
    "Demography",
    "Social Work",
    "Cultural Studies",
    "Philosophy",
];

// Access levels available for events
export const EVENT_ACCESS_LEVELS: AccessName[] = [
    "Public",
    "Private",
    "Invitation Only"
];

// Event types available for selection
export const EVENT_TYPES: EventType[] = [
    "In-Person",
    "Online",
    "Hybrid"
];

// Video conference platforms available for selection
export const VIDEO_CONFERENCE_PLATFORMS: VideoConferencePlatform[] = [
    "Zoom",
    "Teams",
    "Google Meet",
    "WebEx",
    "GoToMeeting",
    "Other"
];

// Common timezones for filtering
export const COMMON_TIMEZONES = [
    { value: "America/New_York", label: "EST - Eastern Standard Time" },
    { value: "America/Chicago", label: "CST - Central Standard Time" },
    { value: "America/Denver", label: "MST - Mountain Standard Time" },
    { value: "America/Los_Angeles", label: "PST - Pacific Standard Time" },
    { value: "Europe/London", label: "GMT - Greenwich Mean Time" },
    { value: "Europe/Paris", label: "CET - Central European Time" },
    { value: "Europe/Berlin", label: "CET - Central European Time" },
    { value: "Asia/Tokyo", label: "JST - Japan Standard Time" },
    { value: "Asia/Shanghai", label: "CST - China Standard Time" },
    { value: "Australia/Sydney", label: "AEDT - Australian Eastern Daylight Time" },
    { value: "America/Toronto", label: "EST - Eastern Standard Time" },
    { value: "America/Vancouver", label: "PST - Pacific Standard Time" },
    { value: "Europe/Rome", label: "CET - Central European Time" },
    { value: "Europe/Madrid", label: "CET - Central European Time" },
    { value: "Asia/Seoul", label: "KST - Korea Standard Time" },
    { value: "Asia/Mumbai", label: "IST - India Standard Time" },
    { value: "Asia/Singapore", label: "SGT - Singapore Standard Time" },
    { value: "Pacific/Auckland", label: "NZDT - New Zealand Daylight Time" },
    { value: "America/Sao_Paulo", label: "BRT - Brasilia Time" },
    { value: "UTC", label: "UTC - Coordinated Universal Time" }
];

// Default timezone for events (fallback to UTC)
export const DEFAULT_TIMEZONE = "UTC";

// Common countries for filtering
export const COMMON_COUNTRIES = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Belgium",
    "Switzerland",
    "Austria",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Poland",
    "Czech Republic",
    "Hungary",
    "Portugal",
    "Greece",
    "Ireland",
    "Luxembourg",
    "Iceland",
    "Estonia",
    "Latvia",
    "Lithuania",
    "Slovenia",
    "Slovakia",
    "Croatia",
    "Bulgaria",
    "Romania",
    "Cyprus",
    "Malta",
    "Australia",
    "New Zealand",
    "Japan",
    "South Korea",
    "China",
    "India",
    "Singapore",
    "Hong Kong",
    "Taiwan",
    "Malaysia",
    "Thailand",
    "Indonesia",
    "Philippines",
    "Vietnam",
    "Brazil",
    "Argentina",
    "Chile",
    "Colombia",
    "Mexico",
    "Peru",
    "Venezuela",
    "Ecuador",
    "Uruguay",
    "Paraguay",
    "Bolivia",
    "South Africa",
    "Nigeria",
    "Kenya",
    "Ghana",
    "Egypt",
    "Morocco",
    "Tunisia",
    "Algeria",
    "Israel",
    "Turkey",
    "United Arab Emirates",
    "Saudi Arabia",
    "Jordan",
    "Lebanon",
    "Iran",
    "Iraq",
    "Pakistan",
    "Bangladesh",
    "Sri Lanka",
    "Nepal",
    "Afghanistan",
    "Kazakhstan",
    "Uzbekistan",
    "Kyrgyzstan",
    "Tajikistan",
    "Turkmenistan",
    "Russia",
    "Ukraine",
    "Belarus",
    "Moldova",
    "Georgia",
    "Armenia",
    "Azerbaijan",
    "Other"
];

// Languages available for events
export const EVENT_LANGUAGES: LanguageName[] = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese (Mandarin)",
    "Arabic",
    "Russian",
    "Portuguese",
    "Japanese",
    "Italian",
    "Dutch",
    "Other"
];

// Duration categories for filtering
export const EVENT_DURATIONS = [
    "Short (< 1 hour)",
    "Medium (1-3 hours)",
    "Long (3-4 hours)",
    "Half Day (4-6 hours)",
    "Full Day (6-24 hours)",
    "Multi-Day"
];

// Time of day categories for filtering
export const TIME_OF_DAY_OPTIONS = [
    "Morning (6 AM - 12 PM)",
    "Afternoon (12 PM - 6 PM)",
    "Evening (6 PM - 10 PM)",
    "Night (10 PM - 6 AM)"
];

// Accessibility features for filtering
export const ACCESSIBILITY_FEATURES = [
    "Wheelchair Accessible",
    "Hearing Assistance (ASL/Interpreters)",
    "Visual Assistance (Large Print/Braille)",
    "Audio Description Available",
    "Closed Captions Available",
    "Sensory-Friendly Environment",
    "Accessible Parking",
    "Accessible Restrooms",
    "Mobility Aid Friendly",
    "Service Animals Welcome"
] as AccessibilityFeature[];

