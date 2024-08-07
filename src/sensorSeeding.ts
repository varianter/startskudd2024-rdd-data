type SensorMetadata = {
  id: string;
  placement: {
    x: number;
    y: number;
    depthInMeter: number;
  };
};
type SensorReading = {
  // Status can be OFF, ON, or ERROR
  sensorId: string;
  status: "OFF" | "ON" | "ERROR";
  sensor: SensorMetadata;
  deltaMovementInMm?: number;
  readingPlacement?: {
    x: number;
    y: number;
    depthInMeter: number;
  };
  readingDate: Date;
};

/**
 * 20 sesors. Some with depthInMeter over 1, some under. x, y with random values.
 * id also random.
 */
export const TEST_SENSORS: (SensorMetadata & {
  defaultStatus: SensorReading["status"];
})[] = [
  {
    id: "sensor-1",
    defaultStatus: "ON",
    placement: {
      x: 1,
      y: 1,
      depthInMeter: 0.9,
    },
  },
  {
    id: "sensor-2",
    defaultStatus: "ON",
    placement: {
      x: 1,
      y: 2,
      depthInMeter: 1.1,
    },
  },
  {
    id: "sensor-3",
    defaultStatus: "ON",
    placement: {
      x: 2,
      y: 2,
      depthInMeter: 1.0,
    },
  },
  {
    id: "sensor-4",
    defaultStatus: "ON",
    placement: {
      x: 2,
      y: 3,
      depthInMeter: 0.8,
    },
  },
  {
    id: "sensor-5",
    defaultStatus: "ON",
    placement: {
      x: 3,
      y: 1,
      depthInMeter: 1.2,
    },
  },
  {
    id: "sensor-6",
    defaultStatus: "ON",
    placement: {
      x: 4,
      y: 4,
      depthInMeter: 1.3,
    },
  },
  {
    id: "sensor-7",
    defaultStatus: "ON",
    placement: {
      x: 5,
      y: 5,
      depthInMeter: 1.4,
    },
  },
  {
    id: "sensor-8",
    defaultStatus: "ON",
    placement: {
      x: 6,
      y: 6,
      depthInMeter: 1.5,
    },
  },
  {
    id: "sensor-9",
    defaultStatus: "ON",
    placement: {
      x: 7,
      y: 7,
      depthInMeter: 1.1,
    },
  },
  {
    id: "sensor-10",
    defaultStatus: "ON",
    placement: {
      x: 8,
      y: 8,
      depthInMeter: 0.9,
    },
  },
  {
    id: "sensor-11",
    defaultStatus: "ERROR",
    placement: {
      x: 9,
      y: 9,
      depthInMeter: 1.8,
    },
  },
  {
    id: "sensor-12",
    defaultStatus: "ERROR",
    placement: {
      x: 10,
      y: 10,
      depthInMeter: 0.95,
    },
  },
  {
    id: "sensor-13",
    defaultStatus: "ON",
    placement: {
      x: 11,
      y: 11,
      depthInMeter: 2.0,
    },
  },
  {
    id: "sensor-14",
    defaultStatus: "ON",
    placement: {
      x: 12,
      y: 12,
      depthInMeter: 1.1,
    },
  },
  {
    id: "sensor-15",
    defaultStatus: "ON",
    placement: {
      x: 13,
      y: 13,
      depthInMeter: 1.2,
    },
  },
  {
    id: "sensor-16",
    defaultStatus: "ON",
    placement: {
      x: 14,
      y: 14,
      depthInMeter: 1.3,
    },
  },
  {
    id: "sensor-17",
    defaultStatus: "OFF",
    placement: {
      x: 15,
      y: 15,
      depthInMeter: 1.03,
    },
  },
  {
    id: "sensor-18",
    defaultStatus: "ON",
    placement: {
      x: 16,
      y: 16,
      depthInMeter: 1.03,
    },
  },
  {
    id: "sensor-19",
    defaultStatus: "ON",
    placement: {
      x: 17,
      y: 17,
      depthInMeter: 0.999,
    },
  },
  {
    id: "sensor-20",
    defaultStatus: "ON",
    placement: {
      x: 18,
      y: 18,
      depthInMeter: 0.997,
    },
  },
];

export function seedData(
  thresholdLikelyhood: "high" | "low" = "low"
): SensorReading[] {
  return TEST_SENSORS.map((sensor) => {
    const movementInMm = randomMovementInMm(thresholdLikelyhood == "high");

    if (sensor.defaultStatus === "ON") {
      return {
        status: "ON",
        sensorId: sensor.id,
        sensor: {
          id: sensor.id,
          placement: sensor.placement,
        },
        readingDate: new Date(),
        deltaMovementInMm: movementInMm,
        readingPlacement: {
          ...sensor.placement,
          depthInMeter: sensor.placement.depthInMeter + movementInMm / 1000,
        },
      };
    }
    return {
      status: sensor.defaultStatus,
      sensorId: sensor.id,
      sensor: {
        id: sensor.id,
        placement: sensor.placement,
      },
      readingDate: new Date(),
    };
  });
}

const HIGH_PROBABILTY = 0.05;
const NORMAL_PROBABILTY = 0.00005; // 0.05%
/**
 * random movement in mm. The odds for movement of OVER 5 mm should be NORMAL_PROBABILTY%
 * if highLikelyhoodOfThreshold is true the odds should be HIGH_PROBABILTY%
 *
 * @param highLikelyhoodOfThreshold
 */
function randomMovementInMm(highLikelyhoodOfThreshold: boolean): number {
  const probability = highLikelyhoodOfThreshold
    ? HIGH_PROBABILTY
    : NORMAL_PROBABILTY;
  const shouldTriggerThreshold = Math.random() < probability;

  if (!shouldTriggerThreshold) {
    return randomDecimalBetween(0, 4);
  }

  return randomDecimalBetween(5, 10);
}

function randomDecimalBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
