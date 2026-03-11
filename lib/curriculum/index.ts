import { intro } from "./modules/01-intro";
import { basicTypes } from "./modules/01b-basic-types";
import { variables } from "./modules/02-variables";
import { variablesLab } from "./modules/03-variables-lab";
import { operators } from "./modules/04-operators";
import { strings } from "./modules/05-strings";
import { stringsWorkshop } from "./modules/06-strings-workshop";
import { stringsLab } from "./modules/06b-strings-lab";
import { bytesModule } from "./modules/07-bytes";
import { controlFlow } from "./modules/08-control-flow";
import { controlFlowWorkshop } from "./modules/09-control-flow-workshop";
import { matchModule } from "./modules/09b-match";
import { loops } from "./modules/10-loops";
import { loopsWorkshop } from "./modules/11-loops-workshop";
import { loopsLab } from "./modules/12-loops-lab";
import { lists } from "./modules/13-lists";
import { listsWorkshop } from "./modules/14-lists-workshop";
import { tuples } from "./modules/15-tuples";
import { listsLab } from "./modules/16-lists-lab";
import { dicts } from "./modules/17-dicts";
import { dictsWorkshop } from "./modules/18-dicts-workshop";
import { sets } from "./modules/19-sets";
import { dictsLab } from "./modules/20-dicts-lab";
import { comprehensions } from "./modules/21-comprehensions";
import { comprehensionsWorkshop } from "./modules/22-comprehensions-workshop";
import { functions } from "./modules/23-functions";
import { functionsWorkshop } from "./modules/24-functions-workshop";
import { closures } from "./modules/25-closures";
import { closuresWorkshop } from "./modules/26-closures-workshop";
import { functionsLab } from "./modules/27-functions-lab";
import { lambdaBuiltins } from "./modules/28-lambda-builtins";
import { functools } from "./modules/29-functools";
import { functoolsWorkshop } from "./modules/30-functools-workshop";
import { decorators } from "./modules/31-decorators";
import { decoratorsWorkshop } from "./modules/32-decorators-workshop";
import { decoratorsLab } from "./modules/33-decorators-lab";
import { classes } from "./modules/34-classes";
import { classesWorkshop } from "./modules/35-classes-workshop";
import { inheritance } from "./modules/36-inheritance";
import { inheritanceWorkshop } from "./modules/37-inheritance-workshop";
import { dunderMethods } from "./modules/38-dunder-methods";
import { classesLab } from "./modules/39-classes-lab";
import { errorHandling } from "./modules/40-error-handling";
import { errorHandlingWorkshop } from "./modules/41-error-handling-workshop";
import { errorHandlingLab } from "./modules/42-error-handling-lab";
import { iterators } from "./modules/43-iterators";
import { generators } from "./modules/44-generators";
import { generatorsWorkshop } from "./modules/45-generators-workshop";
import { contextManagers } from "./modules/46-context-managers";
import { contextManagersWorkshop } from "./modules/47-context-managers-workshop";
import { typeHints } from "./modules/48-type-hints";
import { typeHintsWorkshop } from "./modules/49-type-hints-workshop";
import { abstractClasses } from "./modules/50-abstract-classes";
import { abstractClassesWorkshop } from "./modules/51-abstract-classes-workshop";
import { properties } from "./modules/52-properties";
import { propertiesWorkshop } from "./modules/53-properties-workshop";
import { dataclasses } from "./modules/54-dataclasses";
import { dataclassesWorkshop } from "./modules/55-dataclasses-workshop";
import { modulesPackages } from "./modules/56-modules-packages";
import { modulesPackagesWorkshop } from "./modules/57-modules-packages-workshop";
import { fileIO } from "./modules/58-file-io";
import { fileIOWorkshop } from "./modules/59-file-io-workshop";
import { fileIOLab } from "./modules/60-file-io-lab";
import { collections } from "./modules/61-collections";
import { itertoolsModule } from "./modules/62-itertools";
import { itertoolsWorkshop } from "./modules/63-itertools-workshop";
import { jsonModule } from "./modules/64-json";
import { jsonWorkshop } from "./modules/65-json-workshop";
import { csvWorkshop } from "./modules/66-csv-workshop";
import { regexpModule } from "./modules/67-regexp";
import { regexpWorkshop } from "./modules/68-regexp-workshop";
import { datetimeModule } from "./modules/69-datetime";
import { datetimeWorkshop } from "./modules/70-datetime-workshop";
import { httpBasics } from "./modules/71-http-basics";
import { httpWorkshop } from "./modules/72-http-workshop";
import { httpLab } from "./modules/73-http-lab";
import { threading } from "./modules/74-threading";
import { threadingWorkshop } from "./modules/75-threading-workshop";
import { asyncio } from "./modules/76-asyncio";
import { asyncioWorkshop } from "./modules/77-asyncio-workshop";
import { asyncioLab } from "./modules/78-asyncio-lab";
import { testing } from "./modules/79-testing";
import { testingWorkshop } from "./modules/80-testing-workshop";
import { testingLab } from "./modules/81-testing-lab";
import { logging } from "./modules/82-logging";
import { loggingWorkshop } from "./modules/83-logging-workshop";
import { cliArgparse } from "./modules/84-cli-argparse";
import { cliArgparseWorkshop } from "./modules/85-cli-argparse-workshop";
import { sqlite3Module } from "./modules/86-sqlite3";
import { sqlite3Workshop } from "./modules/87-sqlite3-workshop";
import { sqlite3Lab } from "./modules/88-sqlite3-lab";
import { sorting } from "./modules/89-sorting";
import { sortingWorkshop } from "./modules/90-sorting-workshop";
import { profiling } from "./modules/91-profiling";
import { profilingWorkshop } from "./modules/92-profiling-workshop";
import type { CourseModule } from "./types";

export const curriculum: CourseModule[] = [
  // Block 1: Getting Started
  intro, basicTypes, variables, variablesLab, operators,
  // Block 2: Strings
  strings, stringsWorkshop, stringsLab, bytesModule,
  // Block 3: Control Flow
  controlFlow, controlFlowWorkshop, matchModule,
  // Block 4: Loops
  loops, loopsWorkshop, loopsLab,
  // Block 5: Lists
  lists, listsWorkshop, tuples, listsLab,
  // Block 6: Dictionaries & Sets
  dicts, dictsWorkshop, sets, dictsLab,
  // Block 7: Comprehensions
  comprehensions, comprehensionsWorkshop,
  // Block 8: Functions
  functions, functionsWorkshop, closures, closuresWorkshop, functionsLab,
  // Block 9: Lambda & Built-ins
  lambdaBuiltins, functools, functoolsWorkshop,
  // Block 10: Decorators
  decorators, decoratorsWorkshop, decoratorsLab,
  // Block 11: OOP
  classes, classesWorkshop, inheritance, inheritanceWorkshop, dunderMethods, classesLab,
  // Block 12: Error Handling
  errorHandling, errorHandlingWorkshop, errorHandlingLab,
  // Block 13: Iterators & Generators
  iterators, generators, generatorsWorkshop,
  // Block 14: Context Managers
  contextManagers, contextManagersWorkshop,
  // Block 15: Type Hints
  typeHints, typeHintsWorkshop,
  // Block 16: Abstract Classes & Properties
  abstractClasses, abstractClassesWorkshop, properties, propertiesWorkshop,
  // Block 17: Dataclasses
  dataclasses, dataclassesWorkshop,
  // Block 18: Modules & Packages
  modulesPackages, modulesPackagesWorkshop,
  // Block 19: File I/O
  fileIO, fileIOWorkshop, fileIOLab,
  // Block 20: Collections & Itertools
  collections, itertoolsModule, itertoolsWorkshop,
  // Block 21: JSON & CSV
  jsonModule, jsonWorkshop, csvWorkshop,
  // Block 22: Regex
  regexpModule, regexpWorkshop,
  // Block 23: Datetime & Time
  datetimeModule, datetimeWorkshop,
  // Block 24: HTTP & Networking
  httpBasics, httpWorkshop, httpLab,
  // Block 25: Threading
  threading, threadingWorkshop,
  // Block 26: asyncio
  asyncio, asyncioWorkshop, asyncioLab,
  // Block 27: Testing
  testing, testingWorkshop, testingLab,
  // Block 28: Logging
  logging, loggingWorkshop,
  // Block 29: CLI
  cliArgparse, cliArgparseWorkshop,
  // Block 30: SQLite3
  sqlite3Module, sqlite3Workshop, sqlite3Lab,
  // Block 31: Sorting & Algorithms
  sorting, sortingWorkshop,
  // Block 32: Performance & Profiling
  profiling, profilingWorkshop,
];

export function getModuleBySlug(slug: string): CourseModule | undefined {
  return curriculum.find((m) => m.slug === slug);
}

export function getModuleIndex(slug: string): number {
  return curriculum.findIndex((m) => m.slug === slug);
}
