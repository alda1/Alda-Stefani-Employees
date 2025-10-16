# AldaStefaniEmployees

1. For parsing csv I used Papa Parser, an efficient javascript library witch helps producing cleaner and more readable code.
(instead of using several built-in js functions for spliting each line and header of csv content).
From a brief research it resulted very popular and it has a good community support. Latest upgrade made on 2024.

2. For UI/UX design I used Angular Material library.

3. I used Signals, one of the latest angular features (Angular 16+), for storing the parsed csv content and all the computed values, based on the requirements.

4. Regarding the supported date formats I have inserted the availability of these three standarts (A. ISO: YYYY-MM-DD, B. European: DD/MM/YYYY, C.USA: MM/DD/YYYY)

5. I inserted three csv samples(first and third with results and second with no overlapping working days) inside src > assets folder of the project. 


Important Notes**

I have applied software engineering principles and design patterns for maintainability and readability of codebase like:
Seperation of concerns, 
Single Responsibility of SOLID principles, 
modularity, Single source of Truth,
Dependency Injection, 
Singlelton service class,
Interface Segregation principle (by creating small focused representative Models) 
Keep it Simple principle(without using advanced build-in js functions).
Also on the template of the component i have used declerative control flows (@for and @if) instead of overloading structural directives(no extra imports required, it keeps light bundle size).
 
   
