
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";

/* =========================================================
   TYPES
========================================================= */

export interface AppointmentDateAvailability {
  date: string;
  slots: number;
}

export interface DateStepBranch {
  id: string;
  name: string;
}

interface DateStepProps {
  selectedBranch: DateStepBranch | null;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

/* =========================================================
   TEMPORARY AVAILABILITY
========================================================= */

/*
 * Temporary data.
 *
 * Later this will come from Firebase/API based on:
 *
 * selected service
 * selected branch
 *
 * Example:
 *
 * branch + service
 *       ↓
 * available dates
 */

const AVAILABLE_DATES: AppointmentDateAvailability[] = [
  {
    date: "2026-08-11",
    slots: 15,
  },
  {
    date: "2026-08-12",
    slots: 3,
  },
  {
    date: "2026-08-14",
    slots: 10,
  },
  {
    date: "2026-08-18",
    slots: 8,
  },
  {
    date: "2026-08-19",
    slots: 12,
  },
  {
    date: "2026-08-21",
    slots: 5,
  },
  {
    date: "2026-08-25",
    slots: 14,
  },
  {
    date: "2026-08-26",
    slots: 7,
  },
  {
    date: "2026-08-28",
    slots: 11,
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function DateStep({
  selectedBranch,
  selectedDate,
  onSelectDate,
}: DateStepProps) {
  const [visibleMonth, setVisibleMonth] = useState(
    "2026-08-01"
  );

  /* =======================================================
     TODAY
  ======================================================= */

  const today = new Date();

  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  /* =======================================================
     AVAILABILITY MAP
  ======================================================= */

  const availabilityMap = useMemo(() => {
    return AVAILABLE_DATES.reduce(
      (
        accumulator,
        availability
      ) => {
        accumulator[availability.date] =
          availability;

        return accumulator;
      },
      {} as Record<
        string,
        AppointmentDateAvailability
      >
    );
  }, []);

  /* =======================================================
     MARKED DATES
  ======================================================= */

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    AVAILABLE_DATES.forEach(
      (availability) => {
        const isSelected =
          selectedDate === availability.date;

        marks[availability.date] = {
          marked: true,
          dotColor: "#16A34A",

          selected: isSelected,

          selectedColor: "#2563EB",

          customStyles: {
            container: {
              backgroundColor: isSelected
                ? "#2563EB"
                : "#FFFFFF",
            },

            text: {
              color: isSelected
                ? "#FFFFFF"
                : "#1E293B",
              fontWeight: "600",
            },
          },
        };
      }
    );

    return marks;
  }, [selectedDate]);

  /* =======================================================
     SELECT DATE
  ======================================================= */

  const handleDayPress = (day: DateData) => {
    const availability =
      availabilityMap[day.dateString];

    /*
     * Do nothing if the date has no available slots.
     */

    if (!availability) {
      return;
    }

    /*
     * Do nothing if the day has zero slots.
     */

    if (availability.slots <= 0) {
      return;
    }

    onSelectDate(day.dateString);
  };

  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (date: string) => {
    const parsedDate = new Date(
      `${date}T00:00:00`
    );

    return parsedDate.toLocaleDateString(
      "en-ZA",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  /* =======================================================
     SELECTED DATE INFORMATION
  ======================================================= */

  const selectedAvailability =
    selectedDate
      ? availabilityMap[selectedDate]
      : null;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {/* ===================================================
          INTRODUCTION
      =================================================== */}

      <View style={styles.introduction}>
        <Text style={styles.title}>
          Choose a date
        </Text>

        <Text style={styles.description}>
          Select an available date for your appointment
          at the selected licensing branch.
        </Text>
      </View>

      {/* ===================================================
          SELECTED BRANCH
      =================================================== */}

      {selectedBranch && (
        <View style={styles.branchCard}>
          <View style={styles.branchIcon}>
            <Ionicons
              name="location-outline"
              size={20}
              color="#2563EB"
            />
          </View>

          <View style={styles.branchInformation}>
            <Text style={styles.branchLabel}>
              Appointment branch
            </Text>

            <Text style={styles.branchName}>
              {selectedBranch.name}
            </Text>
          </View>
        </View>
      )}

      {/* ===================================================
          CALENDAR
      =================================================== */}

      <View style={styles.calendarCard}>
        <View style={styles.calendarHeader}>
          <View>
            <Text style={styles.calendarTitle}>
              Available dates
            </Text>

            <Text style={styles.calendarSubtitle}>
              Green dots indicate available
              appointments
            </Text>
          </View>

          <View style={styles.availableBadge}>
            <View style={styles.availableDot} />

            <Text style={styles.availableBadgeText}>
              Available
            </Text>
          </View>
        </View>

        <Calendar
          current={visibleMonth}
          minDate={todayString}
          onDayPress={handleDayPress}
          onMonthChange={(month) => {
            setVisibleMonth(month.dateString);
          }}
          markedDates={markedDates}
          enableSwipeMonths
          hideExtraDays={false}
          theme={{
            backgroundColor: "#FFFFFF",
            calendarBackground: "#FFFFFF",

            textSectionTitleColor: "#64748B",

            selectedDayBackgroundColor:
              "#2563EB",

            selectedDayTextColor:
              "#FFFFFF",

            todayTextColor: "#2563EB",

            dayTextColor: "#1E293B",

            textDisabledColor: "#CBD5E1",

            arrowColor: "#2563EB",

            monthTextColor: "#111827",

            textMonthFontWeight: "700",

            textDayFontSize: 14,

            textMonthFontSize: 16,

            textDayHeaderFontSize: 12,
          }}
          style={styles.calendar}
        />
      </View>

      {/* ===================================================
          AVAILABLE DATE LIST
      =================================================== */}

      <View style={styles.availableSection}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Available dates
            </Text>

            <Text style={styles.sectionSubtitle}>
              Quick selection
            </Text>
          </View>

          <Text style={styles.dateCount}>
            {AVAILABLE_DATES.length} dates
          </Text>
        </View>

        <View style={styles.dateList}>
          {AVAILABLE_DATES.map(
            (availability) => {
              const selected =
                selectedDate ===
                availability.date;

              return (
                <TouchableOpacity
                  key={availability.date}
                  activeOpacity={0.8}
                  onPress={() =>
                    onSelectDate(
                      availability.date
                    )
                  }
                  style={[
                    styles.dateCard,
                    selected &&
                      styles.dateCardSelected,
                  ]}
                >
                  {/* ---------------------------------------
                      DATE ICON
                  --------------------------------------- */}

                  <View
                    style={[
                      styles.dateIcon,
                      selected &&
                        styles.dateIconSelected,
                    ]}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={
                        selected
                          ? "#FFFFFF"
                          : "#2563EB"
                      }
                    />
                  </View>

                  {/* ---------------------------------------
                      DATE INFORMATION
                  --------------------------------------- */}

                  <View
                    style={styles.dateInformation}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        selected &&
                          styles.dateTextSelected,
                      ]}
                    >
                      {formatDate(
                        availability.date
                      )}
                    </Text>

                    <Text
                      style={[
                        styles.slotsText,
                        selected &&
                          styles.slotsTextSelected,
                      ]}
                    >
                      {availability.slots}{" "}
                      {availability.slots === 1
                        ? "slot"
                        : "slots"}{" "}
                      available
                    </Text>
                  </View>

                  {/* ---------------------------------------
                      RADIO
                  --------------------------------------- */}

                  <View
                    style={[
                      styles.radioOuter,
                      selected &&
                        styles.radioOuterSelected,
                    ]}
                  >
                    {selected && (
                      <View
                        style={styles.radioInner}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            }
          )}
        </View>
      </View>

      {/* ===================================================
          SELECTED DATE SUMMARY
      =================================================== */}

      {selectedDate &&
        selectedAvailability && (
          <View style={styles.selectedCard}>
            <View style={styles.selectedIcon}>
              <Ionicons
                name="checkmark"
                size={18}
                color="#FFFFFF"
              />
            </View>

            <View
              style={styles.selectedInformation}
            >
              <Text
                style={styles.selectedLabel}
              >
                Selected appointment date
              </Text>

              <Text
                style={styles.selectedDate}
              >
                {formatDate(selectedDate)}
              </Text>

              <Text
                style={styles.selectedSlots}
              >
                {
                  selectedAvailability.slots
                }{" "}
                appointment slots available
              </Text>
            </View>
          </View>
        )}
    </ScrollView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  content: {
    paddingBottom: 30,
  },

  /* -------------------------------------------------------
     INTRODUCTION
  ------------------------------------------------------- */

  introduction: {
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748B",
  },

  /* -------------------------------------------------------
     BRANCH
  ------------------------------------------------------- */

  branchCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: "#F8FAFF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },

  branchIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    marginRight: 11,
  },

  branchInformation: {
    flex: 1,
  },

  branchLabel: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 2,
  },

  branchName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },

  /* -------------------------------------------------------
     CALENDAR
  ------------------------------------------------------- */

  calendarCard: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  calendarTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },

  calendarSubtitle: {
    marginTop: 3,
    fontSize: 11,
    color: "#64748B",
  },

  availableBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F0FDF4",
  },

  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16A34A",
    marginRight: 5,
  },

  availableBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#166534",
  },

  calendar: {
    paddingBottom: 10,
  },

  /* -------------------------------------------------------
     AVAILABLE DATES
  ------------------------------------------------------- */

  availableSection: {
    marginTop: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },

  sectionSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: "#64748B",
  },

  dateCount: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2563EB",
  },

  dateList: {
    gap: 10,
  },

  dateCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },

  dateCardSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#F8FAFF",
  },

  /* -------------------------------------------------------
     DATE ICON
  ------------------------------------------------------- */

  dateIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    marginRight: 11,
  },

  dateIconSelected: {
    backgroundColor: "#2563EB",
  },

  /* -------------------------------------------------------
     DATE INFORMATION
  ------------------------------------------------------- */

  dateInformation: {
    flex: 1,
  },

  dateText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },

  dateTextSelected: {
    color: "#2563EB",
  },

  slotsText: {
    marginTop: 3,
    fontSize: 11,
    color: "#16A34A",
    fontWeight: "600",
  },

  slotsTextSelected: {
    color: "#2563EB",
  },

  /* -------------------------------------------------------
     RADIO
  ------------------------------------------------------- */

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },

  radioOuterSelected: {
    borderColor: "#2563EB",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2563EB",
  },

  /* -------------------------------------------------------
     SELECTED SUMMARY
  ------------------------------------------------------- */

  selectedCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },

  selectedIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16A34A",
    marginRight: 10,
  },

  selectedInformation: {
    flex: 1,
  },

  selectedLabel: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 3,
  },

  selectedDate: {
    fontSize: 14,
    fontWeight: "700",
    color: "#166534",
  },

  selectedSlots: {
    marginTop: 3,
    fontSize: 11,
    color: "#16A34A",
  },
});

