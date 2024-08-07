POST /sensor_readings/\_search
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

POST /sensor_readings/\_search
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
"\_count": "desc"
}
}
}
}
}
}
}

POST /sensor_readings/\_search
{
"size": 0,
"query": {
"range": {
"readingDate": {
"gte": "now-10m"
}
}
},
"aggs": {
"max_movement_per_min": {
"date_histogram": {
"field": "readingDate",
"fixed_interval": "1m",
"time_zone": "Europe/Oslo",
"extended_bounds": {
"min": "now-10m",
"max": "now"
}
},
"aggs": {
"max_reading": {
"max": {
"field": "deltaMovementInMm"
}
}
}
}
}
}

POST /sensor_readings/\_search
{
"size": 0,
"aggs": {
"top_tags": {
"terms": {
"field": "sensorId",
"size": 100
},
"aggs": {
"top_sales_hits": {
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

GET /sensor_readings/\_search?q=\*
