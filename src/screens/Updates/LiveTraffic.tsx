import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
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

type RoadData = {
  id: string;
  name: string;
  subtitle: string;
  level: TrafficLevel;
  delay: string;
};

type IncidentType = "accident" | "construction" | "closure";

type IncidentData = {
  id: string;
  title: string;
  location: string;
  type: IncidentType;
  latitude: number;
  longitude: number;
};

type TrafficRoute = {
  id: string;
  name: string;
  level: TrafficLevel;
  coordinates: [number, number][];
};

/* =========================================================
   PRETORIA
========================================================= */

const PRETORIA_CENTER: [number, number] = [
  -25.7479,
  28.2293,
];

const INITIAL_ZOOM = 13;

/* =========================================================
   TRAFFIC ROADS
========================================================= */

const ROADS: RoadData[] = [
  {
    id: "n1",
    name: "N1 North",
    subtitle: "Pretoria CBD → Wonderboom",
    level: "heavy",
    delay: "+18 min",
  },
  {
    id: "r21",
    name: "R21 Highway",
    subtitle: "Pretoria → OR Tambo",
    level: "moderate",
    delay: "+9 min",
  },
  {
    id: "n4",
    name: "N4 East",
    subtitle: "Pretoria → Silver Lakes",
    level: "clear",
    delay: "Normal",
  },
  {
    id: "lynnwood",
    name: "Lynnwood Road",
    subtitle: "Brooklyn → Hatfield",
    level: "moderate",
    delay: "+7 min",
  },
];

/* =========================================================
   INCIDENTS
========================================================= */

const INCIDENTS: IncidentData[] = [
  {
    id: "accident",
    title: "Accident reported",
    location: "Pretoria Central",
    type: "accident",
    latitude: -25.7479,
    longitude: 28.2293,
  },
  {
    id: "construction",
    title: "Road construction",
    location: "Lynnwood Road",
    type: "construction",
    latitude: -25.7545,
    longitude: 28.2525,
  },
  {
    id: "closure",
    title: "Temporary closure",
    location: "Church Street",
    type: "closure",
    latitude: -25.7421,
    longitude: 28.2182,
  },
];

/* =========================================================
   TRAFFIC ROUTES
========================================================= */

const TRAFFIC_ROUTES: TrafficRoute[] = [
  {
    id: "n1",
    name: "N1 North",
    level: "heavy",
    coordinates: [
      [-25.7765, 28.1885],
      [-25.762, 28.199],
      [-25.749, 28.209],
      [-25.735, 28.215],
      [-25.718, 28.218],
    ],
  },

  {
    id: "r21",
    name: "R21",
    level: "moderate",
    coordinates: [
      [-25.786, 28.228],
      [-25.773, 28.236],
      [-25.758, 28.241],
      [-25.742, 28.245],
      [-25.727, 28.249],
    ],
  },

  {
    id: "n4",
    name: "N4",
    level: "clear",
    coordinates: [
      [-25.735, 28.19],
      [-25.739, 28.207],
      [-25.741, 28.225],
      [-25.742, 28.245],
      [-25.741, 28.265],
    ],
  },

  {
    id: "lynnwood",
    name: "Lynnwood Road",
    level: "moderate",
    coordinates: [
      [-25.754, 28.212],
      [-25.753, 28.228],
      [-25.752, 28.245],
      [-25.75, 28.263],
      [-25.748, 28.28],
    ],
  },
];

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

function getIncidentColor(type: IncidentType) {
  switch (type) {
    case "accident":
      return COLORS.danger;

    case "construction":
      return COLORS.warning;

    case "closure":
      return COLORS.primary;

    default:
      return COLORS.danger;
  }
}

function getIncidentIcon(type: IncidentType) {
  switch (type) {
    case "accident":
      return "car-crash";

    case "construction":
      return "traffic-cone";

    case "closure":
      return "close-circle";

    default:
      return "alert-circle";
  }
}

/* =========================================================
   LEAFLET ICONS
========================================================= */

function createIncidentIcon(
  type: IncidentType,
  selected: boolean
) {
  const color = getIncidentColor(type);
  const icon = getIncidentIcon(type);

  return L.divIcon({
    className: "traffic-incident-icon",
    html: `
      <div
        style="
          position:relative;
          width:${selected ? 46 : 40}px;
          height:${selected ? 46 : 40}px;
          display:flex;
          align-items:center;
          justify-content:center;
        "
      >
        <div
          style="
            position:absolute;
            width:${selected ? 42 : 36}px;
            height:${selected ? 42 : 36}px;
            border-radius:50%;
            background:${color}22;
            animation:trafficPulse 1.6s infinite;
          "
        ></div>

        <div
          style="
            position:relative;
            width:${selected ? 31 : 28}px;
            height:${selected ? 31 : 28}px;
            border-radius:50%;
            background:${color};
            border:3px solid white;
            box-shadow:0 3px 10px rgba(0,0,0,.25);
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-size:13px;
            font-weight:900;
          "
        >
          ${
            icon === "car-crash"
              ? "!"
              : icon === "traffic-cone"
              ? "!"
              : "×"
          }
        </div>
      </div>
    `,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
  });
}

const currentLocationIcon = L.divIcon({
  className: "current-location-icon",
  html: `
    <div
      style="
        position:relative;
        width:36px;
        height:36px;
        display:flex;
        align-items:center;
        justify-content:center;
      "
    >
      <div
        style="
          position:absolute;
          width:34px;
          height:34px;
          border-radius:50%;
          background:#0B4F8A22;
          animation:locationPulse 1.8s infinite;
        "
      ></div>

      <div
        style="
          position:relative;
          width:15px;
          height:15px;
          border-radius:50%;
          background:#0B4F8A;
          border:3px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,.25);
        "
      ></div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function createCarIcon(rotation: number) {
  return L.divIcon({
    className: "traffic-car-icon",
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
          font-size:15px;
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
   MAP CONTROLS
========================================================= */

function MapController({
  zoomAction,
  centerAction,
}: {
  zoomAction: "in" | "out" | "center" | null;
  centerAction: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (zoomAction === "in") {
      map.zoomIn();
    }

    if (zoomAction === "out") {
      map.zoomOut();
    }

    if (zoomAction === "center") {
      map.flyTo(PRETORIA_CENTER, INITIAL_ZOOM, {
        duration: 0.45,
      });
    }
  }, [zoomAction, centerAction, map]);

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
   MOVING VEHICLE
========================================================= */

function MovingVehicle({
  route,
  duration,
  offset,
}: {
  route: TrafficRoute;
  duration: number;
  offset: number;
}) {
  const [position, setPosition] = useState<[number, number]>(
    route.coordinates[0]
  );

  const [segment, setSegment] = useState(0);

  useEffect(() => {
    let mounted = true;

    const intervalTime =
      duration / Math.max(route.coordinates.length - 1, 1);

    const timeout = setTimeout(() => {
      if (!mounted) return;

      setSegment((current) => {
        const next =
          (current + 1) % route.coordinates.length;

        setPosition(route.coordinates[next]);

        return next;
      });
    }, intervalTime + offset);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [
    segment,
    duration,
    offset,
    route.coordinates,
  ]);

  const nextIndex =
    (segment + 1) % route.coordinates.length;

  const current = route.coordinates[segment];
  const next = route.coordinates[nextIndex];

  const angle =
    Math.atan2(
      next[1] - current[1],
      next[0] - current[0]
    ) *
    (180 / Math.PI);

  return (
    <Marker
      position={position}
      icon={createCarIcon(angle)}
      interactive={false}
    />
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function LiveTraffic() {
  const navigation = useNavigation<any>();

  const [selectedRoad, setSelectedRoad] =
    useState<RoadData>(ROADS[0]);

  const [selectedIncident, setSelectedIncident] =
    useState<IncidentData | null>(null);

  const [zoomAction, setZoomAction] =
    useState<
      "in" | "out" | "center" | null
    >(null);

  const [centerAction, setCenterAction] =
    useState(0);

  const [mapLoaded, setMapLoaded] =
    useState(false);

  /* =======================================================
     MAP CONTROL
  ======================================================= */

  const triggerMapAction = (
    action: "in" | "out" | "center"
  ) => {
    setZoomAction(action);

    if (action === "center") {
      setCenterAction((value) => value + 1);
    }

    setTimeout(() => {
      setZoomAction(null);
    }, 50);
  };

  /* =======================================================
     ROAD SELECT
  ======================================================= */

  const selectRoad = (road: RoadData) => {
    setSelectedIncident(null);
    setSelectedRoad(road);
  };

  /* =======================================================
     INCIDENT SELECT
  ======================================================= */

  const selectIncident = (
    incident: IncidentData
  ) => {
    setSelectedIncident(incident);

    const relatedRoad =
      incident.type === "construction"
        ? ROADS[3]
        : incident.type === "closure"
        ? ROADS[2]
        : ROADS[0];

    setSelectedRoad(relatedRoad);
  };

  /* =======================================================
     ROUTE STYLES
  ======================================================= */

  const routeOptions = useMemo(() => {
    return TRAFFIC_ROUTES.map((route) => ({
      ...route,
      color: getTrafficColor(route.level),
    }));
  }, []);

  return (
    <View style={styles.container}>
      {/* ===================================================
          HEADER
      =================================================== */}

      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <MaterialCommunityIcons
            name="traffic-light-outline"
            size={20}
            color={COLORS.primary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>
              Live Traffic
            </Text>

            <View style={styles.livePill}>
              <View style={styles.liveDot} />

              <Text style={styles.liveText}>
                LIVE
              </Text>
            </View>
          </View>

          <Text style={styles.sectionDescription}>
            Traffic conditions across central Pretoria.
          </Text>
        </View>
      </View>

      {/* ===================================================
          MAP CARD
      =================================================== */}

      <View style={styles.mapCard}>
        {/* =================================================
            MAP TOP BAR
        ================================================= */}

        <View style={styles.mapTopBar}>
          <View>
            <Text style={styles.mapEyebrow}>
              TRAFFIC NETWORK
            </Text>

            <View style={styles.locationRow}>
              <Ionicons
                name="location"
                size={14}
                color={COLORS.primary}
              />

              <Text style={styles.locationText}>
                Pretoria Central
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

        {/* =================================================
            MAP
        ================================================= */}

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
            whenReady={() => setMapLoaded(true)}
          >
            {/* =============================================
                OPEN STREET MAP
            ============================================= */}

            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {/* =============================================
                MAP EVENTS
            ============================================= */}

            <MapEvents
              onMapClick={() =>
                setSelectedIncident(null)
              }
            />

            {/* =============================================
                MAP CONTROLLER
            ============================================= */}

            <MapController
              zoomAction={zoomAction}
              centerAction={centerAction}
            />

            {/* =============================================
                TRAFFIC ROUTES
            ============================================= */}

            {routeOptions.map((route) => (
              <Polyline
                key={route.id}
                positions={route.coordinates}
                pathOptions={{
                  color: route.color,
                  weight: 7,
                  opacity: 0.9,
                  lineCap: "round",
                  lineJoin: "round",
                }}
                eventHandlers={{
                  click: () => {
                    const road = ROADS.find(
                      (item) =>
                        item.id === route.id
                    );

                    if (road) {
                      selectRoad(road);
                    }
                  },
                }}
              />
            ))}

            {/* =============================================
                INCIDENTS
            ============================================= */}

            {INCIDENTS.map((incident) => (
              <Marker
                key={incident.id}
                position={[
                  incident.latitude,
                  incident.longitude,
                ]}
                icon={createIncidentIcon(
                  incident.type,
                  selectedIncident?.id ===
                    incident.id
                )}
                eventHandlers={{
                  click: (event) => {
                    event.originalEvent
                      ?.stopPropagation();

                    selectIncident(incident);
                  },
                }}
              />
            ))}

            {/* =============================================
                CURRENT LOCATION
            ============================================= */}

            <Marker
              position={PRETORIA_CENTER}
              icon={currentLocationIcon}
              interactive={false}
            />

            {/* =============================================
                MOVING VEHICLES
            ============================================= */}

            <MovingVehicle
              route={TRAFFIC_ROUTES[0]}
              duration={9000}
              offset={0}
            />

            <MovingVehicle
              route={TRAFFIC_ROUTES[1]}
              duration={10500}
              offset={1000}
            />

            <MovingVehicle
              route={TRAFFIC_ROUTES[2]}
              duration={12000}
              offset={1800}
            />

            <MovingVehicle
              route={TRAFFIC_ROUTES[3]}
              duration={8500}
              offset={2500}
            />
          </MapContainer>

          {/* =================================================
              LOADING
          ================================================= */}

          {!mapLoaded && (
            <View
              style={styles.mapLoading}
              pointerEvents="none"
            >
              <View style={styles.mapLoadingCard}>
                <MaterialCommunityIcons
                  name="map-outline"
                  size={18}
                  color={COLORS.primary}
                />

                <Text style={styles.mapLoadingText}>
                  Loading Pretoria map...
                </Text>
              </View>
            </View>
          )}

          {/* =================================================
              ZOOM CONTROLS
          ================================================= */}

          <View style={styles.zoomControls}>
            <TouchableOpacity
              style={styles.zoomButton}
              onPress={() =>
                triggerMapAction("in")
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name="add"
                size={19}
                color={COLORS.text}
              />
            </TouchableOpacity>

            <View style={styles.zoomDivider} />

            <TouchableOpacity
              style={styles.zoomButton}
              onPress={() =>
                triggerMapAction("out")
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name="remove"
                size={19}
                color={COLORS.text}
              />
            </TouchableOpacity>
          </View>

          {/* =================================================
              LEGEND
          ================================================= */}

          <View style={styles.legend}>
            <Text style={styles.legendTitle}>
              TRAFFIC
            </Text>

            <LegendItem
              color={COLORS.success}
              text="Clear"
            />

            <LegendItem
              color={COLORS.warning}
              text="Moderate"
            />

            <LegendItem
              color={COLORS.danger}
              text="Heavy"
            />
          </View>

          {/* =================================================
              ATTRIBUTION
          ================================================= */}

          <View style={styles.attribution}>
            <Text style={styles.attributionText}>
              © OpenStreetMap contributors
            </Text>
          </View>
        </View>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <View style={styles.summary}>
          <SummaryItem
            icon="car-outline"
            value="18"
            label="Incidents"
            type="danger"
          />

          <View style={styles.summaryDivider} />

          <SummaryItem
            icon="speedometer-outline"
            value="42"
            label="Avg speed"
            type="warning"
          />

          <View style={styles.summaryDivider} />

          <SummaryItem
            icon="navigate-outline"
            value="7"
            label="Clear roads"
            type="success"
          />
        </View>

        {/* =================================================
            INFORMATION PANEL
        ================================================= */}

        <View style={styles.informationPanel}>
          {selectedIncident ? (
            <IncidentInformation
              incident={selectedIncident}
            />
          ) : (
            <RoadInformation
              road={selectedRoad}
              onNavigate={() =>
                navigation.navigate(
                  "Navigation"
                )
              }
            />
          )}
        </View>
      </View>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <View style={styles.updateRow}>
        <View style={styles.updateIndicator} />

        <Text style={styles.updateText}>
          Traffic information updated moments ago
        </Text>

        <Ionicons
          name="refresh-outline"
          size={14}
          color={COLORS.textLight}
        />
      </View>
    </View>
  );
}

/* =========================================================
   ROAD INFORMATION
========================================================= */

function RoadInformation({
  road,
  onNavigate,
}: {
  road: RoadData;
  onNavigate: () => void;
}) {
  const color = getTrafficColor(
    road.level
  );

  const background =
    road.level === "clear"
      ? COLORS.softGreen
      : road.level === "moderate"
      ? COLORS.softYellow
      : COLORS.softRed;

  const label =
    road.level === "clear"
      ? "Clear traffic"
      : road.level === "moderate"
      ? "Moderate traffic"
      : "Heavy traffic";

  return (
    <View style={styles.infoRow}>
      <View
        style={[
          styles.infoIcon,
          {
            backgroundColor: background,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="road-variant"
          size={20}
          color={color}
        />
      </View>

      <View style={styles.infoContent}>
        <View style={styles.infoTitleRow}>
          <Text style={styles.infoTitle}>
            {road.name}
          </Text>

          <Text
            style={[
              styles.infoStatus,
              {
                color,
              },
            ]}
          >
            {label}
          </Text>
        </View>

        <Text style={styles.infoLocation}>
          {road.subtitle}
        </Text>

        <Text style={styles.infoDescription}>
          Estimated delay: {road.delay}
        </Text>

        <Text style={styles.infoUpdated}>
          Updated moments ago
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onNavigate}
        style={styles.infoArrowButton}
      >
        <Ionicons
          name="chevron-forward"
          size={18}
          color={COLORS.textLight}
        />
      </TouchableOpacity>
    </View>
  );
}

/* =========================================================
   INCIDENT INFORMATION
========================================================= */

function IncidentInformation({
  incident,
}: {
  incident: IncidentData;
}) {
  const icon =
    incident.type === "accident"
      ? "car-crash"
      : incident.type === "construction"
      ? "traffic-cone"
      : "close-circle";

  const color = getIncidentColor(
    incident.type
  );

  return (
    <View style={styles.infoRow}>
      <View
        style={[
          styles.infoIcon,
          {
            backgroundColor:
              incident.type ===
              "construction"
                ? COLORS.softYellow
                : incident.type ===
                  "closure"
                ? COLORS.softBlue
                : COLORS.softRed,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={color}
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>
          {incident.title}
        </Text>

        <Text style={styles.infoLocation}>
          {incident.location}
        </Text>

        <Text style={styles.infoDescription}>
          Traffic conditions may be affected
          in this area.
        </Text>

        <Text style={styles.infoUpdated}>
          Reported recently
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={COLORS.textLight}
      />
    </View>
  );
}

/* =========================================================
   LEGEND
========================================================= */

function LegendItem({
  color,
  text,
}: {
  color: string;
  text: string;
}) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendDot,
          {
            backgroundColor: color,
          },
        ]}
      />

      <Text style={styles.legendText}>
        {text}
      </Text>
    </View>
  );
}

/* =========================================================
   SUMMARY
========================================================= */

function SummaryItem({
  icon,
  value,
  label,
  type,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  type:
    | "success"
    | "warning"
    | "danger";
}) {
  const color =
    type === "success"
      ? COLORS.success
      : type === "warning"
      ? COLORS.warning
      : COLORS.danger;

  return (
    <View style={styles.summaryItem}>
      <Ionicons
        name={icon}
        size={17}
        color={color}
      />

      <View style={{ marginLeft: 7 }}>
        <Text style={styles.summaryValue}>
          {value}
        </Text>

        <Text style={styles.summaryLabel}>
          {label}
        </Text>
      </View>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
  },

  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.text,
  },

  sectionDescription: {
    marginTop: 2,
    fontSize: 10.5,
    color: COLORS.textLight,
  },

  livePill: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: COLORS.softGreen,
  },

  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 4,
  },

  liveText: {
    fontSize: 7,
    fontWeight: "900",
    color: COLORS.success,
    letterSpacing: 0.6,
  },

  /* =======================================================
     MAP CARD
  ======================================================= */

  mapCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
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
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  /* =======================================================
     MAP
  ======================================================= */

  mapWrapper: {
    height: 345,
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
    borderColor: COLORS.border,

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
     ZOOM
  ======================================================= */

  zoomControls: {
    position: "absolute",
    right: 11,
    top: 11,
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    backgroundColor: COLORS.border,
  },

  /* =======================================================
     LEGEND
  ======================================================= */

  legend: {
    position: "absolute",
    left: 10,
    bottom: 11,
    backgroundColor:
      "rgba(255,255,255,0.96)",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 8,
    zIndex: 100,
    elevation: 3,
  },

  legendTitle: {
    fontSize: 7,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 5,
    letterSpacing: 0.5,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },

  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },

  legendText: {
    fontSize: 7,
    color: COLORS.textLight,
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
     SUMMARY
  ======================================================= */

  summary: {
    height: 63,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.text,
  },

  summaryLabel: {
    marginTop: 1,
    fontSize: 8,
    color: COLORS.textLight,
  },

  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },

  /* =======================================================
     INFORMATION
  ======================================================= */

  informationPanel: {
    padding: 13,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  infoContent: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },

  infoTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.text,
  },

  infoStatus: {
    fontSize: 8,
    fontWeight: "900",
  },

  infoLocation: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.primary,
  },

  infoDescription: {
    marginTop: 3,
    fontSize: 9.5,
    lineHeight: 14,
    color: COLORS.textLight,
  },

  infoUpdated: {
    marginTop: 4,
    fontSize: 7.5,
    color: COLORS.textLight,
  },

  infoArrowButton: {
    padding: 4,
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
    backgroundColor: COLORS.success,
    marginRight: 6,
  },

  updateText: {
    flex: 1,
    fontSize: 8.5,
    color: COLORS.textLight,
  },
});