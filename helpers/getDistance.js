function toRad(deg) {
  return (deg * Math.PI) / 180;
}

// Distance calculation
export function distanceKm(coord1, coord2) {
  if (!coord1 || !coord2) return null;
  const R = 6371; // rayon de la Terre en km
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);

  const lat1 = toRad(coord1.latitude);
  const lat2 = toRad(coord2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // nombre en km, par ex 1.234567
}

// Distance formatting
export function formatDistance(distanceKm) {
  if (distanceKm == null || Number.isNaN(distanceKm)) return '';
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(2)} km`;
}

// Distance result
export function getDistanceLabel(coord1, coord2) {
  const km = distanceKm(coord1, coord2);
  return formatDistance(km);
}