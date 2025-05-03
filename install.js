#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Instalando o TreeCraft AI...');

try {
  // Verificar se o Node.js está instalado
  execSync('node --version', { stdio: 'ignore' });
  console.log('✓ Node.js está instalado');
  
  // Verificar se o npm está instalado
  execSync('npm --version', { stdio: 'ignore' });
  console.log('✓ npm está instalado');
  
  // Instalar o pacote globalmente
  console.log('Instalando o pacote globalmente...');
  execSync('npm install -g .', { stdio: 'inherit' });
  
  console.log('\n✓ TreeCraft AI instalado com sucesso!');
  console.log('\nAgora você pode usar o comando "treecraft" para criar estruturas de diretórios:');
  console.log('  treecraft example-tree.txt');
  console.log('  treecraft example-tree.txt ./meus-projetos');
  
} catch (error) {
  console.error('\n✗ Erro durante a instalação:', error.message);
  process.exit(1);
}
