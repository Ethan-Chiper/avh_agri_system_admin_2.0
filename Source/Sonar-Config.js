/* eslint-disable no-undef */
const SonarQubeScanner = require('sonarqube-scanner');

SonarQubeScanner(
    {
        serverUrl: 'http://192.168.0.108:9000',
        options: {
            'sonar.projectDescription': 'This is a Node JS application',
            'sonar.projectName': 'agri-system',
            'sonar.projectKey': 'agri-system',
            'sonar.login': 'sqp_ae77d13041f1f981c1e1e69ec10be7cc995349af',
            'sonar.projectVersion': '1.0',
            'sonar.language': 'js',
            'sonar.sourceEncoding': 'UTF-8',
            'sonar.sources': '.',
            //'sonar.tests': 'specs',
            //'sonar.inclusions' : 'src/**'
            'sonar.java.binaries': '**/*.java'
        }
    },
    () => { }
);