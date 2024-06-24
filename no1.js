function hitungBarang(kualitas, qty) {
    let harga, potongan = 0;

    if (kualitas === 'A') {
        harga = 4550;
        if (qty > 13) {
            potongan = 231 * qty;
        }
    } else if (kualitas === 'B') {
        harga = 5330;
        if (qty > 7) {
            potongan = 0.23 * harga * qty;
        }
    } else if (kualitas === 'C') {
        harga = 8653;
    } else {
        return "Kualitas barang tidak valid";
    }

    let totalHarga = harga * qty;
    let totalBayar = totalHarga - potongan;

    return `- Total harga barang : ${totalHarga}\n- Potongan : ${potongan}\n- Total yang harus dibayar : ${totalBayar}`;
}

let output = hitungBarang('A', 14);
console.log(output);
