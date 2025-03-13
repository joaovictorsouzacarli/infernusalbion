const fs = require("fs")
const path = require("path")

// Diretórios a serem verificados
const directories = ["app", "components", "lib", "hooks"]

// Função para verificar se um arquivo é um arquivo TypeScript/React
function isTypeScriptFile(file) {
  return file.endsWith(".ts") || file.endsWith(".tsx")
}

// Função para processar um arquivo
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8")

    // Verificar se o arquivo importa algum módulo do Radix UI
    if (content.includes("@radix-ui/react-")) {
      console.log(`Processando: ${filePath}`)

      // Substituir importações do Radix UI por importações locais
      let newContent = content

      // Substituir importações específicas do Radix UI
      newContent = newContent.replace(/import\s+.*\s+from\s+['"]@radix-ui\/react-[^'"]+['"]/g, (match) => {
        // Comentar a linha de importação original
        return `// ${match} - Substituído por componentes locais`
      })

      // Escrever o conteúdo modificado de volta para o arquivo
      fs.writeFileSync(filePath, newContent, "utf8")
      console.log(`Modificado: ${filePath}`)
    }
  } catch (error) {
    console.error(`Erro ao processar ${filePath}:`, error)
  }
}

// Função para percorrer diretórios recursivamente
function traverseDirectory(directory) {
  const files = fs.readdirSync(directory)

  for (const file of files) {
    const fullPath = path.join(directory, file)
    const stats = fs.statSync(fullPath)

    if (stats.isDirectory()) {
      traverseDirectory(fullPath)
    } else if (isTypeScriptFile(file)) {
      processFile(fullPath)
    }
  }
}

// Processar todos os diretórios
for (const directory of directories) {
  if (fs.existsSync(directory)) {
    traverseDirectory(directory)
  }
}

console.log("Processamento concluído!")

