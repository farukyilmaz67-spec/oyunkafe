const utils = require("./utils");
const config = require("./config");

function run(result) {

    const html = `
<!DOCTYPE html>
<html lang="tr">

<head>

<meta charset="UTF-8">

<title>OyunKafe Build Report</title>

<style>

body{

font-family:Arial,sans-serif;

background:#f5f5f5;

padding:40px;

}

.card{

background:white;

padding:30px;

border-radius:12px;

max-width:700px;

margin:auto;

box-shadow:0 5px 20px rgba(0,0,0,.08);

}

h1{

margin-top:0;

}

table{

width:100%;

border-collapse:collapse;

margin-top:20px;

}

td{

padding:10px;

border-bottom:1px solid #ddd;

}

.good{

color:green;

font-weight:bold;

}

.bad{

color:red;

font-weight:bold;

}

</style>

</head>

<body>

<div class="card">

<h1>🎮 OyunKafe Build Report</h1>

<table>

<tr>

<td>Toplam Oyun</td>

<td>${result.stats.total}</td>

</tr>

<tr>

<td>Hata</td>

<td class="${result.errors.length ? "bad":"good"}">

${result.errors.length}

</td>

</tr>

<tr>

<td>Uyarı</td>

<td>${result.warnings.length}</td>

</tr>

<tr>

<td>Resim Bulundu</td>

<td>${result.stats.imagesOk}</td>

</tr>

<tr>

<td>SEO</td>

<td>${result.stats.seoOk}</td>

</tr>

</table>

</div>

</body>

</html>
`;

    utils.writeFile(config.reportFile, html);

    console.log(utils.green("✓ report.html oluşturuldu"));

}

module.exports = {

    run

};