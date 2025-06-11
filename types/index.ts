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

export type Event = {
  id: string;
  title: string;
  description: string;
  note?: string;
  image?: string;
  startDate: string;
  endDate: string;
  location: string;
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

export interface EventFilters {
  format: FormatName | null;
  disciplines: DisciplineName[];
  access: AccessName | null;
  searchTerm: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}
