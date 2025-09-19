const pascalCase = (inputString) => {
  const inputArray = inputString.toLowerCase().split(" ");
  let outputString = "";
  for (let i = 0; i < inputArray.length; i++) {
    outputString += inputArray[i][0].toUpperCase();
    outputString += inputArray[i].slice(1);
    outputString += " ";
  }
  return outputString;
};

const alphapeticSort = (inputArray) => {
  if (inputArray.length > 1) inputArray.sort((a, b) => a.localeCompare(b));
};
const numericSort = (inputArray) => {
  if (inputArray.length > 1) inputArray.sort((a, b) => b - a);
};

function sort() {
  const sortParameter = document.querySelector(".sort-parameter").value;
  const studentNames = document.querySelectorAll(".student-name");
  const studentGrades = document.querySelectorAll(".student-grade");
  if (sortParameter === "name") {
    // alphapetic
    // alphapeticSort(studentNames);  // studentNames is a nodelist not array
    // copying the student names to an external array to be able to sort
    let namesArray = [];
    for (let oneName of studentNames) namesArray.push(oneName.innerText);
    alphapeticSort(namesArray);
    // find each student name and its corresponding grade
    for (let i = 0; i < namesArray.length; i++) {
      let requiredGrade, j;
      for (j = 0; j < studentNames.length; j++) {
        if (studentNames[j].innerText === namesArray[i]) {
          requiredGrade = studentGrades[j].innerText;
          break;
        }
      }
      // Swapping
      let tempName = studentNames[i].innerText;
      let tempGrade = studentGrades[i].innerText;
      studentNames[i].innerText = namesArray[i];
      studentGrades[i].innerText = requiredGrade;
      studentNames[j].innerText = tempName;
      studentGrades[j].innerText = tempGrade;
    }
  } else {
    // numeric
    let gradesArray = [];
    for (let oneGrade of studentGrades)
      gradesArray.push(oneGrade.innerText);
    numericSort(gradesArray);

    for (let i = 0; i < gradesArray.length; i++) {
      let requiredName, j;
      for (j = 0; j < studentGrades.length; j++) {
        if (studentGrades[j].innerText === gradesArray[i]) {
          requiredName = studentNames[j].innerText;
          break;
        }
      }
      // Swapping
      let tempName = studentNames[i].innerText;
      let tempGrade = studentGrades[i].innerText;
      studentGrades[i].innerText = gradesArray[i];
      studentNames[i].innerText = requiredName;
      studentGrades[j].innerText = tempGrade;
      studentNames[j].innerText = tempName;
    }
  }
}

function addStudent(studentsTable, studentName, studentGrade, successArray, failArray, allArray, filterParameter) {
  if (
    studentName.value &&
    studentGrade.value >= 0 &&
    studentGrade.value <= 100
  ) {
    const nameColumn = document.createElement("td");
    nameColumn.innerText = pascalCase(studentName.value);
    nameColumn.classList.add("student-name");

    const gradeColumn = document.createElement("td");
    gradeColumn.innerText = studentGrade.value;
    gradeColumn.classList.add("student-grade");

    const deleteButtonColumn = document.createElement("td");
    deleteButtonColumn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButtonColumn.classList.add("student-delete");
    deleteButtonColumn.onclick = function () {
      this.parentElement.remove();
    };
    const row = document.createElement("tr");
    row.appendChild(nameColumn);
    row.appendChild(gradeColumn);
    row.appendChild(deleteButtonColumn);

    const department = document.querySelector(
      "input[name=Department]:checked"
    );
    row.classList.add(department.value);

    studentsTable.appendChild(row);
    //=================================================================
    const currentStudent = {
      name: "abc",
      grade: "0",
    };
    currentStudent.name = studentName.value;
    currentStudent.grade = studentGrade.value;
    if (studentGrade.value >= 60) successArray.push(currentStudent);
    else failArray.push(currentStudent);
    allArray = [...successArray, ...failArray];
    //===================================================================
    filter("all");
    sort();
  } else {
    launchError();
  }
}

function fillSuccessAndFailArrays() { }


function filter(filterParameter) {
  const studentNames = document.querySelectorAll(".student-name");
  const studentGrades = document.querySelectorAll(".student-grade");
  const studentDeleteButtons = document.querySelectorAll(".student-delete");

  // I. Reset
  //=============================
  let i;
  for (i = 0; i < studentNames.length; i++) {
    studentNames[i].innerText = null;
    studentGrades[i].innerText = null;
    studentDeleteButtons[i].innerText = null;
  }
  // I. Filter
  //=============================
  if (filterParameter === "all") {
    allArray = [...successArray, ...failArray];
    for (i = 0; i < allArray.length; i++) {
      studentNames[i].innerText = allArray[i].name;
      studentGrades[i].innerText = allArray[i].grade;
      studentDeleteButtons[i].innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    }
  } else if (filterParameter === "success") {
    for (i = 0; i < successArray.length; i++) {
      studentNames[i].innerText = successArray[i].name;
      studentGrades[i].innerText = successArray[i].grade;
      studentDeleteButtons[i].innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    }

  } else {
    // fail
    for (i = 0; i < failArray.length; i++) {
      studentNames[i].innerText = failArray[i].name;
      studentGrades[i].innerText = failArray[i].grade;
      studentDeleteButtons[i].innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    }

  }
}

const studentsTable = document.querySelector(".students-table");
const addButton = document.querySelector(".add-button");
const studentName = document.querySelector("input[name=studentName]");
const studentGrade = document.querySelector("input[name=studentGrade]");
const nameError = document.querySelector("#nameError");
const gradeError = document.querySelector("#gradeError");


// Verification for Name , Grade
//===========================================
if (studentName.value === "") nameError.classList.add('show');
if (studentGrade.value === "") gradeError.classList.add('show');
studentName.onkeypress = (e) => {
  if (!isNaN(parseInt(e.key))) e.preventDefault();
};
studentGrade.onkeypress = (e) => {
  if (isNaN(parseInt(e.key))) e.preventDefault();
};
studentName.addEventListener("change", () => {
  if (studentName.value == "") nameError.classList.add("show");
  else nameError.classList.remove("show");
});
studentGrade.addEventListener("change", () => {
  if (studentGrade.value == "") gradeError.classList.add("show");
  else gradeError.classList.remove("show");
});

// Customizing Errors
//===========================================
const errorText = document.querySelector(".error-notification");
function launchError(message) {
  const error = document.querySelector('h3');
  if (!studentName.value) errorText.innerText = "You should enter a valid name !"
  if (studentGrade.value < 0 || studentGrade.value > 100) errorText.innerText = "You should enter a grade between 0 and 100 !"
  if (message) errorText.innerText = message;
  error.classList.add("show-error-notification");
}
const closeNotificationButton = document.querySelector(".close-notification");

closeNotificationButton.addEventListener("click", () => {
  const error = document.querySelector('h3');
  error.classList.remove("show-error-notification");
})


let successArray = [];
let failArray = [];
let allArray = [];


// Sorting
//=================================
const sortParameter = document.querySelector(".sort-parameter");
sortParameter.onchange = sort;

// Filtering
//================================
const filterParameter = document.querySelector(".filter-parameter");
filterParameter.onchange = () => {
  filter(filterParameter.value);
}

// Add Button
//===========================================
addButton.addEventListener("click", () => {
  const studentNames = document.querySelectorAll(".student-name");
  let isStudentPresent = false;
  for (let student of studentNames) {
    if (studentName.value.toLowerCase() === student.innerText.toLowerCase()) {
      launchError("Student is already registered!");
      isStudentPresent = true;
      break;
    }
  }
  if (!isStudentPresent) addStudent(studentsTable, studentName, studentGrade, successArray, failArray, allArray, filterParameter);
});


