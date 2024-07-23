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
  status: "OFF" | "ON" | "ERROR";
  deltaMovementInMm: number;
  readingPlacement: {
    x: number;
    y: number;
    depthInMeter: number;
  };
  sensor: SensorMetadata;
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
];

export function seedData(highLikelyhoodOfThreshold = false): SensorReading[] {
  return TEST_SENSORS.map((sensor) => {
    const movementInMm = randomMovementInMm(highLikelyhoodOfThreshold);
    return {
      status: "ON",
      sensor,
      readingDate: new Date(),
      deltaMovementInMm: movementInMm,
      readingPlacement: {
        ...sensor.placement,
        depthInMeter: sensor.placement.depthInMeter + movementInMm / 1000,
      },
    };
  });
}

const HIGH_PROBABILTY = 0.4;
const NORMAL_PROBABILTY = 0.05;
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
