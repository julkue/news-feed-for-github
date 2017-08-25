#Contributing

##1. Issues

###1.1 Questions, Problems and Bugs

When opening an issue please provide:

- browser and version
- news-feed-for-github version
- expected behavior
- actual behavior
- steps to reproduce

###1.2 Feature Requests

Please provide the following information's:

- your use case, why your enhancement is necessary
- how to solve it in your opinion

##2. Development

###2.1 General

Contributions are very much appreciated. To get started, clone this
repository and run `$ npm install` as well as `$ bower install`.

To test your changes, run `$ grunt dist`. This will generate a `.xpi` package for
Firefox and a `.zip` for Chrome to `.dist/`. You can pass `--chrome=true` or
`--firefox=true` to just generate one of them.

###2.2 Pull Requests

Make sure that your Pull Requests follow the [code convention][code-convention].
If you are using Atom with Atom Beautify you can enter `STRG + Alt + b` to format
the source code to follow the convention.

###2.3 Contribution and License Agreement

If you contribute to this project, you are implicitly allowing your code to be
distributed under [this license][license]. You are also implicitly verifying
that all code is your original work.

[code-convention]: https://github.com/julmot/news-feed-for-github/blob/master/.eslintrc
[license]: https://git.io/vM5kZ
