# VSCode Log Output Colorizer
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/IBM-Bluemix/vscode-log-output-colorizer/master/LICENSE)
[![Version](https://vsmarketplacebadge.apphb.com/version/IBM.output-colorizer.svg)](https://marketplace.visualstudio.com/items?itemName=IBM.output-colorizer)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/IBM.output-colorizer.svg)](https://marketplace.visualstudio.com/items?itemName=IBM.output-colorizer)
[![Ratings](https://vsmarketplacebadge.apphb.com/rating/IBM.output-colorizer.svg)](https://marketplace.visualstudio.com/items?itemName=IBM.output-colorizer)

Language extension for VSCode/Bluemix Code that adds syntax colorization for both the output/debug/extensions panel and `*.log` files.

**Note: If you are using other extensions that colorize the output panel, it could override and disable this extension.**

Colorization should work with most themes because it uses common theme token style names. It also works with most instances of the output panel. Initially attempts to match common literals (strings, dates, numbers, guids) and warning|info|error|server|local messages.

# Customization

You can customize the semantic identification of the output by adding entries to outputcolorizer.semantics.

## Example:

In settings.json:

```json
    "outputcolorizer.semantics": [
        {
            "pattern": "{.*}",
            "applies": "between",
            "tokenType": "info",
            "tokenModifier": "output"
        },
    ]
```

This will identify anything inside the matching regex pattern as info.output semantics.  Now you are free to add your own color rule:

```json
// settings.json
    "editor.semanticTokenColorCustomizations": {
        "rules": {
            "error.output": "#ff0000",
            "info.output": "#00ff00"
        },
    },
```

## Settings Object:

```typescript
interface SemanticObject {
  pattern: string;    // A Regex compliant string
  applies: 'between' | 'eol' | 'eof';
  tokenType: string;
  tokenModifier: string;
}
```

* pattern
  
  This is a regex string fed into RegExp() class.  Escape rules apply just as they would to the RegExp class in javascript.

* applies

    | Applies | Description |
    | ------- | ----------- |
    | between | From the start to the end of the regex will be identified by the semantic tokenType.tokenModifier |
    | eol     | From the start of the regex match to the end of the line will be identified by the sematnic tokenType.tokenModifier, unless another token occurs before then |
    | eof     | From the start of the regex match to the end of the file will be identified by the sematnic tokenType.tokenModifier, unless another token occurs before then |

* tokenType

    This can be either a [standard token](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#standard-token-types-and-modifiers) or a custom name that you would like to assign values to separately.

* tokenModifier
  
     This can be either a [standard modifier](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#standard-token-types-and-modifiers) or a custom name that you would like to assign values to separately.

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
