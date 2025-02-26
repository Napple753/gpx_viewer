import GeographicLib from "geographiclib";
import type { GPXPoint } from "./types";

export function gpx2jsobj(gpx: string) {
  const parser = new DOMParser();
  const gpxData = parser.parseFromString(gpx, "application/xml");
  const pointDOMs = gpxData.querySelectorAll("trkpt");

  const points: GPXPoint[] = [];
  pointDOMs.forEach((pointDOM) => {
    /* @ts-ignore */
    points.push({
      /* @ts-ignore */
      lat: parseFloat(pointDOM.getAttribute("lat")),
      /* @ts-ignore */
      lng: parseFloat(pointDOM.getAttribute("lon")),
      /* @ts-ignore */
      time: new Date(pointDOM.querySelector("time").textContent).getTime(),
      /* @ts-ignore */
      ele: parseFloat(pointDOM.querySelector("ele").textContent),
      spd: 0,
    });
  });
  points.forEach((point, idx) => {
    if (idx > 0) {
      const prevPoint = points[idx - 1];
      const distance = getDistance(point, prevPoint) || 0;
      const timeDiff = point.time - prevPoint.time;
      point.spd = (distance / timeDiff) * 3600;
    }
  });
  return {
    points,
  };
}

function getDistance(point1: GPXPoint, point2: GPXPoint) {
  const geod = GeographicLib.Geodesic.WGS84;

  const result = geod.Inverse(point1.lat, point1.lng, point2.lat, point2.lng);
  return result.s12;
}
