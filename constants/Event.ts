import type { DisciplineName, EventType, FormatName, LanguageName, VideoConferencePlatform } from "@/types";
import { AccessName } from "@/types";

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

// Common timezones with user-friendly display names
export const COMMON_TIMEZONES = [
    // UTC
    { value: "UTC", label: "(GMT+00:00) Coordinated Universal Time" },

    // Americas - North America
    { value: "America/New_York", label: "(GMT-05:00) Eastern Time (New York)" },
    { value: "America/Chicago", label: "(GMT-06:00) Central Time (Chicago)" },
    { value: "America/Denver", label: "(GMT-07:00) Mountain Time (Denver)" },
    { value: "America/Los_Angeles", label: "(GMT-08:00) Pacific Time (Los Angeles)" },
    { value: "America/Anchorage", label: "(GMT-09:00) Alaska Time (Anchorage)" },
    { value: "Pacific/Honolulu", label: "(GMT-10:00) Hawaii Time (Honolulu)" },

    // Americas - Canada
    { value: "America/Toronto", label: "(GMT-05:00) Eastern Time (Toronto)" },
    { value: "America/Winnipeg", label: "(GMT-06:00) Central Time (Winnipeg)" },
    { value: "America/Edmonton", label: "(GMT-07:00) Mountain Time (Edmonton)" },
    { value: "America/Vancouver", label: "(GMT-08:00) Pacific Time (Vancouver)" },
    { value: "America/Halifax", label: "(GMT-04:00) Atlantic Time (Halifax)" },
    { value: "America/St_Johns", label: "(GMT-03:30) Newfoundland Time (St. John's)" },

    // Americas - Mexico & Central America
    { value: "America/Mexico_City", label: "(GMT-06:00) Central Time (Mexico City)" },
    { value: "America/Cancun", label: "(GMT-05:00) Eastern Time (Cancun)" },
    { value: "America/Guatemala", label: "(GMT-06:00) Central Time (Guatemala)" },
    { value: "America/Costa_Rica", label: "(GMT-06:00) Central Time (Costa Rica)" },

    // Americas - South America
    { value: "America/Sao_Paulo", label: "(GMT-03:00) Brazil Time (São Paulo)" },
    { value: "America/Argentina/Buenos_Aires", label: "(GMT-03:00) Argentina Time (Buenos Aires)" },
    { value: "America/Santiago", label: "(GMT-03:00) Chile Time (Santiago)" },
    { value: "America/Lima", label: "(GMT-05:00) Peru Time (Lima)" },
    { value: "America/Bogota", label: "(GMT-05:00) Colombia Time (Bogotá)" },
    { value: "America/Caracas", label: "(GMT-04:00) Venezuela Time (Caracas)" },

    // Europe - Western
    { value: "Europe/London", label: "(GMT+00:00) Greenwich Mean Time (London)" },
    { value: "Europe/Dublin", label: "(GMT+00:00) Ireland Time (Dublin)" },
    { value: "Europe/Lisbon", label: "(GMT+00:00) Western European Time (Lisbon)" },
    { value: "Atlantic/Reykjavik", label: "(GMT+00:00) Greenwich Mean Time (Reykjavik)" },

    // Europe - Central
    { value: "Europe/Paris", label: "(GMT+01:00) Central European Time (Paris)" },
    { value: "Europe/Berlin", label: "(GMT+01:00) Central European Time (Berlin)" },
    { value: "Europe/Rome", label: "(GMT+01:00) Central European Time (Rome)" },
    { value: "Europe/Madrid", label: "(GMT+01:00) Central European Time (Madrid)" },
    { value: "Europe/Amsterdam", label: "(GMT+01:00) Central European Time (Amsterdam)" },
    { value: "Europe/Brussels", label: "(GMT+01:00) Central European Time (Brussels)" },
    { value: "Europe/Vienna", label: "(GMT+01:00) Central European Time (Vienna)" },
    { value: "Europe/Zurich", label: "(GMT+01:00) Central European Time (Zurich)" },
    { value: "Europe/Prague", label: "(GMT+01:00) Central European Time (Prague)" },
    { value: "Europe/Budapest", label: "(GMT+01:00) Central European Time (Budapest)" },
    { value: "Europe/Warsaw", label: "(GMT+01:00) Central European Time (Warsaw)" },
    { value: "Europe/Stockholm", label: "(GMT+01:00) Central European Time (Stockholm)" },
    { value: "Europe/Oslo", label: "(GMT+01:00) Central European Time (Oslo)" },
    { value: "Europe/Copenhagen", label: "(GMT+01:00) Central European Time (Copenhagen)" },

    // Europe - Eastern
    { value: "Europe/Athens", label: "(GMT+02:00) Eastern European Time (Athens)" },
    { value: "Europe/Helsinki", label: "(GMT+02:00) Eastern European Time (Helsinki)" },
    { value: "Europe/Bucharest", label: "(GMT+02:00) Eastern European Time (Bucharest)" },
    { value: "Europe/Kiev", label: "(GMT+02:00) Eastern European Time (Kiev)" },
    { value: "Europe/Riga", label: "(GMT+02:00) Eastern European Time (Riga)" },
    { value: "Europe/Tallinn", label: "(GMT+02:00) Eastern European Time (Tallinn)" },
    { value: "Europe/Vilnius", label: "(GMT+02:00) Eastern European Time (Vilnius)" },
    { value: "Europe/Sofia", label: "(GMT+02:00) Eastern European Time (Sofia)" },

    // Europe - Other
    { value: "Europe/Moscow", label: "(GMT+03:00) Moscow Time (Moscow)" },
    { value: "Europe/Istanbul", label: "(GMT+03:00) Turkey Time (Istanbul)" },

    // Africa
    { value: "Africa/Cairo", label: "(GMT+02:00) Eastern European Time (Cairo)" },
    { value: "Africa/Johannesburg", label: "(GMT+02:00) South Africa Time (Johannesburg)" },
    { value: "Africa/Lagos", label: "(GMT+01:00) West Africa Time (Lagos)" },
    { value: "Africa/Nairobi", label: "(GMT+03:00) East Africa Time (Nairobi)" },
    { value: "Africa/Casablanca", label: "(GMT+01:00) Morocco Time (Casablanca)" },

    // Asia - Middle East
    { value: "Asia/Jerusalem", label: "(GMT+02:00) Israel Time (Jerusalem)" },
    { value: "Asia/Dubai", label: "(GMT+04:00) Gulf Time (Dubai)" },
    { value: "Asia/Riyadh", label: "(GMT+03:00) Arabia Time (Riyadh)" },
    { value: "Asia/Tehran", label: "(GMT+03:30) Iran Time (Tehran)" },
    { value: "Asia/Baghdad", label: "(GMT+03:00) Arabia Time (Baghdad)" },

    // Asia - South & Southeast
    { value: "Asia/Kolkata", label: "(GMT+05:30) India Time (Kolkata)" },
    { value: "Asia/Karachi", label: "(GMT+05:00) Pakistan Time (Karachi)" },
    { value: "Asia/Dhaka", label: "(GMT+06:00) Bangladesh Time (Dhaka)" },
    { value: "Asia/Bangkok", label: "(GMT+07:00) Indochina Time (Bangkok)" },
    { value: "Asia/Jakarta", label: "(GMT+07:00) Western Indonesia Time (Jakarta)" },
    { value: "Asia/Manila", label: "(GMT+08:00) Philippines Time (Manila)" },
    { value: "Asia/Singapore", label: "(GMT+08:00) Singapore Time (Singapore)" },
    { value: "Asia/Kuala_Lumpur", label: "(GMT+08:00) Malaysia Time (Kuala Lumpur)" },
    { value: "Asia/Ho_Chi_Minh", label: "(GMT+07:00) Indochina Time (Ho Chi Minh City)" },

    // Asia - East
    { value: "Asia/Hong_Kong", label: "(GMT+08:00) Hong Kong Time (Hong Kong)" },
    { value: "Asia/Shanghai", label: "(GMT+08:00) China Time (Shanghai)" },
    { value: "Asia/Tokyo", label: "(GMT+09:00) Japan Time (Tokyo)" },
    { value: "Asia/Seoul", label: "(GMT+09:00) Korea Time (Seoul)" },
    { value: "Asia/Taipei", label: "(GMT+08:00) Taiwan Time (Taipei)" },

    // Asia - North & Central
    { value: "Asia/Almaty", label: "(GMT+06:00) East Kazakhstan Time (Almaty)" },
    { value: "Asia/Tashkent", label: "(GMT+05:00) Uzbekistan Time (Tashkent)" },
    { value: "Asia/Yekaterinburg", label: "(GMT+05:00) Yekaterinburg Time (Yekaterinburg)" },
    { value: "Asia/Novosibirsk", label: "(GMT+07:00) Novosibirsk Time (Novosibirsk)" },
    { value: "Asia/Vladivostok", label: "(GMT+10:00) Vladivostok Time (Vladivostok)" },

    // Australia & Oceania
    { value: "Australia/Sydney", label: "(GMT+10:00) Eastern Australia Time (Sydney)" },
    { value: "Australia/Melbourne", label: "(GMT+10:00) Eastern Australia Time (Melbourne)" },
    { value: "Australia/Brisbane", label: "(GMT+10:00) Eastern Australia Time (Brisbane)" },
    { value: "Australia/Perth", label: "(GMT+08:00) Western Australia Time (Perth)" },
    { value: "Australia/Adelaide", label: "(GMT+09:30) Central Australia Time (Adelaide)" },
    { value: "Australia/Darwin", label: "(GMT+09:30) Central Australia Time (Darwin)" },
    { value: "Pacific/Auckland", label: "(GMT+12:00) New Zealand Time (Auckland)" },
    { value: "Pacific/Fiji", label: "(GMT+12:00) Fiji Time (Fiji)" },
];

// Default timezone for events (fallback to UTC)
export const DEFAULT_TIMEZONE = "UTC";

// Languages available for events
export const EVENT_LANGUAGES: LanguageName[] = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Russian",
    "Chinese (Mandarin)",
    "Chinese (Cantonese)",
    "Japanese",
    "Korean",
    "Arabic",
    "Hindi",
    "Bengali",
    "Dutch",
    "Swedish",
    "Norwegian",
    "Danish",
    "Finnish",
    "Polish",
    "Czech",
    "Hungarian",
    "Greek",
    "Hebrew",
    "Turkish",
    "Persian (Farsi)",
    "Urdu",
    "Tamil",
    "Telugu",
    "Marathi",
    "Gujarati",
    "Punjabi",
    "Thai",
    "Vietnamese",
    "Indonesian",
    "Malay",
    "Tagalog",
    "Swahili",
    "Amharic",
    "Yoruba",
    "Hausa",
    "Igbo",
    "Zulu",
    "Afrikaans",
    "Romanian",
    "Bulgarian",
    "Serbian",
    "Croatian",
    "Bosnian",
    "Slovenian",
    "Slovak",
    "Lithuanian",
    "Latvian",
    "Estonian",
    "Ukrainian",
    "Belarusian",
    "Georgian",
    "Armenian",
    "Azerbaijani",
    "Kazakh",
    "Uzbek",
    "Kyrgyz",
    "Tajik",
    "Turkmen",
    "Mongolian",
    "Tibetan",
    "Burmese",
    "Khmer",
    "Lao",
    "Sinhala",
    "Nepali",
    "Pashto",
    "Dari",
    "Kurdish",
    "Maltese",
    "Basque",
    "Catalan",
    "Galician",
    "Welsh",
    "Irish",
    "Scottish Gaelic",
    "Breton",
    "Luxembourgish",
    "Frisian",
    "Icelandic",
    "Faroese",
    "Albanian",
    "Macedonian",
    "Montenegrin",
    "Esperanto",
    "Latin",
    "Sanskrit",
    "Other"
]; 