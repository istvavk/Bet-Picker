export function normalizeTeamName(name: string): string {
  if (!name) {
    console.error('Received undefined or empty team name');
    return '';
  }
  return name
    .replace(/^\s+|\s+$/g, '')  // Trim leading/trailing whitespace
    .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
    .replace(/[^a-zA-Z0-9\s]/g, '')  // Remove non-alphanumeric characters
    //.toLowerCase(); // Ensure all names are in lowercase for consistent comparison
}
