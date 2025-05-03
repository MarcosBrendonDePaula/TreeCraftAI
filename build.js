#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Compilando o TreeCraft AI...');

try {
  // Criar diretório de build se não existir
  if (!fs.existsSync('build')) {
    fs.mkdirSync('build');
    console.log('✓ Diretório de build criado');
  }
  
  // Copiar arquivos necessários para o diretório de build
  const filesToCopy = [
    'treecraft.js',
    'package.json',
    'README.md',
    'install.js'
  ];
  
  filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join('build', file));
      console.log(`✓ Copiado ${file} para o diretório de build`);
    }
  });
  
  // Criar pacote npm
  console.log('Criando pacote npm...');
  execSync('cd build && npm pack', { stdio: 'inherit' });
  
  // Mover o pacote para o diretório raiz
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const packageName = `${packageJson.name}-${packageJson.version}.tgz`;
  
  if (fs.existsSync(path.join('build', packageName))) {
    fs.copyFileSync(path.join('build', packageName), packageName);
    console.log(`✓ Pacote ${packageName} criado com sucesso`);
  }
  
  console.log('\n✓ TreeCraft AI compilado com sucesso!');
  console.log(`\nO pacote está disponível em: ${packageName}`);
  console.log('\nPara instalar globalmente:');
  console.log(`  npm install -g ${packageName}`);
  
} catch (error) {
  console.error('\n✗ Erro durante a compilação:', error.message);
  process.exit(1);
}
