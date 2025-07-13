/**
 * Utility functions for timezone-aware date formatting
 */

export interface FormatDateOptions {
    includeTime?: boolean;
    includeTimezone?: boolean;
    dateStyle?: "short" | "medium" | "long" | "full";
    timeStyle?: "short" | "medium" | "long" | "full";
}

/**
 * Detect user's timezone using browser/device APIs
 * @returns IANA timezone name or "UTC" as fallback
 */
export function detectUserTimezone(): string {
    try {
        // Try to get timezone from Intl API (works on web and newer React Native versions)
        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        if (detectedTimezone && isValidTimezone(detectedTimezone)) {
            return detectedTimezone;
        }

        // Fallback to UTC if detection fails or timezone is invalid
        return "UTC";
    } catch (error) {
        console.warn("Failed to detect user timezone:", error);
        return "UTC";
    }
}

/**
 * Check if a timezone is valid IANA timezone
 * @param timezone - IANA timezone name to validate
 * @returns boolean indicating if timezone is valid
 */
export function isValidTimezone(timezone: string): boolean {
    try {
        // Test if the timezone is valid by trying to format a date with it
        const testDate = new Date();
        new Intl.DateTimeFormat("en-US", { timeZone: timezone }).format(testDate);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Get user's timezone with validation against supported timezones
 * @param supportedTimezones - Array of supported timezone values
 * @returns User's timezone if supported, otherwise "UTC"
 */
export function getUserTimezone(supportedTimezones: string[]): string {
    const userTimezone = detectUserTimezone();

    // Check if user's timezone is in the supported list
    if (supportedTimezones.includes(userTimezone)) {
        return userTimezone;
    }

    // If not supported, return UTC as fallback
    console.warn(`User timezone ${userTimezone} not in supported list, falling back to UTC`);
    return "UTC";
}

/**
 * Format a date string in a specific timezone for display
 * @param dateString - ISO date string
 * @param timezone - IANA timezone name (e.g., "America/New_York")
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDateInTimezone(
    dateString: string,
    timezone: string,
    options: FormatDateOptions = {}
): string {
    const {
        includeTime = true,
        includeTimezone = false,
        dateStyle = "medium",
        timeStyle = "short"
    } = options;

    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }

        const formatOptions: Intl.DateTimeFormatOptions = {
            timeZone: timezone,
        };

        // Set date formatting
        if (dateStyle === "short") {
            formatOptions.month = "short";
            formatOptions.day = "numeric";
            formatOptions.year = "numeric";
        } else if (dateStyle === "medium") {
            formatOptions.month = "short";
            formatOptions.day = "numeric";
            formatOptions.year = "numeric";
        } else if (dateStyle === "long") {
            formatOptions.month = "long";
            formatOptions.day = "numeric";
            formatOptions.year = "numeric";
        } else if (dateStyle === "full") {
            formatOptions.weekday = "long";
            formatOptions.month = "long";
            formatOptions.day = "numeric";
            formatOptions.year = "numeric";
        }

        // Set time formatting
        if (includeTime) {
            if (timeStyle === "short") {
                formatOptions.hour = "numeric";
                formatOptions.minute = "2-digit";
            } else if (timeStyle === "medium") {
                formatOptions.hour = "numeric";
                formatOptions.minute = "2-digit";
                formatOptions.second = "2-digit";
            } else if (timeStyle === "long" || timeStyle === "full") {
                formatOptions.hour = "numeric";
                formatOptions.minute = "2-digit";
                formatOptions.second = "2-digit";
                formatOptions.timeZoneName = timeStyle === "full" ? "long" : "short";
            }
        }

        // Include timezone name if requested
        if (includeTimezone && !formatOptions.timeZoneName) {
            formatOptions.timeZoneName = "short";
        }

        return new Intl.DateTimeFormat("en-US", formatOptions).format(date);
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid Date";
    }
}

/**
 * Format a date range in a specific timezone
 * @param startDate - Start date ISO string
 * @param endDate - End date ISO string
 * @param timezone - IANA timezone name
 * @returns Formatted date range string
 */
export function formatDateRangeInTimezone(
    startDate: string,
    endDate: string,
    timezone: string
): string {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return "Invalid Date Range";
        }

        // Check if both dates are on the same day
        const startFormatted = formatDateInTimezone(startDate, timezone, {
            includeTime: false,
            dateStyle: "short"
        });

        const endFormatted = formatDateInTimezone(endDate, timezone, {
            includeTime: false,
            dateStyle: "short"
        });

        const startTime = formatDateInTimezone(startDate, timezone, {
            includeTime: true,
            timeStyle: "short"
        }).split(" ").slice(-2).join(" "); // Get just the time part

        const endTime = formatDateInTimezone(endDate, timezone, {
            includeTime: true,
            timeStyle: "short"
        }).split(" ").slice(-2).join(" "); // Get just the time part

        if (startFormatted === endFormatted) {
            // Same day: "Dec 25, 2023 - 2:00 PM to 5:00 PM"
            return `${startFormatted} - ${startTime} to ${endTime}`;
        } else {
            // Different days: "Dec 25, 2023 2:00 PM to Dec 26, 2023 5:00 PM"
            return `${formatDateInTimezone(startDate, timezone)} to ${formatDateInTimezone(endDate, timezone)}`;
        }
    } catch (error) {
        console.error("Error formatting date range:", error);
        return "Invalid Date Range";
    }
}

/**
 * Convert and format event times from event timezone to user timezone
 * @param eventStartDate - Event start date ISO string
 * @param eventEndDate - Event end date ISO string
 * @param eventTimezone - Event's original timezone
 * @param userTimezone - User's timezone (defaults to detected timezone)
 * @returns Object with formatted times in user's timezone and event timezone info
 */
export function formatEventTimesForUser(
    eventStartDate: string,
    eventEndDate: string,
    eventTimezone: string,
    userTimezone?: string
): {
    userTimezone: string;
    eventTimezone: string;
    formattedDateRange: string;
    formattedStartDate: string;
    formattedStartTime: string;
    formattedEndTime: string;
    formattedEndDate: string;
    isSameDay: boolean;
} {
    const detectedUserTimezone = userTimezone || detectUserTimezone();

    try {
        const startDate = new Date(eventStartDate);
        const endDate = new Date(eventEndDate);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error("Invalid dates");
        }

        // Format dates in user's timezone
        const formattedStartDate = formatDateInTimezone(eventStartDate, detectedUserTimezone, {
            includeTime: false,
            dateStyle: "full"
        });

        const formattedEndDate = formatDateInTimezone(eventEndDate, detectedUserTimezone, {
            includeTime: false,
            dateStyle: "full"
        });

        const formattedStartTime = formatDateInTimezone(eventStartDate, detectedUserTimezone, {
            includeTime: true,
            timeStyle: "short"
        }).split(" ").slice(-2).join(" "); // Get just the time part

        const formattedEndTime = formatDateInTimezone(eventEndDate, detectedUserTimezone, {
            includeTime: true,
            timeStyle: "short"
        }).split(" ").slice(-2).join(" "); // Get just the time part

        // Check if same day in user's timezone
        const startDateOnly = formatDateInTimezone(eventStartDate, detectedUserTimezone, {
            includeTime: false,
            dateStyle: "short"
        });
        const endDateOnly = formatDateInTimezone(eventEndDate, detectedUserTimezone, {
            includeTime: false,
            dateStyle: "short"
        });
        const isSameDay = startDateOnly === endDateOnly;

        // Format date range in user's timezone
        const formattedDateRange = formatDateRangeInTimezone(eventStartDate, eventEndDate, detectedUserTimezone);

        return {
            userTimezone: detectedUserTimezone,
            eventTimezone,
            formattedDateRange,
            formattedStartDate,
            formattedStartTime,
            formattedEndTime,
            formattedEndDate,
            isSameDay
        };
    } catch (error) {
        console.error("Error formatting event times for user:", error);
        return {
            userTimezone: detectedUserTimezone,
            eventTimezone,
            formattedDateRange: "Invalid Date Range",
            formattedStartDate: "Invalid Date",
            formattedStartTime: "Invalid Time",
            formattedEndTime: "Invalid Time",
            formattedEndDate: "Invalid Date",
            isSameDay: false
        };
    }
}

/**
 * Get timezone display name from IANA timezone name
 * @param timezone - IANA timezone name
 * @returns Human-readable timezone name
 */
export function getTimezoneDisplayName(timezone: string): string {
    try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            timeZoneName: "long"
        });

        const parts = formatter.formatToParts(now);
        const timeZonePart = parts.find(part => part.type === "timeZoneName");

        return timeZonePart?.value || timezone;
    } catch (error) {
        console.error("Error getting timezone display name:", error);
        return timezone;
    }
} 