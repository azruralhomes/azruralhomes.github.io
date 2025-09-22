function calculate() {
    let inputs = document.getElementsByTagName('input')

    let inputSum = 0;
    let commPercent = 0;

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'number' && inputs[i].id !== 'commission_percentage') {
            inputSum += parseFloat(inputs[i].value);
        }
        /*** 
        else if (inputs[i].type === 'text') {
            let vars = document.getElementById('equation_vars')
            if (inputs[i].value.length > 0) {
                vars.innerHTML += inputs[i].value
            }
            else {
                for (let j = 0; j < inputs.length; j++) {
                    if (!vars.innerText.includes(j)) {
                        vars.innerText += " + num" + j;
                        break;
                    }
                }
            }
        }
            */
        else if (inputs[i].id === 'commission_percentage') {
            if (isNaN(parseFloat(inputs[i].value))) {
                document.getElementById('commission_percentage').style.border = "red 2px solid"
                alert("Don't you want to get paid?")
                return;
            }
            else {
                commPercent = inputs[i].value / 100
            }
        }
    }

    document.getElementById('answer').innerText = 'List Price:    $' + (inputSum / (1 - commPercent)).toFixed(2);;
}

function addInput() {
    let grid = document.getElementById('input_grid');

    var inp = document.createElement("input");
    inp.type = 'text';
    inp.classList.add('addtl_input')
    inp.placeholder = 'optional label';
    grid.appendChild(inp);

    inp = document.createElement("input");
    inp.type = 'number';
    inp.value = 0;
    grid.appendChild(inp);

}