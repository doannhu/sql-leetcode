const fs = require('fs');


class VendingMachineStates {
    static STAND_BY = 'STAND_BY';
    static SELECTED_ITEM = 'SELECTED_ITEM';
    static INSERT_MONEY = 'INSERT_MONEY';

    static validFromStates = {
        STAND_BY: [VendingMachineStates.SELECTED_ITEM, VendingMachineStates.INSERT_MONEY],
        SELECTED_ITEM: [VendingMachineStates.STAND_BY],
        INSERT_MONEY: [VendingMachineStates.SELECTED_ITEM]
    };

    static canChangeVendingMachineState(fromState, toState) {
        return VendingMachineStates.validFromStates[toState].includes(fromState);
    }
}

class VendingMachine {
    constructor(totalCash, itemsNumber, itemsCount, itemsCost) {
        this.itemsNumber = itemsNumber;
        this.itemsCount = itemsCount;
        this.itemsCost = itemsCost;
        this.totalCash = totalCash;
        this.selectedIndex = [-1, -1];
        this.state = VendingMachineStates.STAND_BY;
    }

    resetVendingMachine() {
        this.selectedIndex[0] = -1;
        this.selectedIndex[1] = -1;
        this.state = VendingMachineStates.STAND_BY;
    }

    selectItem(i, j) {
        i -= 1;
        j -= 1;

        if (!VendingMachineStates.canChangeVendingMachineState(this.state, VendingMachineStates.SELECTED_ITEM)) {
            this.resetVendingMachine();
            return -1;
        }

        this.state = VendingMachineStates.INSERT_MONEY;

        if (i >= this.itemsNumber.length || j >= this.itemsNumber.length || i < 0 || j < 0) {
            this.resetVendingMachine();
            return -1;
        }

        if (this.itemsCount[i][j] < 0) {
            this.resetVendingMachine();
            return -1;
        }

        this.selectedIndex[0] = i;
        this.selectedIndex[1] = j;
        return this.itemsNumber[i][j];
    }

    insertMoney(money) {
        if (!VendingMachineStates.canChangeVendingMachineState(this.state, VendingMachineStates.STAND_BY)) {
            this.resetVendingMachine();
            return -1;
        }

        const costOfSelectedItem = this.itemsCost[this.selectedIndex[0]][this.selectedIndex[1]];
        const change = money - costOfSelectedItem;

        if (change < 0 || change > this.totalCash) {
            this.resetVendingMachine();
            return -1;
        }

        this.totalCash -= costOfSelectedItem;
        this.itemsCount[this.selectedIndex[0]][this.selectedIndex[1]] -= 1;
        this.state = VendingMachineStates.STAND_BY;
        return change;
    }
}
function read(N, M, arr, lines) {
    for (let i = 0; i < N; i++) {
        const inp = lines.shift().trim().split(' ');
        for (let j = 0; j < M; j++) {
            arr[i][j] = parseInt(inp[j]);
        }
    }
}

function main(lines) {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const inp = lines.shift().trim().split(' ');
    const N = parseInt(inp[0]);
    const M = parseInt(inp[1]);

    const itemId = new Array(N).fill(null).map(() => new Array(M).fill(0));
    const itemsCount = new Array(N).fill(null).map(() => new Array(M).fill(0));
    const itemsCost = new Array(N).fill(null).map(() => new Array(M).fill(0));

    read(N, M, itemId, lines);
    read(N, M, itemsCount, lines);
    read(N, M, itemsCost, lines);

    const totalCash = parseInt(lines.shift().trim());
    const totalNumberOfRequests = parseInt(lines.shift().trim());

    const vendingMachine = new VendingMachine(totalCash, itemId, itemsCount, itemsCost);

    const output = [];
    for (let requestNumber = 1; requestNumber <= totalNumberOfRequests; requestNumber++) {
        const inp = lines.shift().trim().split(' ');
        switch (inp[0]) {
            case 'selectItem':
                const i = parseInt(inp[1]);
                const j = parseInt(inp[2]);
                const res = vendingMachine.selectItem(i, j);
                output.push(res + ' ' + vendingMachine.state);
                break;

            case 'insertMoney':
                const money = parseInt(inp[1]);
                const res2 = vendingMachine.insertMoney(money);
                output.push(res2 + ' ' + vendingMachine.state);
                break;
        }
    }

    ws.write(output.join('\n'));
    ws.end
}

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    main(inputString.split('\n'));
});