const { exec } = require('child_process');

// Вызовите visualizer.js с параметрами
exec('node visualizer.js express output.puml 2', (error, stdout, stderr) => {
    if (error) {
        console.error(`Ошибка: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Ошибка: ${stderr}`);
        return;
    }
    console.log(`Вывод: ${stdout}`);
});
