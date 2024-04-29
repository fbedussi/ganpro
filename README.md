# Ganpro

Personal gantt graph generator

## What is this project

Beside being an application to generate Gantt graphs, this is mainly a playground to test the outside in development methodology in React described in [this book](https://outsidein.dev/book/).

## Why I'm trying outside in development

- Tests are needed. The project my team is currently working on is going into serious troubles for the lack of test automation. 
- Unit tests are good, but functional tests are better, especially on the front end, where usually there aren't complex algorithm to be tested, and what matters at the end of the day is that the user can do what it is supposed to do
- Writing tests after the code is hard, because the code was not written to be tested
- So, is you have to write tests (and you really have, usually), it is better to write tests before the code, which means TDD
- I failed many times to apply TDD to the front end development. Due to many reasons:
  - It is hard do meaningful tests outside of a browser, tests are hard to write, because you have to mock a lot of things, and are hard to debug, without the browser dev tools.
  - A lot of times I ended up with tests too coupled with the implementation, with the result that instead for test being helpful during refactoring, they got in the way, because they broke ad every change in the code, and I ended up spending more time fixing the tests than actually changing the code. 

## Conclusion (WIP)

- Outside in development is a form of TDD that can actually be applied to front end development
- Change the code to make it more testable is good. Reusability is one of the goals in development and tests are just another consumer of the code
