export type FormatName =
  | "Lecture"
  | "Conference"
  | "Seminar"
  | "Colloquium"
  | "Symposium"
  | "Panel"
  | "Roundtable"
  | "Workshop"
  | "Webinar"
  | "Discussion"
  | "Debate"
  | "Book Talk"
  | "Poster Session"
  | "Networking Event"
  | "Training Session"
  | "Keynote"
  | "Town Hall"
  | "Fireside Chat";

export type Format = {
  id: string;
  name: FormatName;
};

export type DisciplineName =
  | "Political Science"
  | "Economics"
  | "History"
  | "Sociology"
  | "Anthropology"
  | "Psychology"
  | "Human Geography"
  | "Linguistics"
  | "Archaeology"
  | "Law"
  | "Education"
  | "Communication Studies"
  | "Development Studies"
  | "International Relations"
  | "Criminology"
  | "Demography"
  | "Social Work"
  | "Cultural Studies"
  | "Philosophy";

export type Discipline = {
  id: string;
  name: DisciplineName;
};

export type AccessName = "Public" | "Private" | "Invitation Only";

export type Access = {
  id: string;
  name: AccessName;
};

export type LanguageName =
  | "English"
  | "Spanish"
  | "French"
  | "German"
  | "Italian"
  | "Portuguese"
  | "Russian"
  | "Chinese (Mandarin)"
  | "Chinese (Cantonese)"
  | "Japanese"
  | "Korean"
  | "Arabic"
  | "Hindi"
  | "Bengali"
  | "Dutch"
  | "Swedish"
  | "Norwegian"
  | "Danish"
  | "Finnish"
  | "Polish"
  | "Czech"
  | "Hungarian"
  | "Greek"
  | "Hebrew"
  | "Turkish"
  | "Persian (Farsi)"
  | "Urdu"
  | "Tamil"
  | "Telugu"
  | "Marathi"
  | "Gujarati"
  | "Punjabi"
  | "Thai"
  | "Vietnamese"
  | "Indonesian"
  | "Malay"
  | "Tagalog"
  | "Swahili"
  | "Amharic"
  | "Yoruba"
  | "Hausa"
  | "Igbo"
  | "Zulu"
  | "Afrikaans"
  | "Romanian"
  | "Bulgarian"
  | "Serbian"
  | "Croatian"
  | "Bosnian"
  | "Slovenian"
  | "Slovak"
  | "Lithuanian"
  | "Latvian"
  | "Estonian"
  | "Ukrainian"
  | "Belarusian"
  | "Georgian"
  | "Armenian"
  | "Azerbaijani"
  | "Kazakh"
  | "Uzbek"
  | "Kyrgyz"
  | "Tajik"
  | "Turkmen"
  | "Mongolian"
  | "Tibetan"
  | "Burmese"
  | "Khmer"
  | "Lao"
  | "Sinhala"
  | "Nepali"
  | "Pashto"
  | "Dari"
  | "Kurdish"
  | "Maltese"
  | "Basque"
  | "Catalan"
  | "Galician"
  | "Welsh"
  | "Irish"
  | "Scottish Gaelic"
  | "Breton"
  | "Luxembourgish"
  | "Frisian"
  | "Icelandic"
  | "Faroese"
  | "Albanian"
  | "Macedonian"
  | "Montenegrin"
  | "Esperanto"
  | "Latin"
  | "Sanskrit"
  | "Other";

export type Language = {
  id: string;
  name: LanguageName;
};

export type EventType = "In-Person" | "Online" | "Hybrid";

export type VideoConferencePlatform = "Zoom" | "Teams" | "Google Meet" | "WebEx" | "GoToMeeting" | "Other";

export type VideoConference = {
  platform: VideoConferencePlatform;
  link: string;
  meetingId?: string;
  passcode?: string;
  instructions?: string;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  venue?: string; // Optional venue name (e.g., "University Conference Center")
  parkingAvailable?: string; // "Yes", "No", or "Limited"
  parkingDetails?: string; // Description of parking options
  parkingInstructions?: string; // Instructions for parking
  parkingCost?: string; // Cost information for parking
};

export type TicketTier = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  note?: string;
  image?: string;
  startDate: string;
  endDate: string;
  timezone: string; // IANA timezone name like "America/New_York"
  eventType: EventType;
  address?: Address; // Optional for online events
  videoConference?: VideoConference; // Optional for in-person events
  source?: string;
  format: FormatName;
  disciplines: DisciplineName[];
  languages: LanguageName[]; // Languages supported by the event
  access: AccessName;
  ticketTiers?: TicketTier[];
  organizerId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SortBy = 'startDate' | 'title' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export type DateRange = 'today' | 'tomorrow' | 'thisWeek' | 'thisWeekend' | 'thisMonth' | 'future';

export interface EventFilters {
  format?: FormatName;
  disciplines: DisciplineName[];
  languages: LanguageName[]; // Languages filter
  access?: AccessName;
  eventType?: EventType;
  dateRange?: DateRange;
  searchTerm: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}
