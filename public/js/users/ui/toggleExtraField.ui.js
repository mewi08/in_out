export function setupToggleExtraField(selectId, extraId, triggerValue = "otro") {
    const select = document.getElementById(selectId);
    const extra = document.getElementById(extraId);

    if (!select || !extra) return;

    select.addEventListener("change", () => {
        if (select.value === triggerValue) {
            extra.classList.add("active");
        } else {
            extra.classList.remove("active");
        }
    });
}