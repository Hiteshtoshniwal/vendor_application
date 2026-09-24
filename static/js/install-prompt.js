let deferredInstallPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const banner = document.getElementById("installBanner");
  if (banner) {
    banner.style.display = "block";
    banner.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
        <div>
          <b>Install this app</b>
          <div style="color:var(--muted); font-size:0.85rem;">Add Vendor Manager to your home screen for quick, app-like access — free, no app store needed.</div>
        </div>
        <button class="btn btn-primary btn-sm" id="installNowBtn">Install</button>
      </div>
    `;
    document.getElementById("installNowBtn").addEventListener("click", async () => {
      banner.style.display = "none";
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
      }
    });
  }
});

window.addEventListener("appinstalled", () => {
  const banner = document.getElementById("installBanner");
  if (banner) banner.style.display = "none";
  if (typeof toast === "function") toast("App installed!", "success");
});
