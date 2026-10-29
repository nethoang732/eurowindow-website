const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const staticPagesBuild = process.env.GITHUB_ACTIONS === 'true';
const contactRoute = path.join(root, 'app', 'api', 'contact', 'route.js');
const parkedRoute = path.join(root, 'scripts', '.contact-route-static-build.tmp');
const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next');
let routeParked = false;

try {
  if (staticPagesBuild && fs.existsSync(contactRoute)) {
    fs.renameSync(contactRoute, parkedRoute);
    routeParked = true;
  }

  const result = spawnSync(process.execPath, [nextBin, 'build'], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  });

  if (result.error) throw result.error;
  process.exitCode = result.status === null ? 1 : result.status;
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  if (routeParked) {
    fs.renameSync(parkedRoute, contactRoute);
  }
}
