const exForm = document.getElementById('ex-form');
const trForm = document.getElementById('tr-form');
const response = document.getElementById('response');
const error = document.getElementById('error');
const progress = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');
const buttons = document.querySelectorAll('button');
const lists = {
  ex: 'ecs/ecs',
  tr: 'tra/transit'
};
const INTERVAL = 300;
let totalMRN;
let currentMRNCount;

exForm.onsubmit = function(e) {
  e.preventDefault();
  const value = document.getElementById("ex-mrn").value;
  submitForm(value, 'ex');
}

trForm.onsubmit = function(e) {
  e.preventDefault();
  const value = document.getElementById("tr-mrn").value;
  submitForm(value, 'tr');
}

function submitForm(mrnString, type) {
  clearFields();

  if (!mrnString) {
    showError('No value submitted');
    return;
  }

  let mrnList = mrnString.split('\n').filter(function(mrn) {
    return mrn !== "";
  });
  
  currentMRNCount = 0;
  totalMRN = mrnList.length;

  updateTotal(totalMRN, currentMRNCount);

  for (let i = 0; i < mrnList.length; i++) {
    if (!mrnList[i]) continue;

    setTimeout(function() {
      fetchData(mrnList[i], type);
    }, i * INTERVAL);
  } 
}

function updateTotal(total, current) {
  if (total !== current) {
    progress.innerText = 'Loaded ' + current + " of " + total;
  } else {
    progress.innerText = 'Finished. Total: ' + total;
    progress.classList.add('success');
    progressBar.style.backgroundColor = "#4b4";
    buttons.forEach(function(btn) {
      btn.disabled = false;
    });
  }
  progressBar.style.display = "block";
  progressBar.style.width = (current / total * 100) + "%";
}

function trimResult(str) {
  let trimmed = str.replace(/\s+/g, " ");

  let i = trimmed.indexOf("<form");

  if (i > -1) { 
    let end;
    while (end !== ">") {
      end = trimmed[i];
      i++;
    }
  }
  return trimmed.slice(i, trimmed.indexOf("</form"));
}

function createResults(mrn, result) {
  let div = document.createElement("DIV");
  div.classList.add('single');
  div.insertAdjacentHTML("afterbegin", "<h2>" + mrn + "</h2>");
  div.insertAdjacentHTML("beforeend", result);
  response.appendChild(div);
}

function clearFields() {
  buttons.forEach(function(btn) {
    btn.disabled = true;
  });
  response.classList.remove("error");
  progress.classList.remove("error");
  progress.classList.remove('success');
  progressBar.style.backgroundColor = "#66b";
  response.innerHTML = "";
  error.innerHTML = "";
}

function showError(msg) {  
  buttons.forEach(function(btn) {
    btn.disabled = false;
  });
  response.classList.add("error");
  progress.classList.add("error");
  response.innerText = msg;
  progress.innerText = "Error!"
}

function fetchData(mrn, type) {
  let query = "https://cors-anywhere.herokuapp.com/https://ec.europa.eu/taxation_customs/dds2/" + lists[type] + "_list.jsp?Lang=en&MRN=" + mrn;

  fetch(query)
  .then(function(res) {
    if (res.status !== 200) {
      throw new Error("Status: " + res.status + ". " + res.statusText);
    }
    return res.text();
  })
  .then(function(text) {
    let result = trimResult(text);
    updateTotal(totalMRN, ++currentMRNCount);

    let h2 = currentMRNCount + '. MRN: ' + mrn;
    createResults(h2, result);
  })
  .catch(function(err) {
    showError(err.message);
  });
}