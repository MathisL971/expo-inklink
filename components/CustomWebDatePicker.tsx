import {
  ChevronLeft,
  ChevronRight,
  Clock,
  LucideIcon
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../constants/Styles";
import { ThemedButton } from "./ThemedButton";

// --- CONSTANTS ---
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEK_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CALENDAR_GRID_SIZE = 42;

export type CustomDateTimePickerProps = {
  label: string;
  value: string;
  onBlur: () => void;
  onChangeText: (value: string) => void;
  placeholder: string;
  error?: string;
  Icon?: LucideIcon;
  colors: any;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
};

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

// --- COMPONENT ---
export default function CustomDateTimePicker({
  value,
  onBlur,
  onChangeText,
  label,
  placeholder,
  error,
  colors,
  Icon = Clock,
  dateFormat = "DD/MM/YYYY HH:mm",
  minDate,
  maxDate,
}: CustomDateTimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(new Date());
  const [hourInput, setHourInput] = useState<string>("00");
  const [minuteInput, setMinuteInput] = useState<string>("00");

  // Helper function to safely parse the value
  const parseValue = useCallback((val: string): Date => {
    if (!val || val.trim() === "") {
      return new Date();
    }

    // Try parsing as ISO string first (what React Hook Form typically uses)
    const isoDate = new Date(val);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }

    // Fallback to custom parsing
    const parsed = parseDateTime(val);
    return parsed || new Date();
  }, []);

  // Sync internal state with prop value changes
  useEffect(() => {
    const parsedDate = parseValue(value);
    setSelectedDateTime(parsedDate);
    setCurrentMonth(
      new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1)
    );
  }, [value, parseValue]);

  // Sync hour/minute input fields when modal opens or selectedDateTime changes
  useEffect(() => {
    if (showPicker) {
      setHourInput(selectedDateTime.getHours().toString().padStart(2, "0"));
      setMinuteInput(selectedDateTime.getMinutes().toString().padStart(2, "0"));
    }
  }, [showPicker, selectedDateTime]);

  const parseDateTime = useCallback(
    (dateTimeString: string): Date | null => {
      if (!dateTimeString || dateTimeString.trim() === "") return null;

      const parts = dateTimeString.split(" ");
      const datePart = parts[0];
      const timePart = parts.length > 1 ? parts[1] : "00:00";

      if (!datePart) return null;

      const dateParts = datePart.split(/[-/]/);
      if (dateParts.length !== 3) return null;

      let year, month, day;

      if (dateFormat.startsWith("YYYY")) {
        [year, month, day] = dateParts.map((p) => parseInt(p, 10));
      } else if (dateFormat.startsWith("DD")) {
        [day, month, year] = dateParts.map((p) => parseInt(p, 10));
      } else {
        // MM/DD/YYYY
        [month, day, year] = dateParts.map((p) => parseInt(p, 10));
      }

      const timeParts = timePart.split(":");
      const hours = timeParts[0] ? parseInt(timeParts[0], 10) : 0;
      const minutes = timeParts[1] ? parseInt(timeParts[1], 10) : 0;

      if (
        isNaN(year) ||
        isNaN(month) ||
        isNaN(day) ||
        isNaN(hours) ||
        isNaN(minutes)
      ) {
        return null;
      }

      // Month is 0-indexed in JS Date
      const date = new Date(year, month - 1, day, hours, minutes);

      // Validation
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day ||
        date.getHours() !== hours ||
        date.getMinutes() !== minutes
      ) {
        return null;
      }

      return date;
    },
    [dateFormat]
  );

  const formatDateTime = useCallback(
    (date: Date): string => {
      if (!date || isNaN(date.getTime())) {
        return "";
      }

      const d = date.getDate().toString().padStart(2, "0");
      const m = (date.getMonth() + 1).toString().padStart(2, "0");
      const y = date.getFullYear().toString();
      const h = date.getHours().toString().padStart(2, "0");
      const min = date.getMinutes().toString().padStart(2, "0");

      return dateFormat
        .replace("DD", d)
        .replace("MM", m)
        .replace("YYYY", y)
        .replace("HH", h)
        .replace("mm", min);
    },
    [dateFormat]
  );

  // Format for display (using custom format)
  const displayValue = useMemo(() => {
    if (!value || value.trim() === "") return "";
    const parsedDate = parseValue(value);
    return formatDateTime(parsedDate);
  }, [value, parseValue, formatDateTime]);

  // Initialize internal state when picker opens
  const handleOpenPicker = useCallback(() => {
    const initialDate = parseValue(value);
    setSelectedDateTime(initialDate);
    setCurrentMonth(
      new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
    );
    setShowPicker(true);
  }, [value, parseValue]);

  const calendarDays = useMemo((): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < CALENDAR_GRID_SIZE; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + i);
      const minD = minDate
        ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
        : null;
      const maxD = maxDate
        ? new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())
        : null;
      const isDisabled = (minD && dayDate < minD) || (maxD && dayDate > maxD);

      days.push({
        date: dayDate,
        isCurrentMonth: dayDate.getMonth() === currentMonth.getMonth(),
        isToday: dayDate.toDateString() === today.toDateString(),
        isSelected: dayDate.toDateString() === selectedDateTime.toDateString(),
        isDisabled: !!isDisabled,
      });
    }
    return days;
  }, [currentMonth, selectedDateTime, minDate, maxDate]);

  const handleClose = useCallback(() => {
    setShowPicker(false);
    onBlur();
  }, [onBlur]);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDateTime((current) => {
      const newDate = new Date(current);
      newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      return newDate;
    });
  }, []);

  const handleChangeTime = useCallback(
    (unit: "hour" | "minute", amount: number) => {
      setSelectedDateTime((current) => {
        const newDate = new Date(current);
        if (unit === "hour") {
          let newHour = newDate.getHours() + amount;
          // Handle hour overflow/underflow
          if (newHour < 0) newHour = 23;
          if (newHour > 23) newHour = 0;
          newDate.setHours(newHour);
        } else {
          let newMinute = newDate.getMinutes() + amount;
          // Handle minute overflow/underflow
          if (newMinute < 0) {
            newMinute = 59;
            newDate.setHours(newDate.getHours() - 1);
          }
          if (newMinute > 59) {
            newMinute = 0;
            newDate.setHours(newDate.getHours() + 1);
          }
          newDate.setMinutes(newMinute);
        }
        return newDate;
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    // Clamp and commit hour/minute before confirming
    let hour = parseInt(hourInput, 10);
    if (isNaN(hour)) hour = 0;
    if (hour > 23) hour = 23;
    if (hour < 0) hour = 0;
    let minute = parseInt(minuteInput, 10);
    if (isNaN(minute)) minute = 0;
    if (minute > 59) minute = 59;
    if (minute < 0) minute = 0;
    setSelectedDateTime((current) => {
      const newDate = new Date(current);
      newDate.setHours(hour);
      newDate.setMinutes(minute);
      return newDate;
    });
    // Return ISO string for React Hook Form compatibility
    const isoString = new Date(selectedDateTime.setHours(hour, minute)).toISOString();
    onChangeText(isoString);
    handleClose();
  }, [selectedDateTime, onChangeText, handleClose, hourInput, minuteInput]);

  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + (direction === "next" ? 1 : -1));
      return newMonth;
    });
  }, []);

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <Pressable onPress={handleOpenPicker}>
        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: colors.inputBackground,
              borderColor: error ? colors.inputBorderError : colors.inputBorder,
            },
          ]}
        >
          <View style={{ flex: 1, pointerEvents: "none" }}>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              value={displayValue}
              placeholder={placeholder}
              placeholderTextColor={colors.inputPlaceholder}
              editable={false}
            />
          </View>
          <Icon
            size={20}
            color={colors.textSecondary}
            style={{ marginLeft: 8 }}
          />
        </View>
      </Pressable>
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}

      {showPicker && (
        <Modal
          visible={showPicker}
          transparent
          animationType="fade"
          onRequestClose={handleClose}
        >
          <Pressable
            style={[
              styles.modalOverlay,
              {
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
            ]}
            onPress={handleClose}
          >
            <Pressable
              style={[
                styles.card,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  width: 320,
                },
              ]}
              onPress={(e) => e.stopPropagation()}
            >
              <View
                style={[
                  styles.modalHeader,
                  { borderBottomColor: colors.borderColor, padding: 12 },
                ]}
              >
                <TouchableOpacity onPress={() => navigateMonth("prev")}>
                  <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {MONTH_NAMES[currentMonth.getMonth()]}{" "}
                  {currentMonth.getFullYear()}
                </Text>
                <TouchableOpacity onPress={() => navigateMonth("next")}>
                  <ChevronRight size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={{ paddingHorizontal: 8, paddingTop: 8 }}>
                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                  {WEEK_DAY_NAMES.map((day) => (
                    <View key={day} style={{ flex: 1, alignItems: "center" }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "bold",
                          color: colors.textSecondary,
                        }}
                      >
                        {day}
                      </Text>
                    </View>
                  ))}
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {calendarDays.map((dayObj) => (
                    <TouchableOpacity
                      key={dayObj.date.toISOString()}
                      style={{
                        width: `${100 / 7}%`,
                        aspectRatio: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: dayObj.isSelected
                          ? colors.primary
                          : "transparent",
                        borderRadius: 20,
                        opacity: dayObj.isDisabled ? 0.4 : 1,
                      }}
                      disabled={dayObj.isDisabled}
                      onPress={() => handleDateSelect(dayObj.date)}
                    >
                      <Text
                        style={{
                          color: dayObj.isSelected
                            ? colors.primaryText
                            : dayObj.isCurrentMonth
                              ? colors.text
                              : colors.textSecondary,
                          fontWeight: dayObj.isToday ? "bold" : "normal",
                        }}
                      >
                        {dayObj.date.getDate()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: colors.borderColor,
                  marginTop: 8,
                  paddingTop: 12,
                  paddingHorizontal: 16,
                }}
              >
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                      textAlign: "center",
                      marginBottom: 12,
                    },
                  ]}
                >
                  Time
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        color: colors.text,
                        fontSize: 24,
                        fontWeight: "bold",
                        textAlign: "center",
                        marginHorizontal: 10,
                        width: 40,
                        borderWidth: 1,
                        borderColor: colors.inputBorder,
                        borderRadius: 8,
                        backgroundColor: colors.inputBackground,
                      },
                    ]}
                    keyboardType="number-pad"
                    maxLength={2}
                    value={hourInput}
                    onChangeText={(text) => {
                      // Allow only digits, max 2 chars
                      const clean = text.replace(/\D/g, "").slice(0, 2);
                      setHourInput(clean);
                    }}
                    onBlur={() => {
                      let hour = parseInt(hourInput, 10);
                      if (isNaN(hour)) hour = 0;
                      if (hour > 23) hour = 23;
                      if (hour < 0) hour = 0;
                      setHourInput(hour.toString().padStart(2, "0"));
                      setSelectedDateTime((current) => {
                        const newDate = new Date(current);
                        newDate.setHours(hour);
                        return newDate;
                      });
                    }}
                  />
                  <Text
                    style={[
                      styles.textInput,
                      {
                        color: colors.text,
                        fontSize: 24,
                        fontWeight: "bold",
                        textAlign: "center",
                      },
                    ]}
                  >
                    :
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        color: colors.text,
                        fontSize: 24,
                        fontWeight: "bold",
                        textAlign: "center",
                        marginHorizontal: 10,
                        width: 40,
                        borderWidth: 1,
                        borderColor: colors.inputBorder,
                        borderRadius: 8,
                        backgroundColor: colors.inputBackground,
                      },
                    ]}
                    keyboardType="number-pad"
                    maxLength={2}
                    value={minuteInput}
                    onChangeText={(text) => {
                      const clean = text.replace(/\D/g, "").slice(0, 2);
                      setMinuteInput(clean);
                    }}
                    onBlur={() => {
                      let minute = parseInt(minuteInput, 10);
                      if (isNaN(minute)) minute = 0;
                      if (minute > 59) minute = 59;
                      if (minute < 0) minute = 0;
                      setMinuteInput(minute.toString().padStart(2, "0"));
                      setSelectedDateTime((current) => {
                        const newDate = new Date(current);
                        newDate.setMinutes(minute);
                        return newDate;
                      });
                    }}
                  />
                </View>
              </View>

              <View style={{ padding: 16 }}>
                <ThemedButton
                  title="Confirm"
                  action="primary"
                  onPress={handleConfirm}
                />
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}
