import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  CurrentWeather,
  DrivingCondition,
  HourlyWeather,
  WeatherData,
  WeatherCondition,
  getDrivingCondition,
  getDrivingConditionLabel,
  getPretoriaWeather,
  getWeatherLabel,
} from "../../services/weatherApi";

// ============================================================
// TYPES
// ============================================================

type AlertType = "rain" | "fog" | "cold";

type WeatherAlert = {
  id: string;
  type: AlertType;
  title: string;
  location: string;
  description: string;
  time: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

// ============================================================
// WEATHER HELPERS
// ============================================================

const getWeatherIcon = (
  condition: WeatherCondition,
  isDay: boolean = true
): keyof typeof MaterialCommunityIcons.glyphMap => {
  switch (condition) {
    case "clear":
      return isDay ? "weather-sunny" : "weather-night";

    case "partly_cloudy":
      return isDay
        ? "weather-partly-cloudy"
        : "weather-night-partly-cloudy";

    case "cloudy":
      return "weather-cloudy";

    case "fog":
      return "weather-fog";

    case "rain":
      return "weather-rainy";

    case "heavy_rain":
      return "weather-pouring";

    case "snow":
      return "weather-snowy";

    case "thunderstorm":
      return "weather-lightning-rainy";

    default:
      return "weather-cloudy";
  }
};

const getVisibilityLabel = (visibility: number) => {
  const kilometres = visibility / 1000;

  if (kilometres >= 10) {
    return "Excellent";
  }

  if (kilometres >= 5) {
    return "Good";
  }

  if (kilometres >= 2) {
    return "Reduced";
  }

  return "Poor";
};

const getDrivingConfig = (condition: DrivingCondition) => {
  switch (condition) {
    case "good":
      return {
        color: "#18794E",
        background: "#EAF7F0",
        icon: "check-circle-outline" as const,
        title: "Good driving conditions",
        description:
          "Weather conditions are currently favourable for motorists.",
      };

    case "fair":
      return {
        color: "#A66A00",
        background: "#FFF6E5",
        icon: "alert-circle-outline" as const,
        title: "Drive with caution",
        description:
          "Weather may affect visibility or road conditions.",
      };

    case "poor":
      return {
        color: "#B42318",
        background: "#FDEDEC",
        icon: "alert-outline" as const,
        title: "Poor driving conditions",
        description:
          "Reduced visibility or heavy rain may increase stopping distance.",
      };

    case "dangerous":
      return {
        color: "#9B1C1C",
        background: "#FBE9E9",
        icon: "weather-lightning-rainy" as const,
        title: "Dangerous driving conditions",
        description:
          "Severe weather may create hazardous conditions for motorists.",
      };

    default:
      return {
        color: "#66737F",
        background: "#F0F2F4",
        icon: "help-circle-outline" as const,
        title: "Conditions unavailable",
        description: "Driving conditions could not be determined.",
      };
  }
};

// ============================================================
// ANIMATED WEATHER BACKGROUND
// ============================================================

function WeatherBackground({
  condition,
}: {
  condition: WeatherCondition;
}) {
  const sunScale = useRef(new Animated.Value(1)).current;
  const cloudOne = useRef(new Animated.Value(0)).current;
  const cloudTwo = useRef(new Animated.Value(0)).current;
  const rainAnimation = useRef(new Animated.Value(0)).current;
  const fogAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sunLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sunScale, {
          toValue: 1.08,
          duration: 1800,
          useNativeDriver: false,
        }),
        Animated.timing(sunScale, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: false,
        }),
      ])
    );

    const cloudLoopOne = Animated.loop(
      Animated.sequence([
        Animated.timing(cloudOne, {
          toValue: 1,
          duration: 7000,
          useNativeDriver: false,
        }),
        Animated.timing(cloudOne, {
          toValue: 0,
          duration: 7000,
          useNativeDriver: false,
        }),
      ])
    );

    const cloudLoopTwo = Animated.loop(
      Animated.sequence([
        Animated.timing(cloudTwo, {
          toValue: 1,
          duration: 9000,
          useNativeDriver: false,
        }),
        Animated.timing(cloudTwo, {
          toValue: 0,
          duration: 9000,
          useNativeDriver: false,
        }),
      ])
    );

    const rainLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(rainAnimation, {
          toValue: 1,
          duration: 900,
          useNativeDriver: false,
        }),
        Animated.timing(rainAnimation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    );

    const fogLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(fogAnimation, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: false,
        }),
        Animated.timing(fogAnimation, {
          toValue: 0,
          duration: 3500,
          useNativeDriver: false,
        }),
      ])
    );

    sunLoop.start();
    cloudLoopOne.start();
    cloudLoopTwo.start();

    if (
      condition === "rain" ||
      condition === "heavy_rain" ||
      condition === "thunderstorm"
    ) {
      rainLoop.start();
    }

    if (condition === "fog") {
      fogLoop.start();
    }

    return () => {
      sunLoop.stop();
      cloudLoopOne.stop();
      cloudLoopTwo.stop();
      rainLoop.stop();
      fogLoop.stop();
    };
  }, [
    condition,
    sunScale,
    cloudOne,
    cloudTwo,
    rainAnimation,
    fogAnimation,
  ]);

  const cloudOneTranslate = cloudOne.interpolate({
    inputRange: [0, 1],
    outputRange: [-15, 35],
  });

  const cloudTwoTranslate = cloudTwo.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -25],
  });

  const rainOpacity = rainAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.9],
  });

  const fogOpacity = fogAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.35],
  });

  const showSun =
    condition === "clear" ||
    condition === "partly_cloudy";

  const showClouds =
    condition === "partly_cloudy" ||
    condition === "cloudy" ||
    condition === "rain" ||
    condition === "heavy_rain" ||
    condition === "thunderstorm";

  const showRain =
    condition === "rain" ||
    condition === "heavy_rain" ||
    condition === "thunderstorm";

  return (
    <View pointerEvents="none" style={styles.weatherBackground}>
      {/* Sky glow */}
      <View style={styles.skyGlow} />

      {/* Animated sun */}
      {showSun && (
        <Animated.View
          style={[
            styles.sunGlow,
            {
              transform: [{ scale: sunScale }],
            },
          ]}
        >
          <MaterialCommunityIcons
            name="weather-sunny"
            size={72}
            color="#F2B84B"
          />
        </Animated.View>
      )}

      {/* Moving clouds */}
      {showClouds && (
        <>
          <Animated.View
            style={[
              styles.cloudOne,
              {
                transform: [{ translateX: cloudOneTranslate }],
              },
            ]}
          >
            <MaterialCommunityIcons
              name="cloud"
              size={75}
              color="rgba(255,255,255,0.72)"
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.cloudTwo,
              {
                transform: [{ translateX: cloudTwoTranslate }],
              },
            ]}
          >
            <MaterialCommunityIcons
              name="cloud"
              size={55}
              color="rgba(255,255,255,0.55)"
            />
          </Animated.View>
        </>
      )}

      {/* Rain */}
      {showRain && (
        <Animated.View
          style={[
            styles.rainLayer,
            {
              opacity: rainOpacity,
            },
          ]}
        >
          {Array.from({ length: 18 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.rainDrop,
                {
                  left: `${(index * 17) % 105}%`,
                  top: `${(index * 23) % 75}%`,
                  height: index % 3 === 0 ? 22 : 15,
                  opacity: 0.25 + (index % 4) * 0.12,
                },
              ]}
            />
          ))}
        </Animated.View>
      )}

      {/* Fog */}
      {condition === "fog" && (
        <Animated.View
          style={[
            styles.fogLayer,
            {
              opacity: fogOpacity,
            },
          ]}
        >
          <View style={styles.fogLineOne} />
          <View style={styles.fogLineTwo} />
          <View style={styles.fogLineThree} />
        </Animated.View>
      )}
    </View>
  );
}

// ============================================================
// ALERT CONFIG
// ============================================================

const getAlertConfig = (type: AlertType) => {
  switch (type) {
    case "rain":
      return {
        color: "#0B4F8A",
        background: "#EAF3FA",
        label: "WEATHER WARNING",
      };

    case "fog":
      return {
        color: "#66737F",
        background: "#F0F2F4",
        label: "VISIBILITY ALERT",
      };

    case "cold":
      return {
        color: "#4C5965",
        background: "#EEF1F3",
        label: "WEATHER UPDATE",
      };
  }
};

// ============================================================
// WEATHER ICON
// ============================================================

function WeatherIcon({
  alert,
}: {
  alert: WeatherAlert;
}) {
  const config = getAlertConfig(alert.type);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[
        styles.alertIcon,
        {
          backgroundColor: config.background,
          transform: [{ scale: pulse }],
        },
      ]}
    >
      <MaterialCommunityIcons
        name={alert.icon}
        size={27}
        color={config.color}
      />
    </Animated.View>
  );
}

// ============================================================
// ALERT CARD
// ============================================================

function AlertCard({
  alert,
  selected,
  onPress,
}: {
  alert: WeatherAlert;
  selected: boolean;
  onPress: () => void;
}) {
  const config = getAlertConfig(alert.type);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.alertCard,
        selected && styles.alertCardSelected,
      ]}
    >
      <WeatherIcon alert={alert} />

      <View style={styles.alertContent}>
        <View style={styles.alertTopRow}>
          <Text style={styles.alertTitle}>
            {alert.title}
          </Text>

          <View
            style={[
              styles.alertBadge,
              {
                backgroundColor: config.background,
              },
            ]}
          >
            <Text
              style={[
                styles.alertBadgeText,
                {
                  color: config.color,
                },
              ]}
            >
              {config.label}
            </Text>
          </View>
        </View>

        <Text style={styles.alertLocation}>
          {alert.location}
        </Text>

        <Text style={styles.alertDescription}>
          {alert.description}
        </Text>

        <Text style={styles.alertTime}>
          {alert.time}
        </Text>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color="#89949E"
      />
    </TouchableOpacity>
  );
}

// ============================================================
// WEATHER STAT
// ============================================================

function WeatherStat({
  icon,
  value,
  label,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.weatherStat}>
      <MaterialCommunityIcons
        name={icon}
        size={16}
        color="#66737F"
      />

      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

// ============================================================
// HOURLY FORECAST
// ============================================================

function HourlyForecast({
  hourly,
}: {
  hourly: HourlyWeather[];
}) {
  const forecast = hourly.slice(0, 8);

  return (
    <View style={styles.forecastCard}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            Today's forecast
          </Text>

          <Text style={styles.sectionSubtitle}>
            Hourly conditions
          </Text>
        </View>

        <MaterialCommunityIcons
          name="clock-outline"
          size={20}
          color="#0B4F8A"
        />
      </View>

      <View style={styles.hourlyRow}>
        {forecast.map((item, index) => {
          const date = new Date(item.time);

          const timeLabel =
            index === 0
              ? "Now"
              : date.toLocaleTimeString("en-ZA", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });

          return (
            <View
              key={`${item.time}-${index}`}
              style={[
                styles.hourItem,
                index === 0 && styles.hourItemActive,
              ]}
            >
              <Text
                style={[
                  styles.hourTime,
                  index === 0 && styles.hourTimeActive,
                ]}
              >
                {timeLabel}
              </Text>

              <MaterialCommunityIcons
                name={getWeatherIcon(item.condition)}
                size={23}
                color={
                  index === 0
                    ? "#0B4F8A"
                    : "#66737F"
                }
              />

              <Text style={styles.hourTemperature}>
                {Math.round(item.temperature)}°
              </Text>

              {item.precipitationProbability > 0 && (
                <View style={styles.rainProbability}>
                  <MaterialCommunityIcons
                    name="water"
                    size={10}
                    color="#0B4F8A"
                  />

                  <Text style={styles.rainProbabilityText}>
                    {item.precipitationProbability}%
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ============================================================
// DRIVING CONDITIONS
// ============================================================

function DrivingConditions({
  weather,
}: {
  weather: CurrentWeather;
}) {
  const drivingCondition =
    getDrivingCondition(weather);

  const config =
    getDrivingConfig(drivingCondition);

  return (
    <View style={styles.drivingCard}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            Driving conditions
          </Text>

          <Text style={styles.sectionSubtitle}>
            Based on current weather
          </Text>
        </View>

        <MaterialCommunityIcons
          name="car-connected"
          size={21}
          color="#0B4F8A"
        />
      </View>

      <View
        style={[
          styles.drivingStatus,
          {
            backgroundColor: config.background,
          },
        ]}
      >
        <View
          style={[
            styles.drivingIcon,
            {
              backgroundColor: config.color,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={config.icon}
            size={21}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.drivingText}>
          <Text
            style={[
              styles.drivingTitle,
              {
                color: config.color,
              },
            ]}
          >
            {getDrivingConditionLabel(
              drivingCondition
            )}
          </Text>

          <Text style={styles.drivingDescription}>
            {config.description}
          </Text>
        </View>
      </View>

      <View style={styles.drivingStats}>
        <DrivingStat
          icon="water-outline"
          label="Rain"
          value={`${weather.rain.toFixed(1)} mm`}
        />

        <DrivingStat
          icon="eye-outline"
          label="Visibility"
          value={getVisibilityLabel(
            weather.visibility
          )}
        />

        <DrivingStat
          icon="weather-windy"
          label="Wind"
          value={`${Math.round(
            weather.windSpeed
          )} km/h`}
        />
      </View>
    </View>
  );
}

function DrivingStat({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.drivingStat}>
      <MaterialCommunityIcons
        name={icon}
        size={17}
        color="#66737F"
      />

      <View style={styles.drivingStatText}>
        <Text style={styles.drivingStatLabel}>
          {label}
        </Text>

        <Text style={styles.drivingStatValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function WeatherAlerts() {
  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [selectedAlert, setSelectedAlert] =
    useState<string | null>(null);

  const [expanded, setExpanded] =
    useState(false);

  const chevronAnimation = useRef(
    new Animated.Value(0)
  ).current;

  const statusPulse = useRef(
    new Animated.Value(1)
  ).current;

  // ==========================================================
  // FETCH WEATHER
  // ==========================================================

  const loadWeather = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const result =
        await getPretoriaWeather();

      setWeather(result);
    } catch (err) {
      console.error(
        "Weather API error:",
        err
      );

      setError(
        "Unable to load live weather data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadWeather();
  }, []);

  // ==========================================================
  // REFRESH WEATHER EVERY 10 MINUTES
  // ==========================================================

  useEffect(() => {
    const interval = setInterval(() => {
      loadWeather(true);
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================================
  // CHEVRON ANIMATION
  // ==========================================================

  useEffect(() => {
    Animated.timing(chevronAnimation, {
      toValue: expanded ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [
    expanded,
    chevronAnimation,
  ]);

  const rotateChevron =
    chevronAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"],
    });

  // ==========================================================
  // STATUS ANIMATION
  // ==========================================================

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(statusPulse, {
          toValue: 0.45,
          duration: 900,
          useNativeDriver: false,
        }),
        Animated.timing(statusPulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [statusPulse]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading && !weather) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <MaterialCommunityIcons
            name="weather-partly-cloudy"
            size={42}
            color="#0B4F8A"
          />

          <ActivityIndicator
            size="small"
            color="#0B4F8A"
            style={styles.loadingSpinner}
          />

          <Text style={styles.loadingTitle}>
            Loading weather
          </Text>

          <Text style={styles.loadingText}>
            Getting current Pretoria conditions...
          </Text>
        </View>
      </View>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error && !weather) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <View style={styles.errorIcon}>
            <MaterialCommunityIcons
              name="cloud-alert-outline"
              size={34}
              color="#B42318"
            />
          </View>

          <Text style={styles.errorTitle}>
            Weather unavailable
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => loadWeather()}
            style={styles.retryButton}
          >
            <MaterialCommunityIcons
              name="refresh"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.retryText}>
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!weather) {
    return null;
  }

  const current = weather.current;

  const drivingCondition =
    getDrivingCondition(current);

  const drivingConfig =
    getDrivingConfig(drivingCondition);

  // ==========================================================
  // DYNAMIC ALERTS
  // ==========================================================

  const dynamicAlerts: WeatherAlert[] = [];

  if (
    current.condition === "rain" ||
    current.condition === "heavy_rain"
  ) {
    dynamicAlerts.push({
      id: "rain",
      type: "rain",
      title:
        current.condition === "heavy_rain"
          ? "Heavy Rain Detected"
          : "Rain Detected",
      location: "Pretoria",
      description:
        "Rain may reduce visibility and increase stopping distance.",
      time: "Live weather data",
      icon:
        current.condition === "heavy_rain"
          ? "weather-pouring"
          : "weather-rainy",
    });
  }

  if (current.condition === "fog") {
    dynamicAlerts.push({
      id: "fog",
      type: "fog",
      title: "Reduced Visibility",
      location: "Pretoria",
      description:
        "Foggy conditions may affect motorists. Use headlights and reduce speed.",
      time: "Live weather data",
      icon: "weather-fog",
    });
  }

  if (current.condition === "thunderstorm") {
    dynamicAlerts.push({
      id: "storm",
      type: "rain",
      title: "Thunderstorm Activity",
      location: "Pretoria",
      description:
        "Thunderstorms may create hazardous driving conditions.",
      time: "Live weather data",
      icon: "weather-lightning-rainy",
    });
  }

  if (current.temperature <= 10) {
    dynamicAlerts.push({
      id: "cold",
      type: "cold",
      title: "Cold Conditions",
      location: "Pretoria",
      description:
        "Cold weather may affect driving comfort during the current period.",
      time: "Live weather data",
      icon: "snowflake",
    });
  }

  const weatherIcon = getWeatherIcon(
    current.condition,
    current.isDay
  );

  const conditionLabel =
    getWeatherLabel(current.condition);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <View style={styles.container}>
      {/* ====================================================
          LIVE WEATHER HERO
      ==================================================== */}

      <View style={styles.weatherOverview}>
        <WeatherBackground
          condition={current.condition}
        />

        <View style={styles.heroContent}>
          <View style={styles.heroTopRow}>
            <View style={styles.weatherMain}>
              <View style={styles.mainWeatherIcon}>
                <MaterialCommunityIcons
                  name={weatherIcon}
                  size={54}
                  color="#0B4F8A"
                />
              </View>

              <View style={styles.temperatureContainer}>
                <Text style={styles.temperature}>
                  {Math.round(
                    current.temperature
                  )}
                  °
                </Text>

                <Text style={styles.condition}>
                  {conditionLabel}
                </Text>

                <Text style={styles.feelsLike}>
                  Feels like{" "}
                  {Math.round(
                    current.apparentTemperature
                  )}
                  °
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => loadWeather(true)}
              style={styles.refreshButton}
            >
              {refreshing ? (
                <ActivityIndicator
                  size="small"
                  color="#0B4F8A"
                />
              ) : (
                <MaterialCommunityIcons
                  name="refresh"
                  size={20}
                  color="#0B4F8A"
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.weatherLocation}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={16}
              color="#66737F"
            />

            <Text style={styles.locationText}>
              Pretoria, Gauteng
            </Text>

            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />

              <Text style={styles.liveBadgeText}>
                LIVE
              </Text>
            </View>
          </View>

          <View style={styles.weatherStats}>
            <WeatherStat
              icon="water-outline"
              value={`${current.humidity}%`}
              label="Humidity"
            />

            <WeatherStat
              icon="weather-windy"
              value={`${Math.round(
                current.windSpeed
              )} km/h`}
              label="Wind"
            />

            <WeatherStat
              icon="eye-outline"
              value={getVisibilityLabel(
                current.visibility
              )}
              label="Visibility"
            />

            <WeatherStat
              icon="weather-rainy"
              value={`${current.precipitation.toFixed(
                1
              )} mm`}
              label="Rain"
            />
          </View>
        </View>
      </View>

      {/* ====================================================
          MONITORING STATUS
      ==================================================== */}

      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <Animated.View
            style={[
              styles.statusDot,
              {
                opacity: statusPulse,
              },
            ]}
          />

          <View>
            <Text style={styles.statusTitle}>
              Weather monitoring active
            </Text>

            <Text style={styles.statusSubtitle}>
              Live Pretoria weather conditions
            </Text>
          </View>
        </View>

        <MaterialCommunityIcons
          name="weather-cloudy-clock"
          size={21}
          color="#0B4F8A"
        />
      </View>

      {/* ====================================================
          DRIVING CONDITIONS
      ==================================================== */}

      <DrivingConditions weather={current} />

      {/* ====================================================
          HOURLY FORECAST
      ==================================================== */}

      <HourlyForecast
        hourly={weather.hourly}
      />

      {/* ====================================================
          ALERT SUMMARY
      ==================================================== */}

      <View
        style={[
          styles.alertSummary,
          {
            backgroundColor:
              drivingConfig.background,
          },
        ]}
      >
        <View
          style={[
            styles.alertSummaryIcon,
            {
              backgroundColor:
                drivingConfig.color,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={drivingConfig.icon}
            size={18}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.alertSummaryText}>
          <Text
            style={[
              styles.alertSummaryTitle,
              {
                color: drivingConfig.color,
              },
            ]}
          >
            {drivingConfig.title}
          </Text>

          <Text style={styles.alertSummaryDescription}>
            {dynamicAlerts.length > 0
              ? `${dynamicAlerts.length} weather ${
                  dynamicAlerts.length === 1
                    ? "alert"
                    : "alerts"
                } detected`
              : "No significant weather alerts detected"}
          </Text>
        </View>
      </View>

      {/* ====================================================
          SELECTED ALERT
      ==================================================== */}

      {selectedAlert && (
        <View style={styles.selectedAlert}>
          <View style={styles.selectedHeader}>
            <Text style={styles.selectedTitle}>
              {
                dynamicAlerts.find(
                  (alert) =>
                    alert.id === selectedAlert
                )?.title
              }
            </Text>

            <TouchableOpacity
              onPress={() =>
                setSelectedAlert(null)
              }
            >
              <MaterialCommunityIcons
                name="close"
                size={19}
                color="#66737F"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.selectedLocation}>
            {
              dynamicAlerts.find(
                (alert) =>
                  alert.id === selectedAlert
              )?.location
            }
          </Text>

          <Text style={styles.selectedDescription}>
            {
              dynamicAlerts.find(
                (alert) =>
                  alert.id === selectedAlert
              )?.description
            }
          </Text>

          <Text style={styles.selectedTime}>
            Live weather data
          </Text>
        </View>
      )}

      {/* ====================================================
          EXPAND BUTTON
      ==================================================== */}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          setExpanded((value) => !value)
        }
        style={styles.expandButton}
      >
        <View style={styles.expandHandle} />

        <View style={styles.expandContent}>
          <View>
            <Text style={styles.expandTitle}>
              Weather alerts
            </Text>

            <Text style={styles.expandSubtitle}>
              {dynamicAlerts.length > 0
                ? "Tap to view current alerts"
                : "No significant alerts right now"}
            </Text>
          </View>

          <Animated.View
            style={{
              transform: [
                {
                  rotate: rotateChevron,
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

      {/* ====================================================
          ALERT LIST
      ==================================================== */}

      {expanded && (
        <View style={styles.alertList}>
          {dynamicAlerts.length === 0 ? (
            <View style={styles.noAlerts}>
              <MaterialCommunityIcons
                name="weather-sunny"
                size={32}
                color="#18794E"
              />

              <Text style={styles.noAlertsTitle}>
                All clear
              </Text>

              <Text style={styles.noAlertsText}>
                No significant weather alerts are
                currently affecting Pretoria.
              </Text>
            </View>
          ) : (
            dynamicAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                selected={
                  alert.id === selectedAlert
                }
                onPress={() =>
                  setSelectedAlert(alert.id)
                }
              />
            ))
          )}
        </View>
      )}

      {/* ====================================================
          DATA SOURCE
      ==================================================== */}

      <View style={styles.dataSource}>
        <MaterialCommunityIcons
          name="database-check-outline"
          size={14}
          color="#89949E"
        />

        <Text style={styles.dataSourceText}>
          Weather data updated{" "}
          {new Date(
            weather.fetchedAt
          ).toLocaleTimeString("en-ZA", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </Text>
      </View>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  // ==========================================================
  // LOADING
  // ==========================================================

  loadingContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 35,
  },

  loadingCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9E0E6",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
  },

  loadingSpinner: {
    marginTop: 12,
  },

  loadingTitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "800",
    color: "#17212B",
  },

  loadingText: {
    marginTop: 4,
    fontSize: 10,
    color: "#89949E",
    textAlign: "center",
  },

  // ==========================================================
  // ERROR
  // ==========================================================

  errorContainer: {
    width: "100%",
    paddingVertical: 15,
  },

  errorCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5C8C6",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },

  errorIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: "#FDEDEC",
    alignItems: "center",
    justifyContent: "center",
  },

  errorTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "800",
    color: "#17212B",
  },

  errorText: {
    marginTop: 5,
    fontSize: 10,
    color: "#66737F",
    textAlign: "center",
    lineHeight: 15,
  },

  retryButton: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B4F8A",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },

  retryText: {
    marginLeft: 6,
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  // ==========================================================
  // WEATHER HERO
  // ==========================================================

  weatherOverview: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9E0E6",
    borderRadius: 20,
    padding: 16,
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
  },

  heroTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  weatherMain: {
    flexDirection: "row",
    alignItems: "center",
  },

  mainWeatherIcon: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: "rgba(234,243,250,0.88)",
    alignItems: "center",
    justifyContent: "center",
  },

  temperatureContainer: {
    marginLeft: 12,
  },

  temperature: {
    fontSize: 40,
    lineHeight: 43,
    fontWeight: "800",
    color: "#17212B",
  },

  condition: {
    marginTop: 1,
    fontSize: 11,
    fontWeight: "700",
    color: "#66737F",
  },

  feelsLike: {
    marginTop: 3,
    fontSize: 9,
    color: "#89949E",
  },

  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(234,243,250,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },

  weatherLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  locationText: {
    marginLeft: 5,
    fontSize: 11,
    fontWeight: "700",
    color: "#66737F",
  },

  liveBadge: {
    marginLeft: 9,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: "#EAF7F0",
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#18794E",
    marginRight: 4,
  },

  liveBadgeText: {
    fontSize: 7,
    fontWeight: "900",
    color: "#18794E",
    letterSpacing: 0.4,
  },

  weatherStats: {
    flexDirection: "row",
    marginTop: 15,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: "#EEF1F3",
  },

  weatherStat: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: "800",
    color: "#17212B",
  },

  statLabel: {
    marginTop: 2,
    fontSize: 8,
    color: "#89949E",
  },

  // ==========================================================
  // ANIMATED BACKGROUND
  // ==========================================================

  weatherBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },

  skyGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    right: -75,
    top: -85,
    backgroundColor: "rgba(234,243,250,0.65)",
  },

  sunGlow: {
    position: "absolute",
    right: 22,
    top: 18,
    opacity: 0.25,
  },

  cloudOne: {
    position: "absolute",
    right: 45,
    top: 35,
    opacity: 0.6,
  },

  cloudTwo: {
    position: "absolute",
    right: 5,
    top: 75,
    opacity: 0.45,
  },

  rainLayer: {
    ...StyleSheet.absoluteFillObject,
  },

  rainDrop: {
    position: "absolute",
    width: 2,
    borderRadius: 2,
    backgroundColor: "#5D9AC7",
    transform: [
      {
        rotate: "14deg",
      },
    ],
  },

  fogLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
  },

  fogLineOne: {
    width: "75%",
    height: 13,
    borderRadius: 10,
    backgroundColor: "#B9C3CA",
    marginBottom: 10,
  },

  fogLineTwo: {
    width: "92%",
    height: 10,
    borderRadius: 10,
    backgroundColor: "#CBD2D7",
    marginBottom: 10,
    alignSelf: "flex-end",
  },

  fogLineThree: {
    width: "65%",
    height: 8,
    borderRadius: 10,
    backgroundColor: "#D5DBDF",
  },

  // ==========================================================
  // STATUS
  // ==========================================================

  statusBar: {
    marginTop: 9,
    backgroundColor: "#EAF3FA",
    borderWidth: 1,
    borderColor: "#C7DDED",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#18794E",
    marginRight: 8,
  },

  statusTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#17212B",
  },

  statusSubtitle: {
    marginTop: 2,
    fontSize: 9,
    color: "#66737F",
  },

  // ==========================================================
  // DRIVING CONDITIONS
  // ==========================================================

  drivingCard: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9E0E6",
    borderRadius: 18,
    padding: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#17212B",
  },

  sectionSubtitle: {
    marginTop: 2,
    fontSize: 9,
    color: "#89949E",
  },

  drivingStatus: {
    marginTop: 12,
    borderRadius: 14,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  drivingIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  drivingText: {
    flex: 1,
    marginLeft: 10,
  },

  drivingTitle: {
    fontSize: 11,
    fontWeight: "900",
  },

  drivingDescription: {
    marginTop: 3,
    fontSize: 9,
    lineHeight: 14,
    color: "#66737F",
  },

  drivingStats: {
    flexDirection: "row",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEF1F3",
  },

  drivingStat: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  drivingStatText: {
    marginLeft: 5,
  },

  drivingStatLabel: {
    fontSize: 7,
    color: "#89949E",
  },

  drivingStatValue: {
    marginTop: 1,
    fontSize: 9,
    fontWeight: "800",
    color: "#17212B",
  },

  // ==========================================================
  // HOURLY FORECAST
  // ==========================================================

  forecastCard: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9E0E6",
    borderRadius: 18,
    padding: 14,
  },

  hourlyRow: {
    flexDirection: "row",
    marginTop: 14,
    overflow: "hidden",
  },

  hourItem: {
    flex: 1,
    minWidth: 50,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 12,
  },

  hourItemActive: {
    backgroundColor: "#EAF3FA",
  },

  hourTime: {
    fontSize: 8,
    fontWeight: "700",
    color: "#89949E",
    marginBottom: 7,
  },

  hourTimeActive: {
    color: "#0B4F8A",
  },

  hourTemperature: {
    marginTop: 5,
    fontSize: 10,
    fontWeight: "800",
    color: "#17212B",
  },

  rainProbability: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  rainProbabilityText: {
    marginLeft: 2,
    fontSize: 7,
    color: "#0B4F8A",
    fontWeight: "700",
  },

  // ==========================================================
  // ALERT SUMMARY
  // ==========================================================

  alertSummary: {
    marginTop: 10,
    borderRadius: 15,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
  },

  alertSummaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  alertSummaryText: {
    flex: 1,
    marginLeft: 9,
  },

  alertSummaryTitle: {
    fontSize: 11,
    fontWeight: "900",
  },

  alertSummaryDescription: {
    marginTop: 2,
    fontSize: 9,
    color: "#66737F",
  },

  // ==========================================================
  // SELECTED ALERT
  // ==========================================================

  selectedAlert: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#0B4F8A",
    borderRadius: 16,
    padding: 13,
  },

  selectedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#17212B",
  },

  selectedLocation: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: "700",
    color: "#0B4F8A",
  },

  selectedDescription: {
    marginTop: 8,
    fontSize: 10,
    lineHeight: 15,
    color: "#66737F",
  },

  selectedTime: {
    marginTop: 8,
    fontSize: 9,
    color: "#89949E",
  },

  // ==========================================================
  // EXPAND
  // ==========================================================

  expandButton: {
    marginTop: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9E0E6",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 7,
    paddingBottom: 14,
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
    justifyContent: "space-between",
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

  // ==========================================================
  // ALERT LIST
  // ==========================================================

  alertList: {
    marginTop: 10,
    gap: 8,
  },

  alertCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9E0E6",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  alertCardSelected: {
    borderColor: "#0B4F8A",
  },

  alertIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  alertContent: {
    flex: 1,
    marginRight: 7,
  },

  alertTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  alertTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    color: "#17212B",
    marginRight: 6,
  },

  alertBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },

  alertBadgeText: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.3,
  },

  alertLocation: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: "700",
    color: "#0B4F8A",
  },

  alertDescription: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 15,
    color: "#66737F",
  },

  alertTime: {
    marginTop: 5,
    fontSize: 8,
    color: "#89949E",
  },

  // ==========================================================
  // NO ALERTS
  // ==========================================================

  noAlerts: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9E0E6",
    borderRadius: 16,
    padding: 22,
    alignItems: "center",
  },

  noAlertsTitle: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "800",
    color: "#17212B",
  },

  noAlertsText: {
    marginTop: 4,
    maxWidth: 280,
    textAlign: "center",
    fontSize: 9,
    lineHeight: 14,
    color: "#89949E",
  },

  // ==========================================================
  // DATA SOURCE
  // ==========================================================

  dataSource: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  dataSourceText: {
    marginLeft: 4,
    fontSize: 8,
    color: "#89949E",
  },
});