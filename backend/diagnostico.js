const fs = require("fs");
const path = require("path");

const coveragePath = path.join(__dirname, "coverage", "coverage-final.json");

if (!fs.existsSync(coveragePath)) {
  console.log("coverage-final.json NÃO EXISTE — rode npm test primeiro");
  process.exit();
}

const coverage = JSON.parse(fs.readFileSync(coveragePath, "utf8"));
const chaves = Object.keys(coverage);

console.log("Total de arquivos no coverage:", chaves.length);
console.log("");

chaves.forEach((chave) => {
  const vals = Object.values(coverage[chave].s);
  const cobertos = vals.filter((v) => v > 0).length;
  console.log(
    `${path.basename(chave)}: ${cobertos}/${vals.length} statements cobertos`,
  );
  console.log(`  Caminho: ${chave}`);
});
