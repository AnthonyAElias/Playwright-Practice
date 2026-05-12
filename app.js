const SESSION_KEY = "pw-practice-session";
const REMEMBER_KEY = "pw-practice-remember";
const VALID_EMAIL = "demo@example.com";
const VALID_PASSWORD = "playwright";
const PERSON_RECORDS_KEY = "pw-practice-person-records";

const app = document.querySelector("[data-testid='app-shell']");
const loginTemplate = document.querySelector("#login-template");
const homeTemplate = document.querySelector("#home-template");

const tasks = [
  {
    id: "seed-login",
    title: "Write login happy path",
    detail: "Assert redirect, heading text, and persisted session state.",
    done: false,
  },
  {
    id: "check-errors",
    title: "Check validation errors",
    detail: "Submit invalid credentials and verify inline error copy.",
    done: false,
  },
  {
    id: "filter-tasks",
    title: "Filter task list",
    detail: "Search by keyword and assert the empty state appears.",
    done: false,
  },
  {
    id: "save-settings",
    title: "Save settings form",
    detail: "Change inputs, submit the form, and expect a toast.",
    done: false,
  },
];

function loadPersonRecords() {
  try {
    return JSON.parse(localStorage.getItem(PERSON_RECORDS_KEY) || "[]");
  } catch {
    return [];
  }
}

function savePersonRecords(records) {
  localStorage.setItem(PERSON_RECORDS_KEY, JSON.stringify(records));
}

function render() {
  const isLoggedIn = localStorage.getItem(SESSION_KEY) === "active";
  app.replaceChildren((isLoggedIn ? homeTemplate : loginTemplate).content.cloneNode(true));

  if (isLoggedIn) {
    hydrateHome();
  } else {
    hydrateLogin();
  }
}

function hydrateLogin() {
  const form = document.querySelector("[data-testid='login-form']");
  const email = document.querySelector("[data-testid='email-input']");
  const password = document.querySelector("[data-testid='password-input']");
  const submitButton = document.querySelector("[data-testid='login-button']");
  const remember = document.querySelector("[data-testid='remember-checkbox']");
  const alert = document.querySelector("[data-testid='login-alert']");
  const togglePassword = document.querySelector("[data-testid='toggle-password']");
  const rememberedEmail = localStorage.getItem(REMEMBER_KEY);

  if (rememberedEmail) {
    email.value = rememberedEmail;
    remember.checked = true;
  }

  const updateSubmitState = () => {
    submitButton.disabled = email.value.trim() === "" || password.value.trim() === "";
  };

  const clearErrors = () => {
    document.querySelector("[data-testid='email-error']").textContent = "";
    document.querySelector("[data-testid='password-error']").textContent = "";
    alert.hidden = true;
    alert.textContent = "";
  };

  email.addEventListener("input", () => {
    clearErrors();
    updateSubmitState();
  });

  password.addEventListener("input", () => {
    clearErrors();
    updateSubmitState();
  });

  togglePassword.addEventListener("click", () => {
    const isHidden = password.type === "password";
    password.type = isHidden ? "text" : "password";
    togglePassword.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    let hasError = false;

    if (!emailValue.includes("@")) {
      document.querySelector("[data-testid='email-error']").textContent = "Enter a valid email address.";
      hasError = true;
    }

    if (passwordValue.length < 6) {
      document.querySelector("[data-testid='password-error']").textContent = "Password must be at least 6 characters.";
      hasError = true;
    }

    if (hasError) {
      return;
    }

    if (emailValue !== VALID_EMAIL || passwordValue !== VALID_PASSWORD) {
      alert.hidden = false;
      alert.textContent = "Those credentials do not match the demo account.";
      return;
    }

    if (remember.checked) {
      localStorage.setItem(REMEMBER_KEY, emailValue);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }

    localStorage.setItem(SESSION_KEY, "active");
    render();
  });

  updateSubmitState();
}

function hydrateHome() {
  const navLinks = Array.from(document.querySelectorAll("[data-view]"));
  const panels = Array.from(document.querySelectorAll("[data-view-panel]"));
  const toast = document.querySelector("[data-testid='toast']");
  const taskList = document.querySelector("[data-testid='task-list']");
  const taskSearch = document.querySelector("[data-testid='task-search']");
  const emptyState = document.querySelector("[data-testid='empty-state']");
  const intakeForm = document.querySelector("[data-testid='intake-form']");
  const personRecordsBody = document.querySelector("[data-testid='person-records-body']");
  const personEmptyState = document.querySelector("[data-testid='person-empty-state']");
  const backToIntakeButton = document.querySelector("[data-testid='back-to-intake-button']");

  const showToast = (message) => {
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => {
      toast.hidden = true;
    }, 2600);
  };

  const setView = (view) => {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.view === view);
    });
    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.viewPanel === view);
    });
  };

  const showPersonDetail = (person) => {
    document.querySelector("[data-testid='person-detail-title']").textContent = `${person.firstName} ${person.lastName}`;
    document.querySelector("[data-testid='detail-first-name']").textContent = person.firstName;
    document.querySelector("[data-testid='detail-last-name']").textContent = person.lastName;
    document.querySelector("[data-testid='detail-email']").textContent = person.email;
    document.querySelector("[data-testid='detail-address']").textContent = person.address;
    document.querySelector("[data-testid='detail-skip-applicant-intake']").textContent = person.skipApplicantIntake;
    document.querySelector("[data-testid='detail-psl']").textContent = person.psl;
    document.querySelector("[data-testid='workflow-status-value']").textContent = "Applicant Intake";
    setView("person-detail");
  };

  const renderTasks = () => {
    const query = taskSearch.value.trim().toLowerCase();
    const visibleTasks = tasks.filter((task) => {
      return task.title.toLowerCase().includes(query) || task.detail.toLowerCase().includes(query);
    });

    taskList.replaceChildren(
      ...visibleTasks.map((task) => {
        const card = document.createElement("article");
        card.className = `task-card${task.done ? " done" : ""}`;
        card.dataset.testid = `task-card-${task.id}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.setAttribute("aria-label", `Mark ${task.title} complete`);
        checkbox.dataset.testid = `task-checkbox-${task.id}`;

        const copy = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = task.title;
        const detail = document.createElement("p");
        detail.textContent = task.detail;
        copy.append(title, detail);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "secondary-button";
        button.textContent = "Details";
        button.dataset.testid = `task-details-${task.id}`;

        checkbox.addEventListener("change", () => {
          task.done = checkbox.checked;
          renderTasks();
          showToast(task.done ? "Task marked complete." : "Task reopened.");
        });

        button.addEventListener("click", () => {
          showToast(`${task.title}: ${task.detail}`);
        });

        card.append(checkbox, copy, button);
        return card;
      })
    );

    emptyState.hidden = visibleTasks.length > 0;
  };

  const renderPersonRecords = () => {
    const personRecords = loadPersonRecords();

    personRecordsBody.replaceChildren(
      ...personRecords.map((person, index) => {
        const row = document.createElement("tr");
        row.className = "clickable-row";
        row.dataset.testid = `person-record-${index + 1}`;
        row.tabIndex = 0;
        row.setAttribute("role", "button");
        row.setAttribute("aria-label", `Open Person record for ${person.firstName} ${person.lastName}`);

        [
          person.firstName,
          person.lastName,
          person.email,
          person.address,
          person.skipApplicantIntake,
          person.psl,
        ].forEach((value) => {
          const cell = document.createElement("td");
          cell.textContent = value;
          row.append(cell);
        });

        row.addEventListener("click", () => {
          showPersonDetail(person);
        });

        row.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showPersonDetail(person);
          }
        });

        return row;
      })
    );

    personEmptyState.hidden = personRecords.length > 0;
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setView(link.dataset.view);
    });
  });

  document.querySelector("[data-testid='logout-button']").addEventListener("click", () => {
    localStorage.removeItem(SESSION_KEY);
    render();
  });

  document.querySelector("[data-testid='refresh-button']").addEventListener("click", () => {
    document.querySelector("[data-testid='open-tests-count']").textContent = "15";
    document.querySelector("[data-testid='pass-rate']").textContent = "97%";
    document.querySelector("[data-testid='flaky-count']").textContent = "1";
    showToast("Dashboard data refreshed.");
  });

  taskSearch.addEventListener("input", renderTasks);

  backToIntakeButton.addEventListener("click", () => {
    setView("intake");
  });

  intakeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(intakeForm);
    const personRecord = {
      firstName: String(formData.get("firstName") || "").trim(),
      lastName: String(formData.get("lastName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      skipApplicantIntake: String(formData.get("skipApplicantIntake") || "No"),
      psl: String(formData.get("psl") || "T1"),
    };
    const personRecords = loadPersonRecords();

    personRecords.push(personRecord);
    savePersonRecords(personRecords);
    renderPersonRecords();
    intakeForm.reset();
    showToast(`Person record created for ${personRecord.firstName} ${personRecord.lastName}.`);
  });

  document.querySelector("[data-testid='settings-form']").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.querySelector("[data-testid='display-name-input']").value.trim() || "Tester";
    document.querySelector("[data-testid='user-profile']").lastElementChild.textContent = name;
    showToast("Settings saved.");
  });

  renderTasks();
  renderPersonRecords();
  setView("overview");
}

render();
