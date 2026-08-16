
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/* =========================================================
   TYPES
========================================================= */

export interface AppointmentTimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface TimeStepBranch {
  id: string;
  name: string;
}

interface TimeStepProps {
  selectedBranch: TimeStepBranch | null;
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

/* =========================================================
   TEMPORARY TIME DATA
========================================================= */

/*
 * Temporary data for the UI.
 *
 * Later this will come from Firebase/API.
 *
 * The backend should eventually determine available
 * times based on:
 *
 * branch
 * service
 * date
 */

const TIME_SLOTS: AppointmentTimeSlot[] = [
  {
    id: "1",
    time: "08:00",
    available: true,
  },
  {
    id: "2",
    time: "08:30",
    available: false,
  },
  {
    id: "3",
    time: "09:00",
    available: true,
  },
  {
    id: "4",
    time: "09:30",
    available: true,
  },
  {
    id: "5",
    time: "10:00",
    available: false,
  },
  {
    id: "6",
    time: "10:30",
    available: true,
  },
  {
    id: "7",
    time: "11:00",
    available: true,
  },
  {
    id: "8",
    time: "11:30",
    available: false,
  },
  {
    id: "9",
    time: "12:00",
    available: true,
  },
  {
    id: "10",
    time: "12:30",
    available: true,
  },
  {
    id: "11",
    time: "13:00",
    available: false,
  },
  {
    id: "12",
    time: "13:30",
    available: true,
  },
  {
    id: "13",
    time: "14:00",
    available: true,
  },
  {
    id: "14",
    time: "14:30",
    available: false,
  },
  {
    id: "15",
    time: "15:00",
    available: true,
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function TimeStep({
  selectedBranch,
  selectedDate,
  selectedTime,
  onSelectTime,
}: TimeStepProps) {
  /* =======================================================
     AVAILABLE COUNT
  ======================================================= */

  const availableCount = useMemo(() => {
    return TIME_SLOTS.filter(
      (slot) => slot.available
    ).length;
  }, []);

  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formattedDate = useMemo(() => {
    if (!selectedDate) {
      return "";
    }

    const date = new Date(
      `${selectedDate}T00:00:00`
    );

    return date.toLocaleDateString(
      "en-ZA",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }, [selectedDate]);

  /* =======================================================
     SELECT TIME
  ======================================================= */

  const handleSelectTime = (
    slot: AppointmentTimeSlot
  ) => {
    if (!slot.available) {
      return;
    }

    onSelectTime(slot.time);
  };

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
          Choose a time
        </Text>

        <Text style={styles.description}>
          Select an available appointment time for
          your chosen date.
        </Text>
      </View>

      {/* ===================================================
          APPOINTMENT CONTEXT
      =================================================== */}

      <View style={styles.contextCard}>
        {/* Branch */}

        {selectedBranch && (
          <View style={styles.contextRow}>
            <View style={styles.contextIcon}>
              <Ionicons
                name="location-outline"
                size={18}
                color="#2563EB"
              />
            </View>

            <View style={styles.contextInformation}>
              <Text style={styles.contextLabel}>
                Branch
              </Text>

              <Text
                style={styles.contextValue}
                numberOfLines={2}
              >
                {selectedBranch.name}
              </Text>
            </View>
          </View>
        )}

        {/* Divider */}

        <View style={styles.contextDivider} />

        {/* Date */}

        <View style={styles.contextRow}>
          <View style={styles.contextIcon}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color="#2563EB"
            />
          </View>

          <View style={styles.contextInformation}>
            <Text style={styles.contextLabel}>
              Date
            </Text>

            <Text style={styles.contextValue}>
              {formattedDate || "No date selected"}
            </Text>
          </View>
        </View>
      </View>

      {/* ===================================================
          AVAILABILITY SUMMARY
      =================================================== */}

      <View style={styles.availabilityHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            Available times
          </Text>

          <Text style={styles.sectionSubtitle}>
            Choose one appointment slot
          </Text>
        </View>

        <View style={styles.availableBadge}>
          <View style={styles.availableDot} />

          <Text style={styles.availableBadgeText}>
            {availableCount} available
          </Text>
        </View>
      </View>

      {/* ===================================================
          TIME SLOTS
      =================================================== */}

      <View style={styles.timeGrid}>
        {TIME_SLOTS.map((slot) => {
          const selected =
            selectedTime === slot.time;

          return (
            <TouchableOpacity
              key={slot.id}
              activeOpacity={0.8}
              disabled={!slot.available}
              onPress={() =>
                handleSelectTime(slot)
              }
              style={[
                styles.timeCard,
                !slot.available &&
                  styles.timeCardUnavailable,
                selected &&
                  styles.timeCardSelected,
              ]}
            >
              {/* Clock icon */}

              <View
                style={[
                  styles.timeIcon,
                  !slot.available &&
                    styles.timeIconUnavailable,
                  selected &&
                    styles.timeIconSelected,
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={
                    selected
                      ? "#FFFFFF"
                      : slot.available
                      ? "#2563EB"
                      : "#94A3B8"
                  }
                />
              </View>

              {/* Time */}

              <Text
                style={[
                  styles.timeText,
                  !slot.available &&
                    styles.timeTextUnavailable,
                  selected &&
                    styles.timeTextSelected,
                ]}
              >
                {slot.time}
              </Text>

              {/* Selection */}

              <View
                style={[
                  styles.radioOuter,
                  !slot.available &&
                    styles.radioOuterUnavailable,
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
        })}
      </View>

      {/* ===================================================
          LEGEND
      =================================================== */}

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              styles.legendAvailable,
            ]}
          />

          <Text style={styles.legendText}>
            Available
          </Text>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              styles.legendUnavailable,
            ]}
          />

          <Text style={styles.legendText}>
            Unavailable
          </Text>
        </View>
      </View>

      {/* ===================================================
          SELECTED TIME
      =================================================== */}

      {selectedTime && (
        <View style={styles.selectedCard}>
          <View style={styles.selectedIcon}>
            <Ionicons
              name="checkmark"
              size={18}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.selectedInformation}>
            <Text style={styles.selectedLabel}>
              Selected appointment
            </Text>

            <Text style={styles.selectedDate}>
              {formattedDate}
            </Text>

            <Text style={styles.selectedTime}>
              {selectedTime}
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
     CONTEXT
  ------------------------------------------------------- */

  contextCard: {
    padding: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    backgroundColor: "#F8FAFF",
    marginBottom: 22,
  },

  contextRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  contextIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    marginRight: 10,
  },

  contextInformation: {
    flex: 1,
  },

  contextLabel: {
    fontSize: 10,
    color: "#64748B",
    marginBottom: 2,
  },

  contextValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },

  contextDivider: {
    height: 1,
    backgroundColor: "#E0E7FF",
    marginVertical: 11,
  },

  /* -------------------------------------------------------
     AVAILABILITY HEADER
  ------------------------------------------------------- */

  availabilityHeader: {
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
    fontWeight: "700",
    color: "#166534",
  },

  /* -------------------------------------------------------
     TIME GRID
  ------------------------------------------------------- */

  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },

  timeCard: {
    width: "48.5%",
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
  },

  timeCardSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#F8FAFF",
  },

  timeCardUnavailable: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
  },

  /* -------------------------------------------------------
     TIME ICON
  ------------------------------------------------------- */

  timeIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    marginRight: 8,
  },

  timeIconSelected: {
    backgroundColor: "#2563EB",
  },

  timeIconUnavailable: {
    backgroundColor: "#F1F5F9",
  },

  /* -------------------------------------------------------
     TIME TEXT
  ------------------------------------------------------- */

  timeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },

  timeTextSelected: {
    color: "#2563EB",
  },

  timeTextUnavailable: {
    color: "#94A3B8",
  },

  /* -------------------------------------------------------
     RADIO
  ------------------------------------------------------- */

  radioOuter: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },

  radioOuterSelected: {
    borderColor: "#2563EB",
  },

  radioOuterUnavailable: {
    borderColor: "#E2E8F0",
  },

  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#2563EB",
  },

  /* -------------------------------------------------------
     LEGEND
  ------------------------------------------------------- */

  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    gap: 20,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  legendAvailable: {
    backgroundColor: "#16A34A",
  },

  legendUnavailable: {
    backgroundColor: "#CBD5E1",
  },

  legendText: {
    fontSize: 11,
    color: "#64748B",
  },

  /* -------------------------------------------------------
     SELECTED
  ------------------------------------------------------- */

  selectedCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DCFCE7",
    backgroundColor: "#F0FDF4",
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
    fontSize: 10,
    color: "#64748B",
    marginBottom: 3,
  },

  selectedDate: {
    fontSize: 13,
    fontWeight: "600",
    color: "#166534",
  },

  selectedTime: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "800",
    color: "#166534",
  },
});

