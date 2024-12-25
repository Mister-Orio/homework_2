const axios = require('axios');
const fs = require('fs');

async function getDependencies(packageName, depth) {
    if (depth === 0) return [];

    console.log(`Получение зависимостей для ${packageName} на глубине ${depth}...`);

    try {
        const response = await axios.get(`https://registry.npmjs.org/${packageName}`);

        // Выводим весь ответ для отладки
        console.log(`Ответ от npm для ${packageName}:`, response.data);

        const dependencies = response.data.dependencies || {};
        const dependencyNames = Object.keys(dependencies);

        console.log(`Найденные зависимости для ${packageName}:`, dependencyNames);

        let allDependencies = dependencyNames;

        for (const dep of dependencyNames) {
            const nestedDeps = await getDependencies(dep, depth - 1);
            allDependencies = allDependencies.concat(nestedDeps);
        }

        return [...new Set(allDependencies)]; // Уникальные зависимости
    } catch (error) {
        console.error(`Ошибка при получении зависимостей для ${packageName}:`, error.message);
        return [];
    }
}

async function visualizeDependencies(packageName, outputPath, maxDepth) {
    const dependencies = await getDependencies(packageName, maxDepth);

    console.log(`Общие зависимости для ${packageName}:`, dependencies);

    let plantUML = '@startuml\n';
    dependencies.forEach(dep => {
        plantUML += `  ${packageName} --> ${dep}\n`;
    });
    plantUML += '@enduml';

    fs.writeFileSync(outputPath, plantUML);
    console.log(`Генерация завершена. Вывод сохранен в ${outputPath}`);
}

// Получение аргументов командной строки
const packageName = process.argv[2]; // Имя пакета
const outputPath = process.argv[3];   // Путь к выходному файлу
const maxDepth = parseInt(process.argv[4], 10); // Максимальная глубина

visualizeDependencies(packageName, outputPath, maxDepth);