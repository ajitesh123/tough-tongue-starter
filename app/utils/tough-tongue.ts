/**
 * Generate a Tough Tongue embed URL from a scenario ID
 * @param scenarioId The ID of the Tough Tongue scenario
 * @returns Formatted embed URL
 */
export function getToughTongueEmbedUrl(scenarioId: string): string {
  return `https://app.toughtongueai.com/embed/${scenarioId}?bg=black&skipPrecheck=true`;
}