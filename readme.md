# Basic User Schema

  A barebones MongoDB User Schema to extend from.

  This is still a WIP, not ready for production yet!

  [![Build Status](https://secure.travis-ci.org/RGBboy/basic-user-schema.png)](http://travis-ci.org/RGBboy/basic-user-schema)

## Features

  * Simple, Simple, Simple! Just enough to get you started.
  * Bcrypted passwords.
  * Validation.
  * Use as is, or extend it to add your own properties.

## Installation

    npm install git://github.com/RGBboy/basic-user-schema.git

## Usage

Require it:

``` javascript
  UserSchema = require('basic-user-schema');
```

## Todo

  * role? emailToken? and emailTokenCreated? Move to an extended module?
  * Make validation errors easy to work with for controllers.
  * Write rest of Schema Tests:
    - write tests for id property
    - write tests for instance methods

## License 

(The MIT License)

Copyright (c) 2012 RGBboy &lt;me@rgbboy.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.