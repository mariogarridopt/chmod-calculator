function drawChmod(octal) {
    const permissions = octal.toString().padStart(4, '0');
    console.log("Drawing: " + permissions);


    const map = {
        'c-o-r': 4,
        'c-o-w': 2,
        'c-o-x': 1,
        'c-g-r': 4,
        'c-g-w': 2,
        'c-g-x': 1,
        'c-p-r': 4,
        'c-p-w': 2,
        'c-p-x': 1
    };

    ['c-o-', 'c-g-', 'c-p-'].forEach((prefix, index) => {
        const val = parseInt(permissions[index + 1], 10); // skip the first character (0) and start with owner, group, public
        for (const [key, bitmask] of Object.entries(map)) {
            if (key.startsWith(prefix)) {
                document.getElementById(key).checked = (val & bitmask) !== 0;
            }
        }
    });
}

function getChmod() {
    const permissionOrder = ['r', 'w', 'x'];
    const ids = ['c-o-', 'c-g-', 'c-p-'];
    let result = '-';

    ids.forEach((prefix) => {
        permissionOrder.forEach((perm) => {
            const isChecked = document.getElementById(prefix + perm).checked;
            if (isChecked) {
                result += perm;
            } else {
                result += '-';
            }
        });
    });

    return result;
}

function symbolicToNumeric(chmodString) {
    if (chmodString.length !== 10) {
        throw new Error("Invalid input format");
    }

    const PERMISSIONS = {'r': 4, 'w': 2, 'x': 1, '-': 0};

    const userStr = chmodString.slice(1, 4);
    const groupStr = chmodString.slice(4, 7);
    const othersStr = chmodString.slice(7, 10);

    const calculateValue = (str) => {
        return PERMISSIONS[str[0]] + PERMISSIONS[str[1]] + PERMISSIONS[str[2]];
    }

    const user = calculateValue(userStr);
    const group = calculateValue(groupStr);
    const others = calculateValue(othersStr);

    return `${user}${group}${others}`;
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("doc loaded");
    document.getElementById("c-oct").addEventListener("input", function(event) {
        let val = event.target.value;
        if (val.length == 3 || val.length == 4) {
            drawChmod(val);
            let sym = getChmod();
            document.getElementById("c-sym").value = sym;
        }    
    });
    
    document.getElementById("c-sym").addEventListener("input", function(event) {
        let sym = event.target.value;

        if (sym.length == 9) {sym = "-" + sym;}
        if (sym.length == 10) {
            let val = symbolicToNumeric(sym);
            drawChmod(val);
            let oct = symbolicToNumeric(sym);
            document.getElementById("c-oct").value = oct;
        }
    });
    
    document.querySelectorAll('.check-item').forEach(item => {
        item.addEventListener('change', event => {
            let sym = getChmod();
            let oct = symbolicToNumeric(sym);
            document.getElementById("c-oct").value = oct;
            document.getElementById("c-sym").value = sym;
        })
    });
 });
 


