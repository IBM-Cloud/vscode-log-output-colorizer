# VSCode Log Output Colorizer
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/IBM-Bluemix/vscode-log-output-colorizer/master/LICENSE)
[![Version](https://vsmarketplacebadge.apphb.com/version/IBM.output-colorizer.svg)](https://marketplace.visualstudio.com/items?itemName=IBM.output-colorizer)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/IBM.output-colorizer.svg)](https://marketplace.visualstudio.com/items?itemName=IBM.output-colorizer)
[![Ratings](https://vsmarketplacebadge.apphb.com/rating/IBM.output-colorizer.svg)](https://marketplace.visualstudio.com/items?itemName=IBM.output-colorizer)

Language extension for VSCode/Bluemix Code that adds syntax colorization for both the output/debug/extensions panel and `*.log` files.

**Note: If you are using other extensions that colorize the output panel, it could override and disable this extension.**

Colorization should work with most themes because it uses common theme token style names. It also works with most instances of the output panel. Initially attempts to match common literals (strings, dates, numbers, guids) and warning|info|error|server|local messages.

## Change Log

* **0.1.2** - Updated for compliance with upcoming VS Code marketplace changes
* **0.1.1** - Regex updates for color coding support

## Contributing
You can contribute to the project by reading the [Contribution guidelines](https://github.com/IBM-Bluemix/vscode-log-output-colorizer/blob/master/CONTRIBUTING.md)

## In action

### VSCode Git Output
![Colorized Git Output](https://raw.githubusercontent.com/IBM-Bluemix/vscode-log-output-colorizer/master/github-assets/screenshot-4.jpg)

### Default Dark Theme
![Default Dark Theme](https://raw.githubusercontent.com/IBM-Bluemix/vscode-log-output-colorizer/master/github-assets/screenshot-1.jpg)

### Default Light Theme
![Default Light Theme](https://raw.githubusercontent.com/IBM-Bluemix/vscode-log-output-colorizer/master/github-assets/screenshot-2.jpg)

### Night Blue Theme
![Night Blue Theme](https://raw.githubusercontent.com/IBM-Bluemix/vscode-log-output-colorizer/master/github-assets/screenshot-3.jpg)

## Helpful References:

* https://code.visualstudio.com/docs/customization/colorizer
* http://stackoverflow.com/questions/33403324/how-to-create-a-simple-custom-language-colorization-to-vs-code 
* http://manual.macromates.com/en/language_grammars

## Support
You can open an issue on the [GitHub repo](https://github.com/IBM-Bluemix/vscode-log-output-colorizer/issues)

## License
[MIT](LICENSE)

## Attribution
Portions of the language grammar are based off of a StackOverflow question, asked by user [emilast](http://stackoverflow.com/users/736684/emilast) and answered by user [Wosi](http://stackoverflow.com/users/2023316/wosi), availble under [Creative Commons](http://blog.stackoverflow.com/2009/06/attribution-required/) at: http://stackoverflow.com/questions/33403324/how-to-create-a-simple-custom-language-colorization-to-vs-code 
