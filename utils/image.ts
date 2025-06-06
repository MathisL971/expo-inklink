export function getImageKey(image: string) {
  const parts = new URL(image).pathname.split("/").filter(Boolean);
  return parts.slice(-2).join("/");
}
