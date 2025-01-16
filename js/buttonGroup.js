/**
 * Creates a reusable button group with dynamic styling.
 * @param {string} containerId - The ID of the container element.
 * @param {Array} buttons - Array of button objects with `label` and `href`.
 * @param {number} activeIndex - The index of the active button.
 */
function createButtonGroup(containerId, buttons, activeIndex) {
  const container = document.getElementById(containerId);

  // Ensure the container exists
  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }

  // Create the button group div
  const buttonGroup = document.createElement("div");
  buttonGroup.setAttribute('role', 'group');

  const buttonGroupRow = document.createElement("div");
  buttonGroupRow.classList.add("row");

  buttonGroup.classList.add("container-fluid");

  // Generate buttons
  buttons.forEach((button, index) => {
    const buttonGroupCol = document.createElement("div");
    buttonGroupCol.classList.add("col");

    const buttonElement = document.createElement("a");
    buttonElement.setAttribute('href', button.href);
    buttonElement.classList.add("button-56");

    // Add active class if the index matches activeIndex
    if (index === activeIndex) {
      buttonElement.classList.add("active");
      console.log(activeIndex, index)
    }

    // Set button label
    buttonElement.textContent = button.label;

    // Append button to the group
    buttonGroupCol.appendChild(buttonElement); 
    buttonGroupRow.appendChild(buttonGroupCol);
  });

  // Append the button group to the container
  buttonGroup.appendChild(buttonGroupRow)
  container.appendChild(buttonGroup);
}
