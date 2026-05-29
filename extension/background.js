// Configure native Side Panel behavior to open on action click
chrome.runtime.onInstalled.addListener(async () => {
  try {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    console.log("CodeDiff Pro: Side Panel behavior successfully initialized.");
  } catch (error) {
    console.error("Failed to configure Side Panel behavior:", error);
  }
});
