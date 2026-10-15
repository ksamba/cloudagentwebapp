const button = document.getElementById("call-api");
const result = document.getElementById("api-result");

button.addEventListener("click", async () => {
  button.disabled = true;
  result.textContent = "Calling the server…";

  try {
    const response = await fetch("/api/demo", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`The server returned HTTP ${response.status}.`);
    }
    result.textContent = JSON.stringify(await response.json(), null, 2);
  } catch {
    result.textContent = "Unable to reach the API. Please try again.";
  } finally {
    button.disabled = false;
  }
});
