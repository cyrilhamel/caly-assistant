#!/usr/bin/env node

/**
 * Script pour afficher l'URI de redirection à configurer dans Google Cloud Console
 */

const scheme = 'caly';
const slug = 'caly-assistant';
const owner = 'cyrilhamel';

console.log('\n========================================');
console.log('📋 URIs de redirection à configurer');
console.log('========================================\n');

console.log('Pour le DÉVELOPPEMENT (Expo Go) :');
console.log(`  exp://localhost:8081/--/redirect`);
console.log(`  exp://192.168.x.x:8081/--/redirect (remplacez par votre IP locale)\n`);

console.log('Pour Expo (avec AuthSession) :');
console.log(`  https://auth.expo.io/@${owner}/${slug}\n`);

console.log('Pour PRODUCTION (app standalone) :');
console.log(`  ${scheme}://redirect\n`);

console.log('========================================');
console.log('📝 Instructions');
console.log('========================================\n');

console.log('1. Allez sur https://console.cloud.google.com/');
console.log('2. Sélectionnez votre projet');
console.log('3. APIs & Services > Credentials');
console.log('4. Cliquez sur votre OAuth 2.0 Client ID');
console.log('5. Ajoutez TOUTES les URIs ci-dessus dans "Authorized redirect URIs"');
console.log('6. Cliquez sur "Save"\n');

console.log('⚠️  Attention : Attendez 5-10 minutes après la sauvegarde');
console.log('    pour que les changements se propagent.\n');
