function drawImage(n) {
    // Periksa jika nilai parameter adalah ganjil
    if (n % 2 === 0) {
        console.log("Parameter harus ganjil");
        return;
    }

    for (let i = 0; i < n; i++) {
        let row = "";
        for (let j = 0; j < n; j++) {
            if (i === j || i + j === n - 1 || j === Math.floor(n / 2)) {
                row += "*\t";
            } else {
                row += "#\t";
            }
        }
        console.log(row);
    }
}

drawImage(5);
console.log("\n");
drawImage(7);
