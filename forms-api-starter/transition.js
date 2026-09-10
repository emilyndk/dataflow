// Udleveret pynt: API-kald skal være afsluttet, før denne funktion kaldes.
// Afvent DOM-opdateringen, ikke selve animationen.
export async function transition(update) {
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return update();
  }
  const viewTransition = document.startViewTransition(update);
  // En sprunget animation må ikke forhindre DOM-opdateringen.
  viewTransition.ready.catch(() => {});
  return viewTransition.updateCallbackDone;
}
