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

export type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  venue?: string; // Optional venue name (e.g., "University Conference Center")
};

export type Event = {
  id: string;
  title: string;
  description: string;
  note?: string;
  image?: string;
  startDate: string;
  endDate: string;
  address: Address;
  source?: string;
  format: FormatName;
  disciplines: DisciplineName[];
  access: AccessName;
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
  dateRange?: DateRange;
  searchTerm: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}
