# Get all last 24h

```json
POST /sensor_readings/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "range": {
            "readingDate": {
              "gte": "now-24h"
            }
          }
        },
        {
          "range": {
            "deltaMovementInMm": {
              "gte": 5
            }
          }
        },
        {
          "match": {
            "status": "ON"
          }
        },
        {
          "range": {
            "readingPlacement.depthInMeter": {
              "gte": 1
            }
          }
        }
      ]
    }
  },
  "size": 0
}
```

# Aggragation of all sensors over threshold

```json
POST /sensor_readings/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "range": {
            "readingDate": {
              "gte": "now-1d"
            }
          }
        },
        {
          "range": {
            "deltaMovementInMm": {
              "gte": 5
            }
          }
        },
        {
          "match": {
            "status": "ON"
          }
        },
        {
          "range": {
            "readingPlacement.depthInMeter": {
              "gte": 1
            }
          }
        }
      ]
    }
  },
  "size": 0,
  "aggs": {
    "sensorsOverThreshold": {
      "nested": {
        "path": "sensor"
      },
      "aggs": {
        "sensorIds": {
          "terms": {
            "field": "sensor.id",
            "size": 500,
            "order": {
              "_count": "desc"
            }
          }
        }
      }
    }
  }
}
```

# Date histogram of one minute intervals (max)

```json
POST /sensor_readings/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "range": {
            "readingDate": {
              "gte": "now-10m"
            }
          }
        },
        {
          "match": {
            "status": "ON"
          }
        },
        {
          "range": {
            "readingPlacement.depthInMeter": {
              "gte": 1
            }
          }
        }
      ]
    }
  },
  "size": 0,
  "aggs": {
    "avg_movement_per_min": {
      "date_histogram": {
        "field": "readingDate",
        "calendar_interval": "1m"
      },
      "aggs": {
        "sales": {
          "max": {
            "field": "deltaMovementInMm"
          }
        }
      }
    }
  }
}
```

## Get all sensors

```
POST /sensor_readings/_search
{
  "size": 0,
  "aggs": {
    "sensorsOverThreshold": {
      "nested": {
        "path": "sensor"
      },
      "aggs": {
        "by_district": {
          "terms": {
            "field": "sensor.id",
            "size": 50
          },
          "aggs": {
            "tops": {
              "top_hits": {
                "sort": [
                  {
                    "readingDate": {
                      "order": "desc"
                    }
                  }
                ],
                "size": 1
              }
            }
          }
        }
      }
    }
  }
}

```
