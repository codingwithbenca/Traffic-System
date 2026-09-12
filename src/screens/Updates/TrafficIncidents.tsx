import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const { width } = Dimensions.get("window");

/* =========================================================
   TYPES
========================================================= */

type IncidentType =
  | "accident"
  | "construction"
  | "closure";

type Coordinate = {
  latitude: number;
  longitude: number;
};

type Incident = {
  id: string;
  type: IncidentType;
  title: string;
  location: string;
  description: string;
  status: string;
  time: string;
  coordinate: Coordinate;
};

/* =========================================================
   PRETORIA
========================================================= */

const PRETORIA_CENTER: [number, number] = [
  -25.7479,
  28.2293,
];

/* =========================================================
   INCIDENT DATA
========================================================= */

const INCIDENTS: Incident[] = [
  {
    id: "1",
    type: "accident",
    title: "Accident Reported",
    location: "Mabopane Road",
    description:
      "An accident has been reported and may affect traffic flow.",
    status: "Partially blocked",
    time: "12 min ago",
    coordinate: {
      latitude: -25.653,
      longitude: 28.107,
    },
  },

  {
    id: "2",
    type: "construction",
    title: "Construction Zone",
    location: "Lynnwood Road",
    description:
      "Road construction is affecting one lane in this area.",
    status: "Lane restriction",
    time: "28 min ago",
    coordinate: {
      latitude: -25.754,
      longitude: 28.267,
    },
  },

  {
    id: "3",
    type: "closure",
    title: "Road Closure",
    location: "Church Street",
    description:
      "Temporary road closure reported in the area.",
    status: "Road closed",
    time: "41 min ago",
    coordinate: {
      latitude: -25.748,
      longitude: 28.188,
    },
  },
];

/* =========================================================
   DEMO ROUTE
========================================================= */

const DEMO_ROUTE: [number, number][] = [
  [-25.746, 28.237],
  [-25.749, 28.228],
  [-25.746, 28.218],
  [-25.748, 28.207],
  [-25.748, 28.198],
  [-25.748, 28.188],
];

/* =========================================================
   TRAFFIC SEGMENTS
========================================================= */

const HEAVY_TRAFFIC: [number, number][] = [
  [-25.651, 28.109],
  [-25.654, 28.125],
  [-25.657, 28.142],
];

const MODERATE_TRAFFIC: [number, number][] = [
  [-25.752, 28.249],
  [-25.754, 28.267],
  [-25.756, 28.280],
];

/* =========================================================
   INCIDENT CONFIG
========================================================= */

const getIncidentConfig = (
  type: IncidentType
) => {
  switch (type) {
    case "accident":
      return {
        icon: "car-crash",
        color: "#B42318",
        background: "#FEF3F2",
        label: "HIGH PRIORITY",
      };

    case "construction":
      return {
        icon: "road-variant",
        color: "#A16207",
        background: "#FFF8E6",
        label: "ROADWORKS",
      };

    case "closure":
      return {
        icon: "close-octagon-outline",
        color: "#7A271A",
        background: "#FEE4E2",
        label: "CLOSURE",
      };
  }
};

/* =========================================================
   LEAFLET MARKER HTML
========================================================= */

const createIncidentIcon = (
  incident: Incident,
  selected: boolean
) => {
  const config = getIncidentConfig(
    incident.type
  );

  return L.divIcon({
    className: "traffic-incident-marker",

    html: `
      <div
        style="
          position: relative;
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >

        <div
          style="
            position: absolute;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: ${config.color};
            opacity: 0.16;
            animation: trafficPulse 1.8s infinite;
          "
        ></div>

        <div
          style="
            position: relative;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: ${config.color};
            border: ${selected ? "4px" : "3px"} solid white;
            box-shadow:
              0 3px 10px rgba(0,0,0,0.28);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 17px;
            font-weight: 900;
          "
        >
          ${
            incident.type === "accident"
              ? "!"
              : incident.type === "construction"
              ? "⚒"
              : "×"
          }
        </div>

      </div>
    `,

    iconSize: [54, 54],
    iconAnchor: [27, 27],
  });
};

/* =========================================================
   INCIDENT DETAILS
========================================================= */

function IncidentDetails({
  incident,
}: {
  incident: Incident;
}) {
  const config = getIncidentConfig(
    incident.type
  );

  return (
    <View style={styles.detailsCard}>
      <View
        style={[
          styles.detailsIcon,
          {
            backgroundColor:
              config.background,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={config.icon as any}
          size={24}
          color={config.color}
        />
      </View>

      <View style={styles.detailsContent}>
        <View style={styles.detailsTopRow}>
          <Text style={styles.detailsTitle}>
            {incident.title}
          </Text>

          <Text
            style={[
              styles.priorityText,
              {
                color: config.color,
              },
            ]}
          >
            {config.label}
          </Text>
        </View>

        <Text style={styles.detailsLocation}>
          {incident.location}
        </Text>

        <Text style={styles.detailsDescription}>
          {incident.description}
        </Text>

        <View style={styles.detailsBottom}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    config.color,
                },
              ]}
            />

            <Text style={styles.statusText}>
              {incident.status}
            </Text>
          </View>

          <Text style={styles.timeText}>
            {incident.time}
          </Text>
        </View>
      </View>
    </View>
  );
}

/* =========================================================
   LEGEND
========================================================= */

function LegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
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
        {label}
      </Text>
    </View>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TrafficIncidents() {
  const mapElementRef =
    useRef<View | null>(null);

  const mapRef =
    useRef<L.Map | null>(null);

  const incidentMarkersRef =
    useRef<Record<string, L.Marker>>({});

  const [selectedIncident, setSelectedIncident] =
    useState<string | null>(null);

  const [expanded, setExpanded] =
    useState(false);

  /* =======================================================
     INITIALIZE LEAFLET MAP
  ======================================================= */

  useEffect(() => {
    if (!mapElementRef.current) {
      return;
    }

    const element =
      mapElementRef.current as any;

    /*
     Prevent Leaflet from creating
     duplicate maps during hot reload.
    */

    if (mapRef.current) {
      return;
    }

    const map = L.map(element, {
      center: PRETORIA_CENTER,
      zoom: 12,

      zoomControl: false,

      scrollWheelZoom: true,

      doubleClickZoom: true,

      dragging: true,

      attributionControl: true,
    });

    mapRef.current = map;

    /* =====================================================
       REAL OPENSTREETMAP MAP TILES
    ===================================================== */

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,

        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      }
    ).addTo(map);

    /* =====================================================
       DEMO ROUTE GLOW
    ===================================================== */

    L.polyline(DEMO_ROUTE, {
      color: "#0B4F8A",
      weight: 14,
      opacity: 0.13,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    /* =====================================================
       DEMO ROUTE
    ===================================================== */

    L.polyline(DEMO_ROUTE, {
      color: "#0B4F8A",
      weight: 6,
      opacity: 0.95,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    /* =====================================================
       HEAVY TRAFFIC
    ===================================================== */

    L.polyline(HEAVY_TRAFFIC, {
      color: "#B42318",
      weight: 9,
      opacity: 0.88,
      lineCap: "round",
    }).addTo(map);

    /* =====================================================
       MODERATE TRAFFIC
    ===================================================== */

    L.polyline(MODERATE_TRAFFIC, {
      color: "#A16207",
      weight: 9,
      opacity: 0.88,
      lineCap: "round",
    }).addTo(map);

    /* =====================================================
       INCIDENT AREAS + MARKERS
    ===================================================== */

    INCIDENTS.forEach((incident) => {
      const config =
        getIncidentConfig(
          incident.type
        );

      /* Incident radius */

      L.circle(
        [
          incident.coordinate.latitude,
          incident.coordinate.longitude,
        ],
        {
          radius: 180,

          color: config.color,

          weight: 1,

          opacity: 0.35,

          fillColor: config.color,

          fillOpacity: 0.08,
        }
      ).addTo(map);

      /* Marker */

      const marker = L.marker(
        [
          incident.coordinate.latitude,
          incident.coordinate.longitude,
        ],
        {
          icon: createIncidentIcon(
            incident,
            false
          ),
        }
      );

      marker.on("click", () => {
        setSelectedIncident(
          incident.id
        );

        map.flyTo(
          [
            incident.coordinate.latitude,
            incident.coordinate.longitude,
          ],
          14,
          {
            duration: 0.6,
          }
        );
      });

      marker.addTo(map);

      incidentMarkersRef.current[
        incident.id
      ] = marker;
    });

    /* =====================================================
       MAP RESIZE
    ===================================================== */

    const resizeTimer =
      window.setTimeout(() => {
        map.invalidateSize();
      }, 250);

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      window.clearTimeout(
        resizeTimer
      );

      map.remove();

      mapRef.current = null;

      incidentMarkersRef.current = {};
    };
  }, []);

  /* =======================================================
     UPDATE SELECTED MARKER
  ======================================================= */

  useEffect(() => {
    INCIDENTS.forEach((incident) => {
      const marker =
        incidentMarkersRef.current[
          incident.id
        ];

      if (!marker) {
        return;
      }

      marker.setIcon(
        createIncidentIcon(
          incident,
          selectedIncident ===
            incident.id
        )
      );
    });
  }, [selectedIncident]);

  /* =======================================================
     SELECTED INCIDENT
  ======================================================= */

  const selected =
    INCIDENTS.find(
      (incident) =>
        incident.id ===
        selectedIncident
    );

  /* =======================================================
     INCIDENT PRESS
  ======================================================= */

  const handleIncidentPress = (
    incident: Incident
  ) => {
    setSelectedIncident(
      incident.id
    );

    mapRef.current?.flyTo(
      [
        incident.coordinate.latitude,
        incident.coordinate.longitude,
      ],
      14,
      {
        duration: 0.6,
      }
    );
  };

  /* =======================================================
     ZOOM IN
  ======================================================= */

  const zoomIn = () => {
    mapRef.current?.zoomIn();
  };

  /* =======================================================
     ZOOM OUT
  ======================================================= */

  const zoomOut = () => {
    mapRef.current?.zoomOut();
  };

  /* =======================================================
     RESET MAP
  ======================================================= */

  const resetMap = () => {
    mapRef.current?.flyTo(
      PRETORIA_CENTER,
      12,
      {
        duration: 0.6,
      }
    );
  };

  /* =======================================================
     FIT INCIDENTS
  ======================================================= */

  const fitIncidents = () => {
    if (!mapRef.current) {
      return;
    }

    const bounds =
      L.latLngBounds(
        INCIDENTS.map(
          (incident) => [
            incident.coordinate
              .latitude,

            incident.coordinate
              .longitude,
          ]
        )
      );

    mapRef.current.fitBounds(
      bounds,
      {
        padding: [
          70,
          70,
        ],

        maxZoom: 12,

        animate: true,
      }
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <View style={styles.container}>

      {/* =================================================
          MAP
      ================================================= */}

      <View style={styles.mapContainer}>

        <View
          ref={mapElementRef}
          style={styles.map}
        />

        {/* =================================================
            LIVE BADGE
        ================================================= */}

        <View
          style={styles.liveBadge}
        >
          <View
            style={styles.liveDot}
          />

          <Text
            style={styles.liveText}
          >
            LIVE TRAFFIC
          </Text>
        </View>

        {/* =================================================
            MAP CONTROLS
        ================================================= */}

        <View
          style={styles.mapControls}
        >
          <TouchableOpacity
            style={styles.mapButton}
            onPress={zoomIn}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons
              name="plus"
              size={21}
              color="#17212B"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapButton}
            onPress={zoomOut}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons
              name="minus"
              size={21}
              color="#17212B"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapButton}
            onPress={resetMap}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={19}
              color="#0B4F8A"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapButton}
            onPress={fitIncidents}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons
              name="map-marker-multiple"
              size={19}
              color="#0B4F8A"
            />
          </TouchableOpacity>
        </View>

        {/* =================================================
            LEGEND
        ================================================= */}

        <View
          style={styles.legend}
        >
          <Text
            style={styles.legendTitle}
          >
            INCIDENTS
          </Text>

          <LegendItem
            color="#B42318"
            label="Accident"
          />

          <LegendItem
            color="#A16207"
            label="Construction"
          />

          <LegendItem
            color="#7A271A"
            label="Closure"
          />
        </View>

        {/* =================================================
            MAP INFO
        ================================================= */}

        <View
          style={styles.mapInfo}
        >
          <MaterialCommunityIcons
            name="map-marker-radius"
            size={14}
            color="#0B4F8A"
          />

          <Text
            style={styles.mapInfoText}
          >
            Pretoria traffic
          </Text>
        </View>

      </View>

      {/* ===================================================
          EXPAND BAR
      =================================================== */}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          setExpanded(
            (value) => !value
          )
        }
        style={styles.expandButton}
      >
        <View
          style={styles.expandHandle}
        />

        <View
          style={styles.expandContent}
        >
          <View>
            <View
              style={
                styles.activeTitleRow
              }
            >
              <View
                style={
                  styles.activeIndicator
                }
              />

              <Text
                style={
                  styles.expandTitle
                }
              >
                {INCIDENTS.length} active
                incidents
              </Text>
            </View>

            <Text
              style={
                styles.expandSubtitle
              }
            >
              Tap to view incident
              details
            </Text>
          </View>

          <MaterialCommunityIcons
            name={
              expanded
                ? "chevron-up"
                : "chevron-down"
            }
            size={28}
            color="#17212B"
          />
        </View>
      </TouchableOpacity>

      {/* ===================================================
          SELECTED INCIDENT
      =================================================== */}

      {selected && (
        <View
          style={
            styles.selectedContainer
          }
        >
          <IncidentDetails
            incident={selected}
          />

          <TouchableOpacity
            onPress={() =>
              setSelectedIncident(
                null
              )
            }
            style={
              styles.clearButton
            }
          >
            <Text
              style={
                styles.clearButtonText
              }
            >
              Clear selection
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ===================================================
          INCIDENT LIST
      =================================================== */}

      {expanded && (
        <View
          style={styles.incidentList}
        >
          {INCIDENTS.map(
            (incident) => {
              const config =
                getIncidentConfig(
                  incident.type
                );

              const isSelected =
                selectedIncident ===
                incident.id;

              return (
                <TouchableOpacity
                  key={incident.id}
                  activeOpacity={0.8}
                  onPress={() =>
                    handleIncidentPress(
                      incident
                    )
                  }
                  style={[
                    styles.incidentRow,
                    isSelected &&
                      styles.incidentRowSelected,
                  ]}
                >
                  <View
                    style={[
                      styles.incidentIcon,
                      {
                        backgroundColor:
                          config.background,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={
                        config.icon as any
                      }
                      size={21}
                      color={
                        config.color
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.incidentRowContent
                    }
                  >
                    <Text
                      style={
                        styles.incidentTitle
                      }
                    >
                      {incident.title}
                    </Text>

                    <Text
                      style={
                        styles.incidentLocation
                      }
                    >
                      {incident.location}
                    </Text>

                    <Text
                      style={
                        styles.incidentStatus
                      }
                    >
                      {incident.status}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.incidentRight
                    }
                  >
                    <Text
                      style={
                        styles.incidentTime
                      }
                    >
                      {incident.time}
                    </Text>

                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color="#8A96A3"
                    />
                  </View>
                </TouchableOpacity>
              );
            }
          )}
        </View>
      )}
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  /* =======================================================
     MAP
  ======================================================= */

  mapContainer: {
    width: "100%",

    height:
      width > 700
        ? 430
        : 390,

    borderRadius: 22,

    overflow: "hidden",

    backgroundColor:
      "#DCE5DF",

    borderWidth: 1,

    borderColor:
      "#D1D9DE",

    position: "relative",
  },

  map: {
    width: "100%",
    height: "100%",
  },

  /* =======================================================
     LIVE BADGE
  ======================================================= */

  liveBadge: {
    position: "absolute",

    top: 15,

    left: 15,

    flexDirection: "row",

    alignItems: "center",

    backgroundColor:
      "#FFFFFF",

    paddingHorizontal: 12,

    paddingVertical: 8,

    borderRadius: 20,

    shadowColor: "#000",

    shadowOpacity: 0.12,

    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 4,
  },

  liveDot: {
    width: 8,

    height: 8,

    borderRadius: 4,

    backgroundColor:
      "#B42318",

    marginRight: 7,
  },

  liveText: {
    fontSize: 10,

    fontWeight: "900",

    color: "#17212B",

    letterSpacing: 0.8,
  },

  /* =======================================================
     CONTROLS
  ======================================================= */

  mapControls: {
    position: "absolute",

    right: 14,

    top: 15,

    gap: 7,
  },

  mapButton: {
    width: 38,

    height: 38,

    borderRadius: 10,

    backgroundColor:
      "#FFFFFF",

    alignItems: "center",

    justifyContent:
      "center",

    shadowColor: "#000",

    shadowOpacity: 0.1,

    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  /* =======================================================
     LEGEND
  ======================================================= */

  legend: {
    position: "absolute",

    left: 14,

    bottom: 14,

    backgroundColor:
      "rgba(255,255,255,0.95)",

    paddingHorizontal: 12,

    paddingVertical: 10,

    borderRadius: 13,

    gap: 7,

    shadowColor: "#000",

    shadowOpacity: 0.1,

    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  legendTitle: {
    fontSize: 8,

    fontWeight: "900",

    color: "#17212B",

    letterSpacing: 0.7,

    marginBottom: 1,
  },

  legendItem: {
    flexDirection: "row",

    alignItems: "center",
  },

  legendDot: {
    width: 8,

    height: 8,

    borderRadius: 4,

    marginRight: 7,
  },

  legendText: {
    fontSize: 10,

    fontWeight: "600",

    color: "#4C5965",
  },

  /* =======================================================
     MAP INFO
  ======================================================= */

  mapInfo: {
    position: "absolute",

    right: 14,

    bottom: 15,

    flexDirection: "row",

    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.94)",

    paddingHorizontal: 9,

    paddingVertical: 7,

    borderRadius: 12,

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 4,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  mapInfoText: {
    marginLeft: 5,

    fontSize: 9,

    fontWeight: "800",

    color: "#4C5965",
  },

  /* =======================================================
     EXPAND
  ======================================================= */

  expandButton: {
    marginTop: -1,

    backgroundColor:
      "#FFFFFF",

    borderWidth: 1,

    borderColor:
      "#D9E0E6",

    borderBottomLeftRadius: 20,

    borderBottomRightRadius: 20,

    paddingHorizontal: 18,

    paddingTop: 7,

    paddingBottom: 15,
  },

  expandHandle: {
    width: 38,

    height: 4,

    borderRadius: 3,

    backgroundColor:
      "#CDD4DA",

    alignSelf: "center",

    marginBottom: 10,
  },

  expandContent: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",
  },

  activeTitleRow: {
    flexDirection: "row",

    alignItems: "center",
  },

  activeIndicator: {
    width: 7,

    height: 7,

    borderRadius: 4,

    backgroundColor:
      "#B42318",

    marginRight: 7,
  },

  expandTitle: {
    fontSize: 15,

    fontWeight: "800",

    color: "#17212B",
  },

  expandSubtitle: {
    marginTop: 3,

    fontSize: 11,

    color: "#7A8792",
  },

  /* =======================================================
     SELECTED
  ======================================================= */

  selectedContainer: {
    marginTop: 12,
  },

  detailsCard: {
    backgroundColor:
      "#FFFFFF",

    borderWidth: 1,

    borderColor:
      "#D9E0E6",

    borderRadius: 18,

    padding: 15,

    flexDirection: "row",

    shadowColor: "#000",

    shadowOpacity: 0.05,

    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  detailsIcon: {
    width: 48,

    height: 48,

    borderRadius: 14,

    alignItems: "center",

    justifyContent:
      "center",

    marginRight: 12,
  },

  detailsContent: {
    flex: 1,
  },

  detailsTopRow: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",

    gap: 10,
  },

  detailsTitle: {
    flex: 1,

    fontSize: 15,

    fontWeight: "800",

    color: "#17212B",
  },

  priorityText: {
    fontSize: 9,

    fontWeight: "900",

    letterSpacing: 0.4,
  },

  detailsLocation: {
    marginTop: 3,

    fontSize: 12,

    fontWeight: "600",

    color: "#66737F",
  },

  detailsDescription: {
    marginTop: 8,

    fontSize: 12,

    lineHeight: 18,

    color: "#596673",
  },

  detailsBottom: {
    marginTop: 10,

    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",
  },

  statusRow: {
    flexDirection: "row",

    alignItems: "center",
  },

  statusDot: {
    width: 7,

    height: 7,

    borderRadius: 4,

    marginRight: 6,
  },

  statusText: {
    fontSize: 11,

    fontWeight: "700",

    color: "#4F5C68",
  },

  timeText: {
    fontSize: 10,

    color: "#89949E",
  },

  clearButton: {
    alignSelf: "flex-end",

    marginTop: 7,

    paddingHorizontal: 8,

    paddingVertical: 5,
  },

  clearButtonText: {
    fontSize: 11,

    fontWeight: "700",

    color: "#0B4F8A",
  },

  /* =======================================================
     INCIDENT LIST
  ======================================================= */

  incidentList: {
    marginTop: 12,

    gap: 8,
  },

  incidentRow: {
    backgroundColor:
      "#FFFFFF",

    borderWidth: 1,

    borderColor:
      "#D9E0E6",

    borderRadius: 16,

    padding: 12,

    flexDirection: "row",

    alignItems: "center",
  },

  incidentRowSelected: {
    borderColor:
      "#0B4F8A",

    backgroundColor:
      "#F7FBFF",
  },

  incidentIcon: {
    width: 44,

    height: 44,

    borderRadius: 13,

    alignItems: "center",

    justifyContent:
      "center",

    marginRight: 11,
  },

  incidentRowContent: {
    flex: 1,
  },

  incidentTitle: {
    fontSize: 13,

    fontWeight: "800",

    color: "#17212B",
  },

  incidentLocation: {
    marginTop: 2,

    fontSize: 11,

    color: "#66737F",
  },

  incidentStatus: {
    marginTop: 4,

    fontSize: 10,

    fontWeight: "700",

    color: "#7A8792",
  },

  incidentRight: {
    alignItems: "flex-end",

    justifyContent:
      "center",

    marginLeft: 8,
  },

  incidentTime: {
    fontSize: 9,

    color: "#89949E",

    marginBottom: 5,
  },
});