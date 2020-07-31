const exForm = document.getElementById('ex-form');
const trForm = document.getElementById('tr-form');
const response = document.getElementById('response');
const progress = document.getElementById('progress');
const lists = {
  ex: 'ecs/ecs',
  tr: 'tra/transit'
};
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
  response.innerHTML = "";

  if (!mrnString) {
    response.innerText = 'No value submitted';
    return;
  }

  const mrnList = mrnString.split('\n').filter(function(mrn) {
    return mrn !== "";
  });
  
  currentMRNCount = 0;
  totalMRN = mrnList.length;

  updateTotal(totalMRN, currentMRNCount);

  for (let mrn of mrnList) {
    if (!mrn) continue;

    let query = "https://cors-anywhere.herokuapp.com/https://ec.europa.eu/taxation_customs/dds2/" + lists[type] + "_list.jsp?Lang=en&MRN=" + mrn;

    fetch(query)
    .then(function(res) {
      return res.text();
    })
    .then(function(text) {
      text.replace(/\s/g, " ");
      console.log(text)
      console.log(text.slice(text.indexOf('<table>'), text.indexOf("</table>")));
      updateTotal(totalMRN, ++currentMRNCount);

      let div = document.createElement("DIV");
      let h2 = currentMRNCount + '. MRN: ' + mrn;

      div.classList.add('single');
      div.insertAdjacentHTML("afterbegin", "<h2>" + h2 + "</h2>");
      div.insertAdjacentHTML("beforeend", "<p>" + text + "</p>");
      response.appendChild(div);
    });
  }
}

function updateTotal(total, current) {
  if (total !== current) {
    progress.innerText = 'Loaded ' + current + " of " + total;
  } else {
    progress.innerText = 'Finished. Total: ' + total;
  }
}