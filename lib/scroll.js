export function scrollToContact() {
  document
    .getElementById("contact")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
