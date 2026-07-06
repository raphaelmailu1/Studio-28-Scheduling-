export function formatToKenyaTime(isoString) {
  if (!isoString) return "Invalid";

  // 🔥 Force proper parsing
  const date = new Date(isoString);

  if (isNaN(date)) {
    console.log("Bad date:", isoString); // DEBUG
    return "Invalid Date";
  }

  return date.toLocaleTimeString("en-KE", {
    timeZone: "Africa/Nairobi",
    hour: "2-digit",
    minute: "2-digit",
  });
}