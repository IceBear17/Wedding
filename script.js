document.addEventListener("DOMContentLoaded", () => {
    const stamp = document.getElementById("waxStamp");
    const wrapper = document.getElementById("envelopeWrapper");

    stamp.addEventListener("click", () => {
        // Adds the open class triggering all synchronized CSS transitions
        wrapper.classList.add("is-open");
    });
    
    // Optional: support simple touch events seamlessly
    stamp.addEventListener("touchstart", (e) => {
        e.preventDefault(); // prevents double-firing with click handles
        wrapper.classList.add("is-open");
    });
});