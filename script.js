document.addEventListener("DOMContentLoaded", function () {
  flatpickr("#dateRange", {
    mode: "range",
    dateFormat: "d-m-Y",
  });

  document.getElementById("grade").addEventListener("change", function () {
    const unitTitleSelect = document.getElementById("unitTitle");
    unitTitleSelect.innerHTML = ""; // Clear existing options

    // Define unit titles and design situations based on the grade selected
    const unitsByGrade = {
      9: [
        {
          title: "Graphic Design",
          situation:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
          title: "Web Development",
          situation: "creating a personal portfolio website.",
        },
      ],
      // Add definitions for other grades as needed
    };

    const units = unitsByGrade[this.value] || [];
    units.forEach((unit) => {
      const option = document.createElement("option");
      option.value = `${unit.title}: ${unit.situation}`;
      option.text = `${unit.title} - ${unit.situation}`;
      unitTitleSelect.appendChild(option);
    });
  });
});

function generatePlan() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let yPos = 20;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 10;
  function addNewPageIfNeeded(yPosition) {
    if (yPosition >= pageHeight - margin) {
      doc.addPage();
      return margin * 2;
    }
    return yPosition;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Weekly Plan", 105, yPos, { align: "center" });
  yPos += 10;

  const idsToTitles = {
    subject: "Subject",
    teacherName: "Teacher Name",
    dateRange: "Date Range",
    weekNumber: "Week Number",
    grade: "Grade",
    unitTitle: "Unit Title and Design Situation",
  };
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  Object.keys(idsToTitles).forEach((id) => {
    let textLines; // Use an array to hold lines that may need wrapping
    const value = document.getElementById(id).value;

    if (id === "unitTitle") {
      const [title, situation] = value.split(": ");
      const titleText = `Unit Title: ${title.trim()}`;
      const situationText = `Design Situation: ${situation.trim()}`;
      // Wrap the situation text as it can be lengthy
      const wrappedSituationText = doc.splitTextToSize(situationText, 180); // Assuming 180mm width for wrapping
      textLines = [titleText, ...wrappedSituationText]; // Combine title and wrapped situation text
    } else {
      textLines = [`${idsToTitles[id]}: ${value}`]; // Other fields are not expected to need wrapping
    }

    // Print each line, adjusting yPos and checking for page need
    textLines.forEach((line) => {
      yPos = addNewPageIfNeeded(yPos);
      doc.text(line, 20, yPos);
      yPos += 7; // Adjust spacing for each line as needed
    });
  });
  // Reset font size and style for session details if needed
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12); // Adjust as per your preference for session titles
  yPos += 5; // Space before sessions

  // Add a separating line before the session details
  doc.setDrawColor(200); // Light grey for a subtle line
  doc.line(10, yPos, 200, yPos);
  yPos += 5;
  const sessionDetails = [
    {
      title: "Session #1",
      details: [
        `${document.getElementById("objective1").value}`,
        ` ${document.getElementById("activities1").value}`,
        ` ${document.getElementById("resources1").value}`,
        ` ${document.getElementById("homework1").value}`,
      ],
    },
    // Include additional sessions as needed
  ];

  sessionDetails.forEach((session) => {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 255); // Blue for session title
    yPos = addNewPageIfNeeded(yPos);
    doc.text(session.title, 20, yPos);
    yPos += 6;

    const detailTitles = [
      "Objective:",
      "Learning Activities:",
      "Resources/Materials:",
      "Homework:",
    ];
    session.details.forEach((detail, index) => {
      yPos = addNewPageIfNeeded(yPos);

      // Apply title styling
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 255); // Blue for detail titles
      doc.text(detailTitles[index], 20, yPos);
      yPos += 5;

      // Reset for detail content
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0);
      let lines = doc.splitTextToSize(detail, 180); // Assuming detail is a string of content
      lines.forEach((line) => {
        yPos = addNewPageIfNeeded(yPos);
        doc.text(line, 22, yPos);
        yPos += 7; // Adjust for content spacing
      });

      yPos += 5; // Space after each detail section
    });

    // Separator line after each session
    yPos = addNewPageIfNeeded(yPos);
    doc.line(10, yPos, 200, yPos);
    yPos += 5;
  });
  doc.save("weekly-plan.pdf");
}
