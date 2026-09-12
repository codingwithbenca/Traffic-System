
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

/*
=========================================================
  WEB ONLY
=========================================================

  IMPORTANT:

  This component intentionally uses Leaflet instead of
  react-native-maps.

  Leaflet is a browser map library and therefore avoids
  the native-only React Native codegen problem.

=========================================================
*/

import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

/* ========================================================
   TYPES
======================================================== */

type RouteType =
  | "fastest"
  | "alternative"
  | "delay";

type Coordinate = [number, number];

type Route = {
  id: string;
  type: RouteType;
  title: string;
  description: string;
  route: string;
  impact: string;
  coordinates: Coordinate[];
};

/* ========================================================
   PRETORIA LOCATIONS
======================================================== */

const PRETORIA_CENTER: Coordinate = [
  -25.7479,
  28.2293,
];

/*
  Starting point around Pretoria CBD.
*/
const START_LOCATION: Coordinate = [
  -25.7461,
  28.1881,
];

/*
  Destination around central/eastern Pretoria.
*/
const DESTINATION: Coordinate = [
  -25.7479,
  28.2293,
];

/* ========================================================
   ROUTES
======================================================== */

const ROUTES: Route[] = [
  {
    id: "fastest",
    type: "fastest",
    title: "Fastest Route",
    description:
      "Recommended route with the lowest estimated travel time.",
    route: "Pretoria CBD → N4 East",
    impact: "12 min faster",

    coordinates: [
      [-25.7461, 28.1881],
      [-25.7449, 28.1920],
      [-25.7437, 28.1965],
      [-25.7425, 28.2010],
      [-25.7417, 28.2056],
      [-25.7425, 28.2100],
      [-25.7440, 28.2145],
      [-25.7454, 28.2190],
      [-25.7470, 28.2238],
      [-25.7479, 28.2293],
    ],
  },

  {
    id: "alternative",
    type: "alternative",
    title: "Alternative Route",
    description:
      "Avoids heavier traffic and uses surrounding roads.",
    route: "CBD → Lynnwood → R21",
    impact: "Lower congestion",

    coordinates: [
      [-25.7461, 28.1881],
      [-25.7490, 28.1920],
      [-25.7525, 28.1965],
      [-25.7550, 28.2015],
      [-25.7570, 28.2070],
      [-25.7560, 28.2120],
      [-25.7530, 28.2170],
      [-25.7500, 28.2215],
      [-25.7479, 28.2293],
    ],
  },

  {
    id: "delay",
    type: "delay",
    title: "N1 North",
    description:
      "Heavy traffic may increase the expected travel time.",
    route: "Pretoria CBD → N1 North",
    impact: "+25 min",

    coordinates: [
      [-25.7461, 28.1881],
      [-25.7420, 28.1855],
      [-25.7375, 28.1830],
      [-25.7325, 28.1810],
      [-25.7270, 28.1795],
      [-25.7215, 28.1780],
      [-25.7160, 28.1768],
      [-25.7100, 28.1755],
      [-25.7040, 28.1740],
    ],
  },
];

/* ========================================================
   ROUTE CONFIG
======================================================== */

const getRouteConfig = (
  type: RouteType
) => {
  switch (type) {
    case "fastest":
      return {
        color: "#18794E",
        background: "#ECFDF3",
        icon: "speedometer",
      };

    case "alternative":
      return {
        color: "#0B4F8A",
        background: "#EAF3FA",
        icon: "map-marker-path",
      };

    case "delay":
      return {
        color: "#B42318",
        background: "#FEF3F2",
        icon: "clock-alert-outline",
      };
  }
};

/* ========================================================
   CUSTOM LEAFLET ICONS
======================================================== */

const createStartIcon = () =>
  L.divIcon({
    className: "trafficconnect-start-marker",

    html: `
      <div
        style="
          width:42px;
          height:42px;
          border-radius:50%;
          background:rgba(11,79,138,0.18);
          display:flex;
          align-items:center;
          justify-content:center;
        "
      >
        <div
          style="
            width:30px;
            height:30px;
            border-radius:50%;
            background:#0B4F8A;
            border:3px solid white;
            box-shadow:0 4px 12px rgba(0,0,0,0.25);
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
      </div>
    `,

    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });

const createDestinationIcon = () =>
  L.divIcon({
    className:
      "trafficconnect-destination-marker",

    html: `
      <div
        style="
          position:relative;
          width:44px;
          height:52px;
          display:flex;
          align-items:center;
          justify-content:center;
        "
      >
        <div
          style="
            width:36px;
            height:36px;
            border-radius:50% 50% 50% 0;
            background:#18794E;
            transform:rotate(-45deg);
            box-shadow:0 4px 12px rgba(0,0,0,0.25);
            display:flex;
            align-items:center;
            justify-content:center;
          "
        >
          <div
            style="
              width:12px;
              height:12px;
              background:white;
              border-radius:50%;
            "
          ></div>
        </div>
      </div>
    `,

    iconSize: [44, 52],
    iconAnchor: [22, 52],
  });

const createVehicleIcon = (
  color: string
) =>
  L.divIcon({
    className:
      "trafficconnect-vehicle-marker",

    html: `
      <div
        style="
          width:32px;
          height:32px;
          border-radius:50%;
          background:white;
          border:3px solid ${color};
          box-shadow:0 3px 10px rgba(0,0,0,0.25);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:15px;
        "
      >
        🚗
      </div>
    `,

    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

/* ========================================================
   MAP CONTROLLER
======================================================== */

function MapController({
  route,
}: {
  route: Route;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !route) return;

    map.fitBounds(
      L.latLngBounds(
        route.coordinates.map(
          ([lat, lng]) =>
            L.latLng(lat, lng)
        )
      ),
      {
        paddingTopLeft: [35, 80],
        paddingBottomRight: [35, 120],
        animate: true,
        duration: 0.8,
      }
    );
  }, [map, route]);

  return null;
}

/* ========================================================
   MAP CLICK HANDLER
======================================================== */

function MapInteraction() {
  useMapEvents({
    click: () => {
      // Reserved for future map interaction.
    },
  });

  return null;
}

/* ========================================================
   ANIMATED VEHICLES
======================================================== */

type Vehicle = {
  id: string;
  routeId: string;
  progress: number;
  speed: number;
};

function AnimatedVehicles({
  routes,
}: {
  routes: Route[];
}) {
  const [vehicles, setVehicles] =
    useState<Vehicle[]>([
      {
        id: "vehicle-1",
        routeId: "fastest",
        progress: 0.18,
        speed: 0.0007,
      },
      {
        id: "vehicle-2",
        routeId: "fastest",
        progress: 0.53,
        speed: 0.00045,
      },
      {
        id: "vehicle-3",
        routeId: "alternative",
        progress: 0.31,
        speed: 0.00055,
      },
      {
        id: "vehicle-4",
        routeId: "delay",
        progress: 0.42,
        speed: 0.0003,
      },
    ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setVehicles((current) =>
        current.map((vehicle) => {
          let next =
            vehicle.progress +
            vehicle.speed;

          if (next >= 1) {
            next = 0;
          }

          return {
            ...vehicle,
            progress: next,
          };
        })
      );
    }, 80);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {vehicles.map((vehicle) => {
        const route = routes.find(
          (item) =>
            item.id === vehicle.routeId
        );

        if (!route) return null;

        const index =
          Math.floor(
            vehicle.progress *
              (route.coordinates.length - 1)
          );

        const nextIndex = Math.min(
          index + 1,
          route.coordinates.length - 1
        );

        const current =
          route.coordinates[index];

        const next =
          route.coordinates[nextIndex];

        const localProgress =
          vehicle.progress *
            (route.coordinates.length - 1) -
          index;

        const latitude =
          current[0] +
          (next[0] - current[0]) *
            localProgress;

        const longitude =
          current[1] +
          (next[1] - current[1]) *
            localProgress;

        const color =
          getRouteConfig(route.type).color;

        return (
          <Marker
            key={vehicle.id}
            position={[latitude, longitude]}
            icon={createVehicleIcon(color)}
          />
        );
      })}
    </>
  );
}

/* ========================================================
   ROUTE CARD
======================================================== */

function RouteCard({
  route,
  selected,
  onPress,
}: {
  route: Route;
  selected: boolean;
  onPress: () => void;
}) {
  const config =
    getRouteConfig(route.type);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.routeCard,
        selected && {
          borderColor: config.color,
          borderWidth: 2,
        },
      ]}
    >
      <View
        style={[
          styles.routeIcon,
          {
            backgroundColor:
              config.background,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={config.icon as any}
          size={21}
          color={config.color}
        />
      </View>

      <View style={styles.routeCardContent}>
        <Text style={styles.routeTitle}>
          {route.title}
        </Text>

        <Text
          style={[
            styles.routePath,
            {
              color: config.color,
            },
          ]}
        >
          {route.route}
        </Text>

        <Text style={styles.routeDescription}>
          {route.description}
        </Text>
      </View>

      <View style={styles.routeImpactContainer}>
        <Text
          style={[
            styles.routeImpact,
            {
              color: config.color,
            },
          ]}
        >
          {route.impact}
        </Text>

        <MaterialCommunityIcons
          name="chevron-right"
          size={19}
          color="#89949E"
        />
      </View>
    </TouchableOpacity>
  );
}

/* ========================================================
   MAIN COMPONENT
======================================================== */

export default function SuggestedRoutes() {
  const [selectedRoute, setSelectedRoute] =
    useState("fastest");

  const [expanded, setExpanded] =
    useState(false);

  const [mapLoaded, setMapLoaded] =
    useState(false);

  const chevronAnimation =
    useRef(new Animated.Value(0))
      .current;

  const selected =
    ROUTES.find(
      (route) =>
        route.id === selectedRoute
    ) ?? ROUTES[0];

  /* ======================================================
     CHEVRON
  ====================================================== */

  useEffect(() => {
    Animated.timing(
      chevronAnimation,
      {
        toValue: expanded ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }
    ).start();
  }, [
    expanded,
    chevronAnimation,
  ]);

  const rotateChevron =
    chevronAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [
        "0deg",
        "180deg",
      ],
    });

  /* ======================================================
     ROUTE SELECT
  ====================================================== */

  const selectRoute = (
    route: Route
  ) => {
    setSelectedRoute(route.id);
  };

  /* ======================================================
     WEB SAFETY
  ====================================================== */

  if (Platform.OS !== "web") {
    return (
      <View style={styles.webOnlyContainer}>
        <MaterialCommunityIcons
          name="web"
          size={38}
          color="#0B4F8A"
        />

        <Text
          style={
            styles.webOnlyTitle
          }
        >
          Web Map
        </Text>

        <Text
          style={
            styles.webOnlyText
          }
        >
          Suggested Routes uses the
          browser-based Leaflet map.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* ==================================================
          REAL LEAFLET MAP
      ================================================== */}

      <View style={styles.mapContainer}>

        <MapContainer
          center={PRETORIA_CENTER}
          zoom={13}
          scrollWheelZoom={true}
          zoomControl={false}
          style={styles.leafletMap}
          whenReady={() => {
            setMapLoaded(true);
          }}
        >

          {/* ==============================================
              OPENSTREETMAP
          ============================================== */}

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ==============================================
              MAP CONTROLLER
          ============================================== */}

          <MapController
            route={selected}
          />

          <MapInteraction />

          {/* ==============================================
              START
          ============================================== */}

          <Marker
            position={START_LOCATION}
            icon={createStartIcon()}
          />

          {/* ==============================================
              DESTINATION
          ============================================== */}

          <Marker
            position={DESTINATION}
            icon={createDestinationIcon()}
          />

          {/* ==============================================
              ROUTES
          ============================================== */}

          {ROUTES.map((route) => {
            const config =
              getRouteConfig(
                route.type
              );

            const isSelected =
              route.id ===
              selectedRoute;

            return (
              <React.Fragment
                key={route.id}
              >

                {/* Shadow / casing */}
                <Polyline
                  positions={
                    route.coordinates
                  }
                  pathOptions={{
                    color: "#FFFFFF",
                    weight:
                      isSelected
                        ? 11
                        : 7,
                    opacity:
                      isSelected
                        ? 0.95
                        : 0.35,
                    lineCap:
                      "round",
                    lineJoin:
                      "round",
                  }}
                />

                {/* Actual route */}
                <Polyline
                  positions={
                    route.coordinates
                  }
                  pathOptions={{
                    color:
                      config.color,
                    weight:
                      isSelected
                        ? 7
                        : 4,
                    opacity:
                      isSelected
                        ? 1
                        : 0.30,
                    lineCap:
                      "round",
                    lineJoin:
                      "round",
                  }}
                  eventHandlers={{
                    click: () =>
                      selectRoute(
                        route
                      ),
                  }}
                />

              </React.Fragment>
            );
          })}

          {/* ==============================================
              MOVING VEHICLES
          ============================================== */}

          <AnimatedVehicles
            routes={ROUTES}
          />

        </MapContainer>

        {/* ==================================================
            MAP BADGE
        ================================================== */}

        <View style={styles.mapBadge}>

          <View
            style={styles.liveDot}
          />

          <Text
            style={styles.mapBadgeText}
          >
            LIVE TRAFFIC MAP
          </Text>

        </View>

        {/* ==================================================
            MAP STATUS
        ================================================== */}

        <View
          style={
            styles.mapStatus
          }
        >
          <MaterialCommunityIcons
            name="map-marker-radius"
            size={15}
            color="#0B4F8A"
          />

          <Text
            style={
              styles.mapStatusText
            }
          >
            Pretoria
          </Text>
        </View>

        {/* ==================================================
            MAP LEGEND
        ================================================== */}

        <View
          style={styles.legend}
        >

          <View
            style={
              styles.legendRow
            }
          >
            <View
              style={[
                styles.legendLine,
                {
                  backgroundColor:
                    "#18794E",
                },
              ]}
            />

            <Text
              style={
                styles.legendText
              }
            >
              Fastest
            </Text>
          </View>

          <View
            style={
              styles.legendRow
            }
          >
            <View
              style={[
                styles.legendLine,
                {
                  backgroundColor:
                    "#0B4F8A",
                },
              ]}
            />

            <Text
              style={
                styles.legendText
              }
            >
              Alternative
            </Text>
          </View>

          <View
            style={
              styles.legendRow
            }
          >
            <View
              style={[
                styles.legendLine,
                {
                  backgroundColor:
                    "#B42318",
                },
              ]}
            />

            <Text
              style={
                styles.legendText
              }
            >
              Delays
            </Text>
          </View>

        </View>

        {/* ==================================================
            MAP LOADING
        ================================================== */}

        {!mapLoaded && (
          <View
            style={
              styles.mapLoading
            }
          >
            <MaterialCommunityIcons
              name="map"
              size={28}
              color="#0B4F8A"
            />

            <Text
              style={
                styles.mapLoadingText
              }
            >
              Loading Pretoria map...
            </Text>
          </View>
        )}

      </View>

      {/* ==================================================
          SUMMARY
      ================================================== */}

      <View
        style={styles.summaryCard}
      >

        <View
          style={styles.summaryLeft}
        >

          <View
            style={[
              styles.summaryIcon,
              {
                backgroundColor:
                  getRouteConfig(
                    selected.type
                  ).background,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="navigation-variant"
              size={21}
              color={
                getRouteConfig(
                  selected.type
                ).color
              }
            />
          </View>

          <View
            style={styles.summaryText}
          >

            <Text
              style={
                styles.summaryTitle
              }
            >
              RECOMMENDED ROUTE
            </Text>

            <Text
              style={
                styles.summaryRoute
              }
              numberOfLines={1}
            >
              {selected.route}
            </Text>

          </View>

        </View>

        <View
          style={[
            styles.summaryImpact,
            {
              backgroundColor:
                getRouteConfig(
                  selected.type
                ).background,
            },
          ]}
        >
          <Text
            style={[
              styles.summaryImpactText,
              {
                color:
                  getRouteConfig(
                    selected.type
                  ).color,
              },
            ]}
          >
            {selected.impact}
          </Text>
        </View>

      </View>

      {/* ==================================================
          EXPAND
      ================================================== */}

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() =>
          setExpanded(
            (value) =>
              !value
          )
        }
        style={[
          styles.expandButton,
          expanded &&
            styles.expandButtonOpen,
        ]}
      >

        <View
          style={
            styles.expandHandle
          }
        />

        <View
          style={
            styles.expandContent
          }
        >

          <View>

            <Text
              style={
                styles.expandTitle
              }
            >
              {ROUTES.length} route
              suggestions
            </Text>

            <Text
              style={
                styles.expandSubtitle
              }
            >
              Tap to compare available
              routes
            </Text>

          </View>

          <Animated.View
            style={{
              transform: [
                {
                  rotate:
                    rotateChevron,
                },
              ],
            }}
          >
            <MaterialCommunityIcons
              name="chevron-down"
              size={28}
              color="#17212B"
            />
          </Animated.View>

        </View>

      </TouchableOpacity>

      {/* ==================================================
          ROUTE LIST
      ================================================== */}

      {expanded && (
        <View
          style={
            styles.routeList
          }
        >

          {ROUTES.map(
            (route) => (
              <RouteCard
                key={route.id}
                route={route}
                selected={
                  route.id ===
                  selectedRoute
                }
                onPress={() =>
                  selectRoute(
                    route
                  )
                }
              />
            )
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
    height: 340,

    borderRadius: 24,

    overflow: "hidden",

    borderWidth: 1,
    borderColor: "#D9E0E6",

    backgroundColor:
      "#E8EDEB",

    position: "relative",
  },

  leafletMap: {
    width: "100%",
    height: "100%",
  },

  /* =======================================================
     MAP BADGE
  ======================================================= */

  mapBadge: {
    position: "absolute",

    top: 14,
    left: 14,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.96)",

    borderRadius: 18,

    paddingHorizontal: 12,
    paddingVertical: 8,

    elevation: 4,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  liveDot: {
    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor:
      "#18794E",

    marginRight: 7,
  },

  mapBadgeText: {
    fontSize: 9,

    fontWeight: "900",

    color: "#17212B",

    letterSpacing: 0.8,
  },

  /* =======================================================
     MAP STATUS
  ======================================================= */

  mapStatus: {
    position: "absolute",

    top: 60,
    left: 14,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.94)",

    borderRadius: 15,

    paddingHorizontal: 10,
    paddingVertical: 7,

    elevation: 3,
  },

  mapStatusText: {
    marginLeft: 6,

    fontSize: 10,

    fontWeight: "800",

    color: "#17212B",
  },

  /* =======================================================
     LEGEND
  ======================================================= */

  legend: {
    position: "absolute",

    bottom: 14,
    right: 14,

    backgroundColor:
      "rgba(255,255,255,0.96)",

    borderRadius: 13,

    paddingHorizontal: 11,
    paddingVertical: 8,

    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 4,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  legendRow: {
    flexDirection: "row",

    alignItems: "center",

    marginVertical: 2,
  },

  legendLine: {
    width: 18,
    height: 4,

    borderRadius: 4,

    marginRight: 7,
  },

  legendText: {
    fontSize: 9,

    fontWeight: "700",

    color: "#56636F",
  },

  /* =======================================================
     LOADING
  ======================================================= */

  mapLoading: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      "rgba(245,248,247,0.92)",
  },

  mapLoadingText: {
    marginTop: 8,

    fontSize: 11,

    fontWeight: "700",

    color: "#56636F",
  },

  /* =======================================================
     SUMMARY
  ======================================================= */

  summaryCard: {
    marginTop: 10,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#D9E0E6",

    borderRadius: 17,

    padding: 13,

    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",

    elevation: 1,
  },

  summaryLeft: {
    flexDirection: "row",

    alignItems: "center",

    flex: 1,
  },

  summaryIcon: {
    width: 42,
    height: 42,

    borderRadius: 12,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,
  },

  summaryText: {
    flex: 1,
  },

  summaryTitle: {
    fontSize: 9,

    fontWeight: "900",

    color: "#18794E",

    letterSpacing: 0.7,
  },

  summaryRoute: {
    marginTop: 3,

    fontSize: 12,

    fontWeight: "800",

    color: "#17212B",
  },

  summaryImpact: {
    marginLeft: 8,

    paddingHorizontal: 9,
    paddingVertical: 6,

    borderRadius: 10,
  },

  summaryImpactText: {
    fontSize: 10,

    fontWeight: "900",
  },

  /* =======================================================
     EXPAND
  ======================================================= */

  expandButton: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#D9E0E6",

    borderBottomLeftRadius: 19,
    borderBottomRightRadius: 19,

    paddingHorizontal: 17,

    paddingTop: 7,
    paddingBottom: 14,
  },

  expandButtonOpen: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  expandHandle: {
    width: 36,
    height: 4,

    borderRadius: 3,

    backgroundColor: "#CDD4DA",

    alignSelf: "center",

    marginBottom: 9,
  },

  expandContent: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",
  },

  expandTitle: {
    fontSize: 14,

    fontWeight: "800",

    color: "#17212B",
  },

  expandSubtitle: {
    marginTop: 3,

    fontSize: 10,

    color: "#7A8792",
  },

  /* =======================================================
     ROUTE LIST
  ======================================================= */

  routeList: {
    marginTop: 10,

    gap: 8,
  },

  routeCard: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#D9E0E6",

    borderRadius: 16,

    padding: 12,

    flexDirection: "row",

    alignItems: "center",
  },

  routeIcon: {
    width: 43,
    height: 43,

    borderRadius: 12,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,
  },

  routeCardContent: {
    flex: 1,
  },

  routeTitle: {
    fontSize: 13,

    fontWeight: "800",

    color: "#17212B",
  },

  routePath: {
    marginTop: 2,

    fontSize: 10,

    fontWeight: "700",
  },

  routeDescription: {
    marginTop: 4,

    fontSize: 10,

    lineHeight: 15,

    color: "#6B7782",
  },

  routeImpactContainer: {
    alignItems: "flex-end",

    justifyContent: "center",

    marginLeft: 7,
  },

  routeImpact: {
    fontSize: 9,

    fontWeight: "900",

    marginBottom: 4,
  },

  /* =======================================================
     WEB ONLY FALLBACK
  ======================================================= */

  webOnlyContainer: {
    width: "100%",

    minHeight: 300,

    borderRadius: 24,

    backgroundColor:
      "#F4F7F8",

    alignItems: "center",

    justifyContent: "center",

    borderWidth: 1,

    borderColor: "#D9E0E6",
  },

  webOnlyTitle: {
    marginTop: 10,

    fontSize: 18,

    fontWeight: "900",

    color: "#17212B",
  },

  webOnlyText: {
    marginTop: 6,

    maxWidth: 300,

    textAlign: "center",

    fontSize: 11,

    lineHeight: 17,

    color: "#6B7782",
  },
});
