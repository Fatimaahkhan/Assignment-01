var selected = 0;

var roleSelected = [];

$(document).ready(function () {
  // Initialize an empty array to store job data
  var jobData = [];

  // Function to fetch job data from data.json
  function fetchJobData() {
    $.getJSON("data.json", function (data) {
      jobData = data;
      displayJobListings(jobData);
    });
  }

  // Function to display job listings
  function displayJobListings(data) {
    const jobListingsContainer = $("#job-listings-container");
    jobListingsContainer.empty();

    data.forEach(function (job) {
      const jobHTML = `
        <div class="list list-${job.id}" data-job-id="${job.id}">
          <div class="image">
            <img src="${job.logo}" alt="${job.company}">
          </div>
          <div class="text-info">
            <p><span class="word1">${job.company}</span>${job.new ? '<span class="new">New!</span>' : ''}${job.featured ? '<span class="featured">Featured</span>' : ''}</p>
            <p class="word2">${job.position}</p>
            <p class="word3"><span class="date">${job.postedAt}</span><span class="time">${job.contract}</span><span class="place">${job.location}</span></p>
          </div>
          <hr>
          <ul>
            <li>${job.role}</li>
            <li>${job.level}</li>
            ${job.languages.map(lang => `<li>${lang}</li>`).join('')}
            ${job.tools.map(tool => `<li>${tool}</li>`).join('')}
          </ul>
          <button class="delete-job-button" data-job-id="${job.id}">Delete</button>
        </div>
      `;

      jobListingsContainer.append(jobHTML);
    });
  }

  // Function to open job details popup
  function openJobDetailsPopup(job) {
    const jobDetailsPopup = $("#job-details-popup");
    jobDetailsPopup.empty();

    const jobHTML = `
      <h2>${job.position}</h2>
      <p>Company: ${job.company}</p>
      <p>Location: ${job.location}</p>
      <p>Description: ${job.description}</p>
      <!-- Add more job details as needed -->
    `;

    jobDetailsPopup.append(jobHTML);
    jobDetailsPopup.show();
  }

  // Event listener for clicking on a job listing
  $(document).on("click", ".list", function () {
    const jobId = $(this).data("job-id");
    const selectedJob = jobData.find(job => job.id === jobId);

    // Display job details in the popup
    openJobDetailsPopup(selectedJob);
  });

  // Event listener for clicking the "+" button to add a new job
  $("#add-job-button").on("click", function () {
    openAddJobPopup();
  });

  // Function to open the "Add Job" popup
  function openAddJobPopup() {
    const jobDetailsPopup = $("#addjob");
    jobDetailsPopup.empty();

    const jobHTML = `
      <h2>Add New Job</h2>
      <input type="text" id="new-job-position" placeholder="Position" required>
      <input type="text" id="new-job-company" placeholder="Company" required>
      <input type="text" id="new-job-location" placeholder="Location" required>
      <textarea id="new-job-description" placeholder="Description " required></textarea>
      
      <button id="save-job-button">Save</button>
    `;

    jobDetailsPopup.append(jobHTML);
    jobDetailsPopup.show();

    // Event listener for clicking the "Save" button to add the new job
    $("#save-job-button").on("click", function () {
      const newPosition = $("#new-job-position").val();
      const newCompany = $("#new-job-company").val();
      const newLocation = $("#new-job-location").val();
      const newDescription = $("#new-job-description").val();

      // Validate input fields here

      // Create a new job object and add it to the jobData array
      const newJob = {
        id: jobData.length + 1,
        position: newPosition,
        company: newCompany,
        location: newLocation,
        description: newDescription,
        // Add more job details here
      };

      jobData.push(newJob);
      jobDetailsPopup.hide();
      displayJobListings(jobData);
    });
  }

  // Event listener for clicking the delete button in a job listing
  $(document).on("click", ".delete-job-button", function () {
    const jobIdToDelete = $(this).data("job-id");

    // Remove the job with jobIdToDelete from the jobData array
    jobData = jobData.filter(job => job.id !== jobIdToDelete);
    displayJobListings(jobData);
  });

  // Initial fetch of job data from data.json
  fetchJobData();
});





function hideListsWithoutRole(role) {
  for (i = 1; i <= 10; i++) {
    var listNo = i.toString();
    var className = ".list.list-" + listNo; 

    var hasRole = false;
    $(className + " li").each(function () {
      if ($(this).text().indexOf(role) !== -1) {
        hasRole = true;
        return false;
      }
    });

    if (!hasRole) {
      $(className).hide();
    } else {
      $(className).show();
    }
  }
}

function unhideListsWithRole() {
  for (j = 1; j <= 10; j++) {
    var listNo = j.toString();
    var className = ".list.list-" + listNo; 

    var listRoles = [];
    $(className + " li").each(function () {
      listRoles.push($(this).text());
    });

    var foundAllItems = true;

    for (i = 0; i < roleSelected.length; i++) {
      if (listRoles.indexOf(roleSelected[i]) === -1) {
        foundAllItems = false;
        break;
      }
    }

    if (foundAllItems) {
      $(className).show();
    } else {
      $(className).hide();
    }
  }
}
// Function to add the selected role on the top box.
$(document).on("click", ".job-listings li", function () {
  var role = $(this).text();

  if (roleSelected.includes(role)) {
    return;
  }

  if (selected === 0) {
    $(".upper-div").addClass("role-selected");
    $(".upper-div ul").append("<li>" + role + "<span>X</span></li>");
    $(".upper-div span").addClass("X");
    selected++;
  } else {
    $(".upper-div ul").append("<li>" + role + "<span>X</span></li>");
    $(".upper-div span").addClass("X");
  }

  roleSelected.push(role);

  hideListsWithoutRole(role);
});

// Function to deselect the selected .
$(document).on("click", ".X", function () {
  var roleWithX = $(this).closest("li").text();
  var role = roleWithX.substring(0, roleWithX.length - 1);
  var index = roleSelected.indexOf(role);

  if (index !== -1) {
    roleSelected.splice(index, 1);
  }

  unhideListsWithRole();

  $(this).closest("li").remove();

  if (roleSelected.length === 0) {
    $(".upper-div").removeClass("role-selected");
  }
});
