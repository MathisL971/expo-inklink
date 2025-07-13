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
  eventType: EventType;
  address?: Address; // Optional for online events
  videoConference?: VideoConference; // Optional for in-person events
  source?: string;
  format: FormatName;
  disciplines: DisciplineName[];
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
  access?: AccessName;
  eventType?: EventType;
  dateRange?: DateRange;
  searchTerm: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}
