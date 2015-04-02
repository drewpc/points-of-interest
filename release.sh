#!/usr/bin/env bash

# style.css
sass --style compressed --sourcemap=none scss/style.scss dist/points-of-interest.min.css
sass --sourcemap=none scss/style.scss dist/points-of-interest.css

# demo.css
sass --sourcemap=none scss/demo.scss dist/demo.css
