const sol = document.getElementById("chinese-sol");

document.getElementById("chinese-n").addEventListener("input", (e) => {
  let content = ``;
  let number = e.target.value;
  if (number > 100) {
    e.target.value = 0;
    number = 0;
  }
  for (let i = 0; i < number; i++) {
    content += `
      <div class="row">
        <div class="mb-2 col-3">
          <label>n<sub>${i + 1}</sub>: </label>
          <input type="number" class="mod">
        </div>
        <div class="mb-2 col-3">
          <label>a<sub>${i + 1}</sub>: </label>
          <input type="number" class="number">
        </div>
      </div>
    `;
  }

  content += `<button class="btn btn-success mb-3" type="submit">Calculate</button>`;

  document.getElementById("chinese").innerHTML = content;
});

document.getElementById("chinese").addEventListener("submit", function (e) {
  e.preventDefault();
  const mods = Array.from(document.querySelectorAll("input.mod")).map(
    (input) => +input.value
  );

  const numbers = Array.from(document.querySelectorAll("input.number")).map(
    (input) => +input.value
  );

  const n = mods.reduce((acc, number) => acc * number, 1);
  const length = mods.length;
  const lIdx = length - 1;
  const n_is = [];
  const n_is_star = [];
  const e_is = [];

  let content = "<p>n = ";

  for (let i = 0; i < length; i++) {
    content += `n_${i + 1} ${i === lIdx ? "" : "·"} `;
  }

  content += "= ";

  for (let i = 0; i < length; i++) {
    content += `${mods[i]} ${i === lIdx ? "" : "·"} `;
  }

  content += `= ${n}</p><p>`;

  for (let i = 0; i < length; i++) {
    const n_i = n / mods[i];
    n_is.push(n_i);
    content += `n<sub>${i + 1}</sub>* = ${n_i}${i === lIdx ? "" : ","} `;
  }
  content += "</p>";



  for (let i = 0; i < length; i++) {
    let count = 1;
    while (true) {
      if ((n_is[i] * count) % mods[i] === 1) {
        break;
      }
      count++;
      if (count > 10000000) break;
    }

    n_is_star.push(count);

    content += `<p>

      n_${i + 1}* · (n_${i + 1}*)<sup>-1</sup> ≅ 1( mod n<sub>${i + 1}</sub> )
      → ${n_is[i]} · (n<sub>${i + 1}</sub>)* ≅ 1( mod ${mods[i]} )
      → (n<sub>${i + 1}</sub>)* ≅ ${count}( mod ${mods[i]} )
                
                </p>`;
  }

  for (let i = 0; i < length; i++) {
    const e_i = n_is[i] * n_is_star[i];
    e_is.push(e_i);

    content += `<p>
      e<sub>${i + 1}</sub> = n<sub>${i + 1}</sub>* · (n<sub>${i + 1}</sub>*)-1
      → e<sub>${i + 1}</sub> = ${n_is[i]} · ${n_is_star[i]} = ${e_i}
            </p>`;
  }

  content += "<p>a = ";
  for (let i = 0; i < length; i++) {
    content += `
      e<sub>${i + 1}</sub> · a<sub>${i + 1}</sub> + 
    `;
  }
  content += " = ";
  let total = 0;
  for (let i = 0; i < length; i++) {
    total += e_is[i] * numbers[i];
    content += `
      ${e_is[i]} · ${numbers[i]} + 
    `;
  }

  content += ` ≅ ${total}(mod ${n}) ≅ ${total % n}(mod ${n})`;

  sol.innerHTML = content;
});

function gcd_two_numbers(x, y) {
  if ((typeof x !== 'number') || (typeof y !== 'number')) 
    return false;
  x = Math.abs(x);
  y = Math.abs(y);
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

document.getElementById("multi-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const z = +document.getElementById("z").value;
  const order = +document.getElementById("order").value;
  const thead = document.getElementById("thead");
  const tbody = document.getElementById("tbody");

  const divisors = [1];
  for (let i = 2; i <= order; i++) {
    if (order % i === 0) divisors.push(i);
  }

  let theadContent = "";
  theadContent += "<tr><th></th>";

  for (let divisor of divisors) {
    theadContent += `<th>${divisor}</th>`;
  }

  theadContent += "</tr>";
  thead.innerHTML = theadContent;

  let tbodyContent = "";

  let elements = [];

  // tìm z*
  const z_star = [];

  for (let i = 1; i < z; i++) {
    if (gcd_two_numbers(i, z) === 1) {
      z_star.push(i);
    }
  }

  console.log(z_star);

  for (let i = 1; i <= z_star.length; i++) {
    tbodyContent += `<tr id="row-${i}"><td>${z_star[i - 1]}<sup>i</sup></td>`;
    if (i === 4) debugger;
    let oldMod;
    for (let j = 0; j < divisors.length; j++) {
      if (j === 0) oldMod = i % z;
      else if (oldMod === 1 || oldMod === -1) {
        oldMod = -1;
        tbodyContent += `<td>x</td>`;
        break;
      } else {
        // oldMod = (oldMod * i ** (divisors[j] - divisors[j - 1])) % z;
        for (let k = 0; k < divisors[j] - divisors[j - 1]; k++) {
          oldMod = (oldMod * i) % z;
        }
      }
      if (j === divisors.length - 1 && oldMod === 1) {
        elements.push(i);
      }
      tbodyContent += `<td>${oldMod}</td>`;
    }

    tbodyContent += "</tr>";
  }

  tbody.innerHTML = tbodyContent;
  

  elements.forEach((i) => {
    const row = document.getElementById(`row-${i}`);
    row.classList.add("table-dark");
  });

});
