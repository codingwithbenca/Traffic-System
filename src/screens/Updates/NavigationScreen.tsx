
import React, { useEffect, useMemo, useState } from "react";

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

import "leaflet/dist/leaflet.css";

/* =========================================================
   COLOURS
========================================================= */

const COLORS = {
  primary: "#0B4F8A",
  primaryDark: "#083B68",

  background: "#F3F5F7",
  card: "#FFFFFF",

  text: "#17212B",
  textLight: "#66737F",

  border: "#D9E0E6",

  success: "#18794E",
  warning: "#A16207",
  danger: "#B42318",

  softBlue: "#EAF3FA",
  softGreen: "#ECFDF3",
  softYellow: "#FFF8E6",
  softRed: "#FEF3F2",
};

/* =========================================================
   TYPES
========================================================= */

type TrafficLevel = "clear" | "moderate" | "heavy";

type RoutePoint = [number, number];

type Destination = {
  name: string;
  subtitle: string;
  coordinates: RoutePoint;
};

type TrafficRoute = {
  id: string;
  name: string;
  level: TrafficLevel;
  coordinates: RoutePoint[];
};

/* =========================================================
   PRETORIA
========================================================= */

const PRETORIA_CENTER: RoutePoint = [
  -25.7479,
  28.2293,
];

const INITIAL_ZOOM = 13;

/* =========================================================
   DESTINATIONS
========================================================= */

const DESTINATIONS: Destination[] = [
  {
    name: "Pretoria CBD",
    subtitle: "Church Square",
    coordinates: [-25.7461, 28.1881],
  },

  {
    name: "Hatfield",
    subtitle: "Hatfield, Pretoria",
    coordinates: [-25.7461, 28.2336],
  },

  {
    name: "Menlyn Maine",
    subtitle: "Menlyn, Pretoria",
    coordinates: [-25.7833, 28.2789],
  },

  {
    name: "Brooklyn",
    subtitle: "Brooklyn, Pretoria",
    coordinates: [-25.7667, 28.2389],
  },

  {
    name: "Wonderboom",
    subtitle: "Wonderboom, Pretoria",
    coordinates: [-25.6895, 28.2184],
  },
];

/* =========================================================
   SIMULATED ROUTE
========================================================= */

const NAVIGATION_ROUTE: TrafficRoute = {
  id: "navigation-route",
  name: "Pretoria → Hatfield",
  level: "moderate",

  coordinates: [
    [-25.7479, 28.2293],
    [-25.7500, 28.2310],
    [-25.7492, 28.2335],
    [-25.7475, 28.2355],
    [-25.7455, 28.2375],
    [-25.7430, 28.2395],
    [-25.7400, 28.2405],
    [-25.7370, 28.2398],
    [-25.7345, 28.2380],
    [-25.7318, 28.2365],
  ],
};

/* =========================================================
   HELPERS
========================================================= */

function getTrafficColor(level: TrafficLevel) {
  switch (level) {
    case "clear":
      return COLORS.success;

    case "moderate":
      return COLORS.warning;

    case "heavy":
      return COLORS.danger;

    default:
      return COLORS.primary;
  }
}

/* =========================================================
   MAP CONTROL
========================================================= */

function NavigationMapController({
  action,
  actionKey,
  route,
}: {
  action: "center" | "route" | null;
  actionKey: number;
  route: RoutePoint[];
}) {
  const map = useMap();

  useEffect(() => {
    if (action === "center") {
      map.flyTo(
        PRETORIA_CENTER,
        INITIAL_ZOOM,
        {
          duration: 0.45,
        }
      );
    }

    if (action === "route" && route.length > 1) {
      const bounds = L.latLngBounds(route);

      map.fitBounds(bounds, {
        padding: [35, 35],
        maxZoom: 15,
        animate: true,
      });
    }
  }, [action, actionKey, map, route]);

  return null;
}

/* =========================================================
   MAP CLICK HANDLER
========================================================= */

function MapEvents({
  onMapClick,
}: {
  onMapClick: () => void;
}) {
  useMapEvents({
    click: () => {
      onMapClick();
    },
  });

  return null;
}

/* =========================================================
   CURRENT LOCATION ICON
========================================================= */

const currentLocationIcon = L.divIcon({
  className: "navigation-current-location",

  html: `
    <div
      style="
        position:relative;
        width:42px;
        height:42px;
        display:flex;
        align-items:center;
        justify-content:center;
      "
    >

      <div
        style="
          position:absolute;
          width:40px;
          height:40px;
          border-radius:50%;
          background:#0B4F8A22;
          animation:locationPulse 1.8s infinite;
        "
      ></div>

      <div
        style="
          position:relative;
          width:17px;
          height:17px;
          border-radius:50%;
          background:#0B4F8A;
          border:3px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,.25);
        "
      ></div>

    </div>
  `,

  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

/* =========================================================
   DESTINATION ICON
========================================================= */

const destinationIcon = L.divIcon({
  className: "navigation-destination",

  html: `
    <div
      style="
        width:34px;
        height:34px;
        border-radius:50%;
        background:#B42318;
        border:3px solid white;
        box-shadow:0 3px 10px rgba(0,0,0,.28);
        display:flex;
        align-items:center;
        justify-content:center;
        color:white;
        font-size:16px;
        font-weight:900;
      "
    >
      ●
    </div>
  `,

  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

/* =========================================================
   VEHICLE ICON
========================================================= */

function createCarIcon(rotation: number) {
  return L.divIcon({
    className: "navigation-vehicle",

    html: `
      <div
        style="
          width:27px;
          height:27px;
          border-radius:50%;
          background:white;
          border:1px solid #D9E0E6;
          box-shadow:0 3px 9px rgba(0,0,0,.22);
          display:flex;
          align-items:center;
          justify-content:center;
          transform:rotate(${rotation}deg);
          font-size:14px;
        "
      >
        🚗
      </div>
    `,

    iconSize: [27, 27],
    iconAnchor: [13.5, 13.5],
  });
}

/* =========================================================
   MOVING VEHICLE
========================================================= */

function MovingVehicle({
  route,
  duration,
}: {
  route: TrafficRoute;
  duration: number;
}) {
  const [segment, setSegment] = useState(0);

  useEffect(() => {
    const intervalTime =
      duration /
      Math.max(route.coordinates.length - 1, 1);

    const timer = setTimeout(() => {
      setSegment(
        current =>
          (current + 1) %
          route.coordinates.length
      );
    }, intervalTime);

    return () => clearTimeout(timer);
  }, [segment, duration, route.coordinates]);

  const current =
    route.coordinates[segment];

  const next =
    route.coordinates[
      (segment + 1) %
        route.coordinates.length
    ];

  const angle =
    Math.atan2(
      next[1] - current[1],
      next[0] - current[0]
    ) *
    (180 / Math.PI);

  return (
    <Marker
      position={current}
      icon={createCarIcon(angle)}
      interactive={false}
    />
  );
}

/* =========================================================
   MAIN SCREEN
========================================================= */

export default function NavigationScreen() {
  const navigation = useNavigation();

  const [mapLoaded, setMapLoaded] =
    useState(false);

  const [mapAction, setMapAction] =
    useState<"center" | "route" | null>(null);

  const [actionKey, setActionKey] =
    useState(0);

  const [search, setSearch] =
    useState("");

  const [destination, setDestination] =
    useState<Destination>(
      DESTINATIONS[1]
    );

  const [showSearch, setShowSearch] =
    useState(false);

  const [routeStarted, setRouteStarted] =
    useState(false);

  const trafficColor =
    getTrafficColor(
      NAVIGATION_ROUTE.level
    );

  const filteredDestinations =
    useMemo(() => {
      const value =
        search.trim().toLowerCase();

      if (!value) {
        return DESTINATIONS;
      }

      return DESTINATIONS.filter(
        item =>
          item.name
            .toLowerCase()
            .includes(value) ||
          item.subtitle
            .toLowerCase()
            .includes(value)
      );
    }, [search]);

  const triggerMapAction = (
    action: "center" | "route"
  ) => {
    setMapAction(action);
    setActionKey(value => value + 1);
  };

  const selectDestination = (
    item: Destination
  ) => {
    setDestination(item);
    setSearch("");
    setShowSearch(false);
    setRouteStarted(false);

    triggerMapAction("route");
  };

  return (
    <View style={styles.container}>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
          activeOpacity={0.8}
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color={COLORS.text}
          />
        </TouchableOpacity>

        <View style={styles.headerContent}>

          <Text style={styles.title}>
            Navigation
          </Text>

          <Text style={styles.subtitle}>
            Plan your route
          </Text>

        </View>

        <View style={styles.headerIcon}>
          <MaterialCommunityIcons
            name="navigation-variant"
            size={20}
            color={COLORS.primary}
          />
        </View>

      </View>

      {/* =====================================================
          MAP
      ===================================================== */}

      <View style={styles.mapCard}>

        <View style={styles.mapTopBar}>

          <View>
            <Text style={styles.mapEyebrow}>
              ROUTE PLANNER
            </Text>

            <View style={styles.locationRow}>

              <Ionicons
                name="location"
                size={14}
                color={COLORS.primary}
              />

              <Text style={styles.locationText}>
                Pretoria
              </Text>

            </View>
          </View>

          <TouchableOpacity
            style={styles.locateButton}
            activeOpacity={0.8}
            onPress={() =>
              triggerMapAction("center")
            }
          >
            <Ionicons
              name="locate-outline"
              size={19}
              color={COLORS.primary}
            />
          </TouchableOpacity>

        </View>

        <View style={styles.mapWrapper}>

          <MapContainer
            center={PRETORIA_CENTER}
            zoom={INITIAL_ZOOM}
            minZoom={10}
            maxZoom={18}
            zoomControl={false}
            attributionControl={false}
            style={{
              width: "100%",
              height: "100%",
            }}
            whenReady={() =>
              setMapLoaded(true)
            }
          >

            {/* =================================================
                OPEN STREET MAP
            ================================================= */}

            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {/* =================================================
                MAP EVENTS
            ================================================= */}

            <MapEvents
              onMapClick={() =>
                setShowSearch(false)
              }
            />

            {/* =================================================
                MAP CONTROLLER
            ================================================= */}

            <NavigationMapController
              action={mapAction}
              actionKey={actionKey}
              route={
                NAVIGATION_ROUTE.coordinates
              }
            />

            {/* =================================================
                ROUTE
            ================================================= */}

            <Polyline
              positions={
                NAVIGATION_ROUTE.coordinates
              }
              pathOptions={{
                color: trafficColor,
                weight: 8,
                opacity: 0.9,
                lineCap: "round",
                lineJoin: "round",
              }}
            />

            {/* =================================================
                CURRENT LOCATION
            ================================================= */}

            <Marker
              position={PRETORIA_CENTER}
              icon={currentLocationIcon}
              interactive={false}
            />

            {/* =================================================
                DESTINATION
            ================================================= */}

            <Marker
              position={
                destination.coordinates
              }
              icon={destinationIcon}
              interactive={false}
            />

            {/* =================================================
                MOVING VEHICLES
            ================================================= */}

            <MovingVehicle
              route={NAVIGATION_ROUTE}
              duration={9000}
            />

            <MovingVehicle
              route={NAVIGATION_ROUTE}
              duration={12000}
            />

          </MapContainer>

          {/* ===================================================
              LOADING
          =================================================== */}

          {!mapLoaded && (
            <View
              style={styles.mapLoading}
              pointerEvents="none"
            >
              <View
                style={
                  styles.mapLoadingCard
                }
              >
                <MaterialCommunityIcons
                  name="map-outline"
                  size={18}
                  color={COLORS.primary}
                />

                <Text
                  style={
                    styles.mapLoadingText
                  }
                >
                  Loading Pretoria map...
                </Text>
              </View>
            </View>
          )}

          {/* ===================================================
              MAP CONTROLS
          =================================================== */}

          <View style={styles.zoomControls}>

            <TouchableOpacity
              style={styles.zoomButton}
              onPress={() => {
                setMapAction(null);

                setTimeout(() => {
                  setMapAction("center");
                  setActionKey(
                    value => value + 1
                  );
                }, 0);
              }}
            >
              <Ionicons
                name="locate-outline"
                size={18}
                color={COLORS.text}
              />
            </TouchableOpacity>

            <View
              style={styles.zoomDivider}
            />

            <TouchableOpacity
              style={styles.zoomButton}
              onPress={() => {
                setMapAction(null);

                setTimeout(() => {
                  setMapAction("route");
                  setActionKey(
                    value => value + 1
                  );
                }, 0);
              }}
            >
              <Ionicons
                name="navigate-outline"
                size={18}
                color={COLORS.text}
              />
            </TouchableOpacity>

          </View>

          {/* ===================================================
              TRAFFIC BADGE
          =================================================== */}

          <View
            style={styles.trafficBadge}
          >

            <View
              style={[
                styles.trafficDot,
                {
                  backgroundColor:
                    trafficColor,
                },
              ]}
            />

            <Text
              style={styles.trafficBadgeText}
            >
              Moderate traffic
            </Text>

          </View>

          {/* ===================================================
              ATTRIBUTION
          =================================================== */}

          <View
            style={styles.attribution}
          >
            <Text
              style={
                styles.attributionText
              }
            >
              © OpenStreetMap contributors
            </Text>
          </View>

        </View>

        {/* =====================================================
            ROUTE SUMMARY
        ===================================================== */}

        <View style={styles.routeSummary}>

          <View style={styles.summaryItem}>

            <Ionicons
              name="time-outline"
              size={17}
              color={COLORS.primary}
            />

            <View>
              <Text
                style={styles.summaryValue}
              >
                18 min
              </Text>

              <Text
                style={styles.summaryLabel}
              >
                Estimated
              </Text>
            </View>

          </View>

          <View
            style={styles.summaryDivider}
          />

          <View style={styles.summaryItem}>

            <Ionicons
              name="navigate-outline"
              size={17}
              color={COLORS.warning}
            />

            <View>
              <Text
                style={styles.summaryValue}
              >
                6.4 km
              </Text>

              <Text
                style={styles.summaryLabel}
              >
                Distance
              </Text>
            </View>

          </View>

          <View
            style={styles.summaryDivider}
          />

          <View style={styles.summaryItem}>

            <MaterialCommunityIcons
              name="traffic-light-outline"
              size={18}
              color={trafficColor}
            />

            <View>
              <Text
                style={styles.summaryValue}
              >
                Moderate
              </Text>

              <Text
                style={styles.summaryLabel}
              >
                Traffic
              </Text>
            </View>

          </View>

        </View>

      </View>

      {/* =====================================================
          DESTINATION CARD
      ===================================================== */}

      <View style={styles.routeCard}>

        <View style={styles.routeHeader}>

          <View style={styles.routeIcon}>
            <Ionicons
              name="navigate"
              size={19}
              color={COLORS.primary}
            />
          </View>

          <View
            style={{ flex: 1 }}
          >

            <Text
              style={styles.routeTitle}
            >
              {destination.name}
            </Text>

            <Text
              style={styles.routeSubtitle}
            >
              {destination.subtitle}
            </Text>

          </View>

          <View
            style={styles.routeStatus}
          >
            <View
              style={styles.routeStatusDot}
            />

            <Text
              style={styles.routeStatusText}
            >
              ROUTE READY
            </Text>
          </View>

        </View>

        {/* ===================================================
            SEARCH
        =================================================== */}

        <TouchableOpacity
          style={
            styles.destinationButton
          }
          activeOpacity={0.8}
          onPress={() =>
            setShowSearch(
              value => !value
            )
          }
        >

          <Ionicons
            name="search-outline"
            size={18}
            color={COLORS.textLight}
          />

          <Text
            style={
              styles.destinationText
            }
          >
            Search destination
          </Text>

          <Ionicons
            name={
              showSearch
                ? "chevron-up"
                : "chevron-forward"
            }
            size={18}
            color={COLORS.textLight}
          />

        </TouchableOpacity>

        {/* ===================================================
            SEARCH PANEL
        =================================================== */}

        {showSearch && (
          <View
            style={styles.searchPanel}
          >

            <View
              style={styles.searchInput}
            >

              <Ionicons
                name="search"
                size={16}
                color={COLORS.textLight}
              />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search Pretoria destination"
                placeholderTextColor={
                  COLORS.textLight
                }
                style={
                  styles.searchInputText
                }
                autoFocus
              />

            </View>

            {filteredDestinations.map(
              item => (
                <TouchableOpacity
                  key={item.name}
                  style={
                    styles.destinationOption
                  }
                  onPress={() =>
                    selectDestination(item)
                  }
                  activeOpacity={0.7}
                >

                  <View
                    style={
                      styles.destinationOptionIcon
                    }
                  >
                    <Ionicons
                      name="location-outline"
                      size={17}
                      color={
                        COLORS.primary
                      }
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >

                    <Text
                      style={
                        styles.destinationOptionTitle
                      }
                    >
                      {item.name}
                    </Text>

                    <Text
                      style={
                        styles.destinationOptionSubtitle
                      }
                    >
                      {item.subtitle}
                    </Text>

                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={
                      COLORS.textLight
                    }
                  />

                </TouchableOpacity>
              )
            )}

            {filteredDestinations.length ===
              0 && (
              <Text
                style={
                  styles.noResults
                }
              >
                No destinations found.
              </Text>
            )}

          </View>
        )}

        {/* ===================================================
            START NAVIGATION
        =================================================== */}

        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.85}
          onPress={() => {
            setRouteStarted(true);
            triggerMapAction("route");
          }}
        >

          <Ionicons
            name="navigate"
            size={18}
            color="#FFFFFF"
          />

          <Text
            style={
              styles.startButtonText
            }
          >
            {routeStarted
              ? "Navigation active"
              : "Start navigation"}
          </Text>

        </TouchableOpacity>

      </View>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <View style={styles.updateRow}>

        <View
          style={styles.updateIndicator}
        />

        <Text
          style={styles.updateText}
        >
          Route and traffic data are simulated
          for demonstration.
        </Text>

        <Ionicons
          name="information-circle-outline"
          size={14}
          color={COLORS.textLight}
        />

      </View>

    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  headerContent: {
    flex: 1,
    marginLeft: 11,
  },

  title: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 2,
    fontSize: 10,
    color: COLORS.textLight,
  },

  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor:
      COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  /* =======================================================
     MAP CARD
  ======================================================= */

  mapCard: {
    backgroundColor:
      COLORS.card,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 16,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,

    elevation: 2,
  },

  mapTopBar: {
    height: 57,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    borderBottomWidth: 1,
    borderBottomColor:
      COLORS.border,
  },

  mapEyebrow: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1,
    color: COLORS.textLight,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  locationText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.text,
  },

  locateButton: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor:
      COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  /* =======================================================
     MAP
  ======================================================= */

  mapWrapper: {
    height: 350,
    position: "relative",
    overflow: "hidden",
  },

  mapLoading: {
    position: "absolute",
    top: 12,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 50,
  },

  mapLoadingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      "rgba(255,255,255,0.96)",
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 9,
    borderWidth: 1,
    borderColor:
      COLORS.border,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 3,
  },

  mapLoadingText: {
    marginLeft: 7,
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.text,
  },

  /* =======================================================
     MAP CONTROLS
  ======================================================= */

  zoomControls: {
    position: "absolute",
    right: 11,
    top: 11,

    backgroundColor:
      "#FFFFFF",

    borderRadius: 9,
    borderWidth: 1,
    borderColor:
      COLORS.border,

    overflow: "hidden",

    zIndex: 100,
    elevation: 4,
  },

  zoomButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  zoomDivider: {
    height: 1,
    backgroundColor:
      COLORS.border,
  },

  /* =======================================================
     TRAFFIC BADGE
  ======================================================= */

  trafficBadge: {
    position: "absolute",
    left: 10,
    top: 11,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.96)",

    borderWidth: 1,
    borderColor:
      COLORS.border,

    borderRadius: 9,

    paddingHorizontal: 9,
    paddingVertical: 7,

    zIndex: 100,
    elevation: 3,
  },

  trafficDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  trafficBadgeText: {
    fontSize: 8,
    fontWeight: "800",
    color: COLORS.text,
  },

  /* =======================================================
     ATTRIBUTION
  ======================================================= */

  attribution: {
    position: "absolute",
    right: 8,
    bottom: 6,

    backgroundColor:
      "rgba(255,255,255,0.85)",

    paddingHorizontal: 5,
    paddingVertical: 2,

    borderRadius: 3,

    zIndex: 100,
  },

  attributionText: {
    fontSize: 6,
    color: "#555",
  },

  /* =======================================================
     ROUTE SUMMARY
  ======================================================= */

  routeSummary: {
    height: 63,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-around",

    borderTopWidth: 1,
    borderTopColor:
      COLORS.border,
  },

  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryValue: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.text,
    marginLeft: 7,
  },

  summaryLabel: {
    marginTop: 1,
    marginLeft: 7,
    fontSize: 8,
    color: COLORS.textLight,
  },

  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor:
      COLORS.border,
  },

  /* =======================================================
     ROUTE CARD
  ======================================================= */

  routeCard: {
    marginTop: 12,
    padding: 14,

    backgroundColor:
      COLORS.card,

    borderRadius: 15,
    borderWidth: 1,
    borderColor:
      COLORS.border,
  },

  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  routeIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor:
      COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  routeTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.text,
  },

  routeSubtitle: {
    marginTop: 3,
    fontSize: 9,
    color: COLORS.textLight,
  },

  routeStatus: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      COLORS.softGreen,

    paddingHorizontal: 7,
    paddingVertical: 4,

    borderRadius: 20,
  },

  routeStatusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor:
      COLORS.success,
    marginRight: 4,
  },

  routeStatusText: {
    fontSize: 6.5,
    fontWeight: "900",
    color: COLORS.success,
    letterSpacing: 0.4,
  },

  /* =======================================================
     DESTINATION
  ======================================================= */

  destinationButton: {
    height: 46,
    marginTop: 13,
    paddingHorizontal: 12,

    borderRadius: 10,
    borderWidth: 1,
    borderColor:
      COLORS.border,

    flexDirection: "row",
    alignItems: "center",
  },

  destinationText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 11,
    color: COLORS.textLight,
  },

  /* =======================================================
     SEARCH
  ======================================================= */

  searchPanel: {
    marginTop: 8,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 11,
    overflow: "hidden",
  },

  searchInput: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor:
      COLORS.border,
  },

  searchInputText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 10,
    color: COLORS.text,
  },

  destinationOption: {
    minHeight: 50,
    paddingHorizontal: 10,

    flexDirection: "row",
    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor:
      COLORS.border,
  },

  destinationOptionIcon: {
    width: 31,
    height: 31,
    borderRadius: 8,
    backgroundColor:
      COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  destinationOptionTitle: {
    fontSize: 10.5,
    fontWeight: "800",
    color: COLORS.text,
  },

  destinationOptionSubtitle: {
    marginTop: 2,
    fontSize: 8,
    color: COLORS.textLight,
  },

  noResults: {
    padding: 14,
    textAlign: "center",
    fontSize: 9,
    color: COLORS.textLight,
  },

  /* =======================================================
     START BUTTON
  ======================================================= */

  startButton: {
    height: 45,
    marginTop: 11,

    borderRadius: 10,
    backgroundColor:
      COLORS.primary,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  startButtonText: {
    marginLeft: 7,
    fontSize: 11,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  /* =======================================================
     FOOTER
  ======================================================= */

  updateRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 8,
    paddingHorizontal: 3,
  },

  updateIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor:
      COLORS.success,
    marginRight: 6,
  },

  updateText: {
    flex: 1,
    fontSize: 8.5,
    color: COLORS.textLight,
  },

});

