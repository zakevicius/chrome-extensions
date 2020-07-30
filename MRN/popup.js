const exForm = document.getElementById('ex-form');
const trForm = document.getElementById('tr-form');
const lists = {
  ex: 'ecs/ecs',
  tr: 'tra/transit'
}

exForm.onsubmit = function(e) {
  e.preventDefault();
  const mrn = document.getElementById("ex-mrn").value;
  submitForm(mrn, 'ex');
}

trForm.onsubmit = function(e) {
  e.preventDefault();
  const mrn = document.getElementById("tr-mrn").value;
  submitForm(mrn, 'tr');
}

function submitForm(mrn, type) {
  document.getElementById('response').innerText = 'Loading data...';

  if (!mrn) {
    document.getElementById('response').innerText = 'No value submitted';
    return;
  }

  const mrnList = mrn.split('\n');

  for (let m of mrnList) {
    if (!m) continue;

    let query = "https://cors-anywhere.herokuapp.com/https://ec.europa.eu/taxation_customs/dds2/" + lists[type] + "_list.jsp?Lang=en&MRN=" + m;

    fetch(query)
    .then(function(res) {
      return res.text();
    })
    .then(function(text) {
      let div = document.createElement("DIV");
      let h2 = document.createElement('H2');
      let p = document.createElement('P');
      div.classList.add('single');
      p.innerHTML = text;
      div.appendChild(p);
      h2.innerText = 'MRN: ' + m;
      div.appendChild(h2);
      document.getElementById('response').appendChild(div);
    });
  }
}