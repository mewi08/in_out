const path = require('path');
const fs = require('fs');

const packagedEnv = process.resourcesPath
    ? path.join(process.resourcesPath, '.env')
    : null;

const localEnv = path.join(__dirname, '.env');

const envPath =
    packagedEnv && fs.existsSync(packagedEnv)
        ? packagedEnv
        : localEnv;

require('dotenv').config({
    path: envPath
});

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    global.serverReady = true;
});